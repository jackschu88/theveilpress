import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/articles' }),
  // passthrough: Bezalel packages may include key_entities and future fields
  schema: z
    .object({
      id: z.string(),
      title: z.string(),
      date: z.coerce.date(),
      slug: z.string(),
      density: z.enum(['thin', 'medium', 'dense']),
      framing: z.enum(['default', 'veil']),
      tags: z.array(z.string()).default([]),
      entityIds: z.array(z.string()).optional().default([]),
      claimIds: z.array(z.string()).optional().default([]),
      key_entities: z.array(z.string()).optional().default([]),
      dek: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      series: z.union([z.string(), z.array(z.string())]).optional().default([]),
      citations: z.array(z.string()).optional().default([]),
      seo_title: z.string().optional(),
      nci_overall: z.number().optional(),
      status: z.enum(['draft', 'published']).optional().default('published'),
      author: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { articles };
