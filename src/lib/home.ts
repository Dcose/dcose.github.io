import type { PostReference } from './post-references';

export type HomePost = {
  id: string;
  title: string;
  date: string;
  tags: string[];
};

export type GraphNode = {
  id: string;
  label: string;
  group: 'tag' | 'note';
  count?: number;
  date?: string;
};

export type GraphLink = {
  source: string;
  target: string;
  kind: 'tag' | 'ref';
};

export function getTagCounts(posts: readonly HomePost[]) {
  const counts: Record<string, number> = {};
  for (const post of posts) for (const tag of post.tags) counts[tag] = (counts[tag] ?? 0) + 1;
  return counts;
}

export function buildGraphData(posts: readonly HomePost[], outgoing: ReadonlyMap<string, readonly PostReference[]>) {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const counts = getTagCounts(posts);
  const tags = Object.entries(counts)
    .sort((first, second) => second[1] - first[1])
    .map(([tag]) => tag);

  for (const tag of tags) {
    nodes.push({ id: `tag:${tag}`, label: `#${tag}`, group: 'tag', count: counts[tag] });
  }

  const refPairs = new Set<string>();

  for (const post of posts) {
    nodes.push({
      id: `note:${post.id}`,
      label: post.title,
      group: 'note',
      date: post.date.slice(0, 7).replaceAll('-', '.'),
    });
    for (const tag of post.tags) {
      links.push({ source: `tag:${tag}`, target: `note:${post.id}`, kind: 'tag' });
    }
    for (const target of outgoing.get(post.id) ?? []) {
      const pairKey = [post.id, target.id].sort().join('::');
      if (refPairs.has(pairKey)) continue;
      refPairs.add(pairKey);
      links.push({ source: `note:${post.id}`, target: `note:${target.id}`, kind: 'ref' });
    }
  }

  return { nodes, links };
}
