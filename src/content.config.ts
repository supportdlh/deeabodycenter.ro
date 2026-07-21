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
      // Titlu opțional pentru sidebar — dacă lipsește, se derivă din `title`
      // eliminând prefixul „Tratament ” (vezi TreatmentLayout.astro).
      sidebarTitle: z.string().optional(),
      category: z.enum(['facial', 'corporal']),
      excerpt: z.string(),
      // Subtitlu opțional al hero-ului (textul mare Playfair de sub titlu de pe LIVE,
      // ex. „Sculptor este un echipament de ultima generație…"). Distinct de `excerpt`.
      // Dacă lipsește, TreatmentLayout revine la `excerpt`. Un pas de conținut îl va
      // completa cu textul real din hero-ul live, per tratament.
      heroSubtitle: z.string().optional(),
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
          // Titlu descriptiv opțional afișat deasupra grupului de acordeoane
          // (ex. „Beneficiile slabirii prin criolipoliza"). Dacă lipsește,
          // TreatmentLayout revine la eticheta `group`.
          heading: z.string().optional(),
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
      // Galeria de imagini a paginii (carusel/grilă Elementor de pe site-ul original).
      // Căi absolute către imagini din `public/galleries/<slug>/` (ex. `/galleries/criolipoliza/1.webp`).
      // Nu folosim image() aici: sunt zeci de imagini per pagină (deja webp optimizate din WP),
      // le servim direct din public/ ca să nu încetinim build-ul.
      gallery: z.array(z.string()).optional(),
      // Titlu opțional al secțiunii de galerie (ex. „Tratament Criolipoliză Cryogen").
      // Dacă lipsește, TreatmentLayout revine la `title`.
      galleryTitle: z.string().optional(),
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
      // Extensie ADITIVĂ, opțională — pachetele de preț (Abonament nr. X, tarife fixe etc.)
      // afișate pe paginile live de oferte (deeabodycenter.ro/oferte-*) sunt structurate ca
      // liste de proceduri + preț, NU ca proză continuă; `body` (proză) nu le poate reda fidel
      // fără paginare artificială. Opțional pentru că pagina „Oferte speciale" nu are pachete
      // text (conținutul ei real e doar un colaj de imagini promoționale rotative, nedurabile).
      packages: z
        .array(
          z.object({
            title: z.string().optional(),
            items: z.array(z.string()),
            price: z.string(),
            oldPrice: z.string().optional(),
            badge: z.string().optional(),
          }),
        )
        .optional(),
      // Galeria de imagini promoționale a paginii de ofertă (căi din `public/galleries/<slug>/`).
      gallery: z.array(z.string()).optional(),
      // Bannere promoționale afișate imediat SUB hero (grilă 2 pe rând), pe pagina
      // „corporale". Căi absolute din `public/galleries/<slug>/`. Distinct de `gallery`
      // (cardurile „Abonament nr. X") și de `introPromo` (blocul text+imagine).
      promoBanners: z.array(z.string()).optional(),
      // Texte alternative pentru `promoBanners`, în aceeași ordine. Bannerele sunt
      // imagini în care TOT conținutul (titlu, beneficii, preț) e text randat grafic —
      // fără alt descriptiv, informația e invizibilă pentru cititoare de ecran și motoare
      // de căutare. Opțional: dacă lipsește, se cade pe un alt generic.
      promoBannersAlt: z.array(z.string()).optional(),
      // Blocul promo intro (doar pagina „corporale" pe desktop): titlu serif, un
      // paragraf-intro, o etichetă de listă, bulete cu emoji, un preț mare și imaginea
      // promo din dreapta. Transcris VERBATIM din live (deeabodycenter.ro/oferte-tratamente-corporale).
      introPromo: z
        .object({
          heading: z.string(),
          intro: z.string().optional(),
          listLabel: z.string().optional(),
          items: z.array(z.string()).optional(),
          bulletEmoji: z.string().optional(),
          price: z.string(),
          image: z.string(),
        })
        .optional(),
      seo: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
});

export const collections = { treatments, offers };
