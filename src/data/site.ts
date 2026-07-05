export const site = {
  name: 'Deea Body Center',
  city: 'Ploiești',
  phone: '0723 882 529',
  phoneHref: 'tel:+40723882529',
  whatsapp: '40723882529', // fără +, pentru wa.me
  email: '', // completează dacă e cazul
  address: { street: '', city: 'Ploiești', region: 'Prahova', country: 'RO', postalCode: '' }, // COMPLETEAZĂ din pagina Contact/GBP
  geo: { lat: 0, lng: 0 }, // COMPLETEAZĂ din GBP
  hours: [
    { days: 'Luni – Vineri', open: '09:00', close: '20:00' },
    { days: 'Sâmbătă', open: '10:00', close: '16:00' },
    { days: 'Duminică', open: null, close: null }, // închis
  ],
  social: { facebook: '', instagram: '' }, // COMPLETEAZĂ URL-urile reale
  ga4: 'G-JX978SL3G5',
  tagline: 'Redefinește-ți silueta, redescoperă-ți încrederea!',
} as const;

export function waLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
