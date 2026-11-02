/*
 * Campania Black Friday 2026 (2–4 noiembrie). Prețurile și condițiile sunt transcrise
 * VERBATIM din posterele primite de la client (2026-10-31) — nu se modifică fără acordul lui.
 * `treatment` = id-ul din colecția `treatments` (link-ul spre pagina tratamentului).
 * `poster` = posterul ofertei din src/assets/black-friday/ (bf-hera.jpg e compus de noi în stilul
 * celorlalte, pe fotografia hera-12); fără poster, cardul folosește imaginea tratamentului.
 */

export interface BlackFridayOffer {
  name: string;
  /** Mențiune afișată sub nume (ex. zona tratată). */
  detail?: string;
  price: string;
  treatment: string;
  poster?: string;
}

export const blackFriday = {
  path: '/black-friday/',
  dates: '2 – 4 noiembrie',
  // Sfârșitul zilei de 4 noiembrie, ora României (EET, UTC+2). După acest moment, pagina
  // afișează „campanie încheiată" și blocul de pe homepage dispare (site static: verificare în browser).
  endsAt: '2026-11-04T23:59:59+02:00',
  deal: '1+1 CADOU',
  offers: [
    { name: 'VelaShape', detail: 'zonă mare', price: '500 lei', treatment: 'tratare-celulita-cu-velashape2', poster: 'bf-velashape-zona-mare.jpg' },
    { name: 'VelaShape', detail: 'Full Body', price: '1.000 lei', treatment: 'tratare-celulita-cu-velashape2', poster: 'bf-velashape-full-body.jpg' },
    { name: 'Green Peel', price: '400 lei', treatment: 'tratament-green-peel-by-dr-schrammek', poster: 'bf-green-peel.jpg' },
    { name: 'Axon Wonder', price: '180 lei', treatment: 'wonder-axon', poster: 'bf-axon-wonder.jpg' },
    { name: 'Hidratiq', price: '550 lei', treatment: 'tratament-hidratiq', poster: 'bf-hidratiq.jpg' },
    { name: 'HERA', detail: 'facial sau corporal, la alegere', price: '500 lei', treatment: 'hera', poster: 'bf-hera.jpg' },
    { name: 'Criolipoliză', detail: 'zona la alegere', price: '600 lei', treatment: 'criolipoliza', poster: 'bf-criolipoliza.jpg' },
    { name: 'Dermocell', price: '150 lei', treatment: 'masaj-transdermic-dermohealth', poster: 'bf-dermocell.jpg' },
    { name: 'Laser Zentisse', price: '250 lei', treatment: 'slabire-cu-zentisse-slim-light-laser', poster: 'bf-laser-zentisse.jpg' },
    { name: 'Microneedling', price: '600 lei', treatment: 'tratament-facial-micropen', poster: 'bf-microneedling.jpg' },
  ] satisfies BlackFridayOffer[],
  terms: [
    'Fiecare clientă își poate achiziționa maxim 2 pachete din fiecare ofertă expusă.',
    'Pachetele pot fi cumpărate exclusiv în perioada campaniei.',
  ],
} as const;
