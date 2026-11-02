// Ofertele Black Friday pregătite pentru randare: poster, imaginea tratamentului (pentru
// ofertele fără poster), link-ul spre tratament și link-ul WhatsApp precompletat.
import type { ImageMetadata } from 'astro';
import { getCollection } from 'astro:content';
import { blackFriday } from './blackFriday';
import { waLink } from './site';

const posterFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/black-friday/bf-*.jpg', {
  eager: true,
});

export async function getBlackFridayOffers() {
  const treatments = new Map((await getCollection('treatments')).map((t) => [t.id, t]));

  return blackFriday.offers.map((offer) => {
    const treatment = treatments.get(offer.treatment);
    if (!treatment) throw new Error(`Black Friday: missing treatment "${offer.treatment}"`);
    const poster = 'poster' in offer ? posterFiles[`../assets/black-friday/${offer.poster}`]?.default : undefined;
    if ('poster' in offer && !poster) throw new Error(`Black Friday: missing poster "${offer.poster}"`);
    const label = 'detail' in offer ? `${offer.name} – ${offer.detail}` : offer.name;
    return {
      name: offer.name,
      detail: 'detail' in offer ? offer.detail : undefined,
      price: offer.price,
      label,
      poster,
      photo: treatment.data.heroImage,
      href: `/${treatment.id}/`,
      alt: `Black Friday ${blackFriday.dates}: ${label}, ${offer.price}, ${blackFriday.deal}`,
      wa: waLink(`Bună! Aș dori să comand oferta Black Friday: ${label} (${offer.price}, ${blackFriday.deal}).`),
    };
  });
}

export type BlackFridayOfferView = Awaited<ReturnType<typeof getBlackFridayOffers>>[number];
