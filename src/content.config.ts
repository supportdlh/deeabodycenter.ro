// Content Collections — schema din spec §5 (docs/superpowers/specs/2026-07-05-deeabodycenter-astro-clone-design.md).
// NOTĂ: Astro 7 a eliminat content collections „legacy" (src/content/config.ts);
// fișierul de configurare trebuie să fie `src/content.config.ts`, cu `loader` explicit.
// Rutare: slug-ul provine din NUMELE fișierului (ex. `tratament-sculptor.md` → `/tratament-sculptor/`),
// NU dintr-un câmp `slug` în frontmatter — o singură sursă de adevăr pentru URL.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const treatments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/treatments' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['facial', 'corporal']),
      excerpt: z.string(),
      heroImage: image(),
      sidebarImage: image().optional(),
      intro: z.array(z.string()),
      // Paragrafe scurte specifice sidebar-ului (ex. „6 terapii PREMIUM...", brevet FDA),
      // distincte de `excerpt` (folosit și pentru subtitlul din hero) — extensie minimă,
      // necesară pentru a păstra 100% din conținutul original (reference/content.md).
      sidebarPromo: z.array(z.string()).optional(),
      sections: z.array(
        z.object({
          group: z.enum(['Corporal', 'Facial']),
          items: z.array(
            z.object({
              title: z.string(),
              body: z.string(),
              open: z.boolean().optional(),
            }),
          ),
        }),
      ),
      benefits: z.array(z.string()).optional(),
      order: z.number(),
      seo: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
});

const offers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/offers' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      image: image(),
      body: z.string(),
      category: z.string(),
      seo: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
});

export const collections = { treatments, offers };
