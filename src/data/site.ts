export const site = {
  name: 'Deea Body Center',
  city: 'Ploiești',
  phone: '0723 882 529',
  phoneHref: 'tel:+40723882529',
  whatsapp: '40723882529', // fără +, pentru wa.me
  email: '', // completează dacă e cazul
  // Extras din pagina live /contact/ (curl, 2026-07-05): og:description + corpul paginii conțin
  // textul "Str. Vlad Tepes nr. 21B. (in sensul giratoriu), Ploiesti, Romania." — diacritice
  // restaurate aici pe numele propriu (Țepeș/Ploiești) pentru câmpurile structurate (schema.org,
  // Task 9); textul afișat pe pagina Contact reproduce sursa live verbatim (fără diacritice).
  // Cod poștal: NU apare pe pagina live — lăsat gol, de completat manual dacă e necesar.
  address: {
    street: 'Str. Vlad Țepeș nr. 21B (în sensul giratoriu)',
    city: 'Ploiești',
    region: 'Prahova',
    country: 'RO',
    postalCode: '',
  },
  // Coordonate extrase din iframe-ul Google Maps embed de pe pagina live /contact/:
  // pb=...!2d26.015518876596058!3d44.939824668272315!... → format standard Google Maps embed
  // "!2d{lng}!3d{lat}" (longitudine apoi latitudine) — verificat: se potrivesc cu Ploiești, RO.
  geo: { lat: 44.939825, lng: 26.015519 },
  hours: [
    { days: 'Luni – Vineri', open: '09:00', close: '20:00' },
    { days: 'Sâmbătă', open: '10:00', close: '16:00' },
    { days: 'Duminică', open: null, close: null }, // închis
  ],
  // URL-uri verificate din pagina live /contact/ (meta article:publisher + linkuri social-icons):
  // facebook.com/DeeaBodyCenter, instagram.com/deeabody_center/ — nu erau completate anterior
  // (Header/Footer/ContactBlock foloseau fallback "#"), acum active pe tot site-ul.
  social: { facebook: 'https://www.facebook.com/DeeaBodyCenter', instagram: 'https://www.instagram.com/deeabody_center/' },
  ga4: 'G-JX978SL3G5',
  tagline: 'Redefinește-ți silueta, redescoperă-ți încrederea!',
} as const;

export function waLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
