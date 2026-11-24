import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ base: './content/posts', pattern: '*/index.md', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) => z.object({
    cover: image().optional(),
    title: z.string().trim().min(1),
    date: z.coerce.date(),
    tags: z.array(z.string().trim().min(1)),
    summary: z.string().optional(),
  }),
});

export const collections = { posts };
