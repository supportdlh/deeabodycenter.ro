// /llms.txt (https://llmstxt.org): a plain-Markdown summary of the site for AI assistants.
// Built from the same data as the pages (site.ts + content collections), so it never drifts
// from the live content. Prices are only linked: /tarife/ stays the single source.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site, waLink } from '../data/site';

export const GET: APIRoute = async ({ site: origin }) => {
  const url = (path: string) => new URL(path, origin).href;

  const treatments = await getCollection('treatments');
  const byCategory = (category: 'facial' | 'corporal') =>
    treatments
      .filter((t) => t.data.category === category)
      .sort((a, b) => a.data.order - b.data.order)
      .map((t) => `- [${t.data.title}](${url(`/${t.id}/`)}): ${t.data.seo.description}`)
      .join('\n');

  const offers = (await getCollection('offers'))
    .sort((a, b) => a.data.title.localeCompare(b.data.title, 'ro'))
    .map((o) => `- [${o.data.title}](${url(`/${o.id}/`)})`)
    .join('\n');

  const hours = site.hours
    .map((h) => `- ${h.days}: ${h.open ? `${h.open} – ${h.close}` : 'închis'}`)
    .join('\n');

  const body = `# ${site.name}

> Salon de remodelare corporală și tratamente faciale în ${site.city}. ${site.tagline}

## Contact și programări

- Adresă: ${site.address.street}, ${site.address.city}, ${site.address.region}, România
- Telefon: ${site.phone}
- Programări: WhatsApp ${waLink()} sau telefonic
- [Contact și hartă](${url('/contact/')})

Program:
${hours}

## Tarife

- [Tarife tratamente corporale și faciale](${url('/tarife/')}): lista completă de prețuri

## Tratamente corporale

${byCategory('corporal')}

## Tratamente faciale

${byCategory('facial')}

## Oferte

${offers}

## Optional

- [Toate serviciile](${url('/servicii-tratamente-faciale-si-corporale/')})
- [Facebook](${site.social.facebook})
- [Instagram](${site.social.instagram})
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
