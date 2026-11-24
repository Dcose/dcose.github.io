import { fromMarkdown } from 'mdast-util-from-markdown';
import type { Nodes } from 'mdast';

export type PostReference = { id: string; title: string };
type Entry = { id: string; data: { title: string }; body?: string };

export function collectPostReferences(entries: readonly Entry[], site?: string) {
  const titles = new Map(entries.map(entry => [entry.id, entry.data.title]));
  const outgoing = new Map<string, PostReference[]>();
  const origin = new URL(site || 'https://kyanite.invalid').origin;

  for (const entry of entries) {
    const base = new URL(`/posts/${entry.id}/`, origin);
    const targets = new Set<string>();
    const visit = (node: Nodes) => {
      if (node.type === 'link' && URL.canParse(node.url, base)) {
        const url = new URL(node.url, base);
        const target = url.pathname.match(/^\/posts\/([^/]+)\/?$/)?.[1];
        if (url.origin === origin && target && target !== entry.id && titles.has(target)) targets.add(target);
      }
      if ('children' in node) node.children.forEach(visit);
    };
    visit(fromMarkdown(entry.body ?? ''));
    outgoing.set(entry.id, Array.from(targets, id => ({ id, title: titles.get(id)! })));
  }
  return outgoing;
}
