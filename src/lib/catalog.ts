import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';

export function postSummary(body: string, summary?: string) {
  if (summary?.trim()) return summary.trim();
  for (const block of fromMarkdown(body).children) {
    if (block.type !== 'paragraph') continue;
    const text = toString(block, { includeImageAlt: false, includeHtml: false }).trim();
    if (text) return text;
  }
  return '';
}

export function matchesPost(post: {title: string; summary: string; tags: readonly string[]}, tag: string, query: string) {
  return (!tag || post.tags.includes(tag)) && [post.title, post.summary, ...post.tags].some(
    value => value.toLowerCase().includes(query.trim().toLowerCase()),
  );
}
