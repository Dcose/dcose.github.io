import { useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import type { GraphLink, GraphNode } from '../lib/home';

type Props = { nodes: readonly GraphNode[]; links: readonly GraphLink[] };
type Mode = 'radial' | 'force';
type Point = { x: number; y: number; angle?: number };
type SimNode = GraphNode & { x: number; y: number; vx: number; vy: number };

const WIDTH = 680;
const HEIGHT = 380;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;

function computeRadialPositions(nodes: readonly GraphNode[]) {
  const tagNodes = nodes.filter(node => node.group === 'tag');
  const noteNodes = nodes.filter(node => node.group === 'note');
  const innerR = tagNodes.length <= 2 ? 56 : 74;
  const outerR = 146;
  const map = new Map<string, Point>();

  tagNodes.forEach((node, index) => {
    const angle = -Math.PI / 2 + (index / Math.max(1, tagNodes.length)) * Math.PI * 2;
    map.set(node.id, {
      x: CX + Math.cos(angle) * innerR,
      y: CY + Math.sin(angle) * innerR,
      angle,
    });
  });

  noteNodes.forEach((node, index) => {
    const offset = tagNodes.length > 0 ? 0.32 : 0;
    const angle = -Math.PI / 2 + offset + (index / Math.max(1, noteNodes.length)) * Math.PI * 2;
    map.set(node.id, {
      x: CX + Math.cos(angle) * outerR,
      y: CY + Math.sin(angle) * outerR,
      angle,
    });
  });

  return { innerR, outerR, positions: map };
}

function truncateLabel(text: string, max = 18) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export default function KnowledgeGraph({ nodes, links }: Props) {
  const [mode, setMode] = useState<Mode>('radial');
  const [hovered, setHovered] = useState<string | null>(null);
  const [forceTick, setForceTick] = useState(0);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const simRef = useRef<SimNode[]>([]);
  const draggingRef = useRef<string | null>(null);
  const dragMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const wakeRef = useRef<(() => void) | null>(null);

  const radial = useMemo(() => computeRadialPositions(nodes), [nodes]);
  const hasRefLinks = useMemo(() => links.some(link => link.kind === 'ref'), [links]);

  const initForceNodes = () => {
    simRef.current = nodes.map(node => {
      const base = radial.positions.get(node.id) ?? { x: CX, y: CY };
      return { ...node, x: base.x, y: base.y, vx: 0, vy: 0 };
    });
    setForceTick(tick => tick + 1);
  };

  useEffect(() => {
    if (mode !== 'force') return;
    if (simRef.current.length !== nodes.length) {
      initForceNodes();
    }

    let rafId = 0;
    let active = true;
    let energy = 1;

    const step = () => {
      if (!active) return;
      const list = simRef.current;
      const byId = new Map(list.map(item => [item.id, item]));
      const draggingId = draggingRef.current;

      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          const force = 2600 / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (a.id !== draggingId) {
            a.vx -= fx;
            a.vy -= fy;
          }
          if (b.id !== draggingId) {
            b.vx += fx;
            b.vy += fy;
          }
        }
      }

      for (const link of links) {
        const a = byId.get(link.source);
        const b = byId.get(link.target);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetLen = link.kind === 'ref' ? 128 : 96;
        const force = (dist - targetLen) * 0.026;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (a.id !== draggingId) {
          a.vx += fx;
          a.vy += fy;
        }
        if (b.id !== draggingId) {
          b.vx -= fx;
          b.vy -= fy;
        }
      }

      let totalSpeed = 0;
      for (const item of list) {
        if (item.id === draggingId) continue;
        item.vx += (CX - item.x) * 0.006;
        item.vy += (CY - item.y) * 0.009;
        item.vx *= 0.84;
        item.vy *= 0.84;
        item.x = Math.max(68, Math.min(WIDTH - 68, item.x + item.vx));
        item.y = Math.max(28, Math.min(HEIGHT - 32, item.y + item.vy));
        totalSpeed += Math.abs(item.vx) + Math.abs(item.vy);
      }

      setForceTick(tick => tick + 1);
      energy = draggingId ? 1 : totalSpeed / Math.max(1, list.length);
      if (energy > 0.04) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = 0;
      }
    };

    wakeRef.current = () => {
      if (!rafId && active) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      active = false;
      wakeRef.current = null;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mode, nodes, links]);

  const activeId = hovered;

  const neighborMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const node of nodes) map.set(node.id, new Set());
    for (const link of links) {
      map.get(link.source)?.add(link.target);
      map.get(link.target)?.add(link.source);
    }
    return map;
  }, [nodes, links]);

  const activeNeighbors = activeId ? (neighborMap.get(activeId) ?? new Set<string>()) : new Set<string>();
  const activeNode = activeId ? nodes.find(node => node.id === activeId) : undefined;

  const positions = useMemo(() => {
    if (mode === 'radial') return radial.positions;
    const map = new Map<string, Point>();
    for (const item of simRef.current) map.set(item.id, { x: item.x, y: item.y });
    return map;
  }, [mode, radial, forceTick]);

  const triggerNodeAction = (node: GraphNode) => {
    if (node.group === 'note') {
      navigate(`/posts/${node.id.slice(5)}/`);
    } else {
      const tag = node.label.replace(/^#/, '');
      window.dispatchEvent(new CustomEvent('kyanite:filter-tag', { detail: { tag } }));
    }
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (mode !== 'force' || !draggingRef.current || !svgRef.current) return;
    const target = simRef.current.find(item => item.id === draggingRef.current);
    if (!target) return;
    if (!dragMovedRef.current && Math.hypot(event.clientX - dragStartRef.current.x, event.clientY - dragStartRef.current.y) < 5) return;
    dragMovedRef.current = true;
    const rect = svgRef.current.getBoundingClientRect();
    target.x = Math.max(52, Math.min(WIDTH - 52, ((event.clientX - rect.left) / rect.width) * WIDTH));
    target.y = Math.max(28, Math.min(HEIGHT - 32, ((event.clientY - rect.top) / rect.height) * HEIGHT));
    target.vx = 0;
    target.vy = 0;
    setForceTick(tick => tick + 1);
    wakeRef.current?.();
  };

  const handlePointerUp = () => {
    if (draggingRef.current) {
      draggingRef.current = null;
      wakeRef.current?.();
    }
  };

  const switchMode = (nextMode: Mode) => {
    if (nextMode === mode) return;
    if (nextMode === 'force') {
      initForceNodes();
    }
    setMode(nextMode);
  };

  return (
    <div className="graph-shell">
      <svg
        ref={svgRef}
        className="kg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="group"
        aria-label="文章与标签知识图谱"
        onMouseLeave={() => setHovered(null)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {mode === 'radial' && (
          <g aria-hidden="true">
            <circle cx={CX} cy={CY} r={radial.innerR} className="kg-guide kg-guide-inner" />
            <circle cx={CX} cy={CY} r={radial.outerR} className="kg-guide" />
          </g>
        )}

        {(() => {
          const edgeData = links
            .map(link => {
              const source = positions.get(link.source);
              const target = positions.get(link.target);
              if (!source || !target) return null;
              const isLit = Boolean(activeId && (activeId === link.source || activeId === link.target));
              const isDim = Boolean(activeId && !isLit);
              const start = activeId && activeId === link.target ? target : source;
              const end = start === source ? target : source;
              const key = `${link.kind}:${link.source}-${link.target}`;
              let d = '';
              if (mode === 'radial') {
                const mx = (start.x + end.x) / 2;
                const my = (start.y + end.y) / 2;
                const qx = mx + (CX - mx) * 0.28;
                const qy = my + (CY - my) * 0.28;
                d = `M ${start.x} ${start.y} Q ${qx} ${qy} ${end.x} ${end.y}`;
              }
              return { link, start, end, d, key, isLit, isDim };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);

          return (
            <>
              <g aria-hidden="true">
                {edgeData.map(({ key, d, start, end, isLit }) =>
                  mode === 'radial' ? (
                    <path key={`halo:${key}`} d={d} className={`kg-edge-halo${isLit ? ' is-lit' : ''}`} />
                  ) : (
                    <line
                      key={`halo:${key}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      className={`kg-edge-halo${isLit ? ' is-lit' : ''}`}
                    />
                  ),
                )}
              </g>
              <g>
                {edgeData.map(({ link, key, d, start, end, isLit, isDim }) => {
                  const className = [
                    'kg-edge',
                    link.kind === 'ref' ? 'post-ref' : '',
                    isLit ? 'is-lit' : '',
                    isDim ? 'is-dim' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');
                  return mode === 'radial' ? (
                    <path key={key} d={d} pathLength={100} className={className} />
                  ) : (
                    <line
                      key={key}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      pathLength={100}
                      className={className}
                    />
                  );
                })}
              </g>
              <g aria-hidden="true">
                {edgeData.map(({ key, d, start, end, isLit }) =>
                  mode === 'radial' ? (
                    <g key={`orb-g:${key}`}>
                      <path
                        d={d}
                        pathLength={100}
                        className={`kg-edge-orb-glow${isLit ? ' is-lit' : ''}`}
                      />
                      <path
                        d={d}
                        pathLength={100}
                        className={`kg-edge-orb${isLit ? ' is-lit' : ''}`}
                      />
                    </g>
                  ) : (
                    <g key={`orb-g:${key}`}>
                      <line
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        pathLength={100}
                        className={`kg-edge-orb-glow${isLit ? ' is-lit' : ''}`}
                      />
                      <line
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        pathLength={100}
                        className={`kg-edge-orb${isLit ? ' is-lit' : ''}`}
                      />
                    </g>
                  ),
                )}
              </g>
            </>
          );
        })()}

        {nodes.map(node => {
          const point = positions.get(node.id);
          if (!point) return null;
          const isActive = activeId === node.id;
          const isConnected = isActive || activeNeighbors.has(node.id);
          const isDim = Boolean(activeId && !isConnected);
          const className = [
            'kg-node',
            node.group,
            isActive ? 'is-active' : '',
            isDim ? 'is-dim' : '',
          ].filter(Boolean).join(' ');

          let labelX = point.x;
          let labelY = point.y + 18;
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';

          if (mode === 'radial') {
            const angle = point.angle ?? 0;
            const isRight = Math.cos(angle) >= -0.05;
            labelX = point.x + (isRight ? 11 : -11);
            labelY = point.y + 4;
            textAnchor = isRight ? 'start' : 'end';
          }

          return (
            <g
              key={node.id}
              className={className}
              tabIndex={0}
              role="button"
              aria-label={node.label}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered(null)}
              onPointerDown={event => {
                if (!event.isPrimary || event.button !== 0) return;
                event.preventDefault();
                dragMovedRef.current = false;
                if (mode !== 'force') return;
                event.stopPropagation();
                draggingRef.current = node.id;
                dragStartRef.current = { x: event.clientX, y: event.clientY };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onClick={event => {
                event.stopPropagation();
                if (dragMovedRef.current) {
                  dragMovedRef.current = false;
                  return;
                }
                triggerNodeAction(node);
              }}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  triggerNodeAction(node);
                }
              }}
            >
              <title>{node.group === 'tag' && node.count ? `${node.label} (${node.count})` : node.label}</title>
              <circle cx={point.x} cy={point.y} r={12} fill="transparent" />
              <circle className="dot" cx={point.x} cy={point.y} r={node.group === 'tag' ? 5.5 : 4.5} />
              <text className="label" x={labelX} y={labelY} textAnchor={textAnchor}>
                {truncateLabel(node.label)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="graph-shell-foot">
        <div className="graph-foot-info">
          {activeNode ? (
            <>
              <strong>{activeNode.label}</strong>
              <span className="graph-foot-meta">· {activeNeighbors.size} 项关联</span>
              <button type="button" className="foot-btn" onClick={() => triggerNodeAction(activeNode)}>
                {activeNode.group === 'tag' ? '筛选此标签 →' : '打开文章 →'}
              </button>
            </>
          ) : (
            <div className="graph-legend">
              <span className="legend-item"><i className="legend-dot-tag" />标签</span>
              <span className="legend-item"><i className="legend-dot-note" />文章</span>
              {hasRefLinks && <span className="legend-item"><i className="legend-dash" />站内互链</span>}
            </div>
          )}
        </div>

        <div className="graph-foot-ctrl">
          {mode === 'force' && (
            <button
              type="button"
              className="foot-btn muted"
              onClick={() => {
                initForceNodes();
                wakeRef.current?.();
              }}
            >
              重置
            </button>
          )}
          <div className="graph-mode-switch" role="group" aria-label="图谱布局模式">
            <button
              type="button"
              className={mode === 'radial' ? 'is-active' : undefined}
              onClick={() => switchMode('radial')}
            >
              星环
            </button>
            <button
              type="button"
              className={mode === 'force' ? 'is-active' : undefined}
              onClick={() => switchMode('force')}
            >
              力导
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
