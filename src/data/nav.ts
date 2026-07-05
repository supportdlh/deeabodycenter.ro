/*
 * Structura meniului principal.
 * Slug-urile sunt EXACT cele din `reference/site-inventory.md` (inventarul din sitemap-ul vechi) —
 * se păstrează identic pentru a nu rupe SEO-ul existent.
 */

export interface NavChild {
  label: string;
  href: string;
  /** Element de grupare în interiorul unui dropdown (nu e link, doar titlu de secțiune). */
  heading?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const nav: NavItem[] = [
  { label: 'Deea Body Center', href: '/' },
  {
    label: 'Oferte',
    href: '/oferte-speciale-tratamente-faciale-si-corporale/',
    children: [
      { label: 'Oferte Speciale Tratamente Faciale și Corporale', href: '/oferte-speciale-tratamente-faciale-si-corporale/' },
      { label: 'Oferte Tratamente Corporale', href: '/oferte-tratamente-corporale/' },
      { label: 'Oferte Tratamente Faciale', href: '/oferte-tratamente-faciale/' },
    ],
  },
  {
    label: 'Servicii',
    href: '/servicii-tratamente-faciale-si-corporale/',
    children: [
      { label: 'Tratamente faciale', href: '/servicii-tratamente-faciale-si-corporale/', heading: true },
      { label: 'Intraceuticals', href: '/tratament-facial-intraceuticals/' },
      { label: 'Tratament pentru ochi OPTI-FIRM', href: '/tratament-opti-firm/' },
      { label: 'Green Peel® by Dr. Schrammek', href: '/tratament-green-peel-by-dr-schrammek/' },
      { label: 'HidratIQ', href: '/tratament-hidratiq/' },
      { label: 'Radiofrecvență 4K', href: '/tratament-facial-cu-radiofrecventa-4k/' },
      { label: 'MicroPen', href: '/tratament-facial-micropen/' },
      { label: 'Microdermabraziune', href: '/microdermabraziune/' },
      { label: 'Cromoterapie facială', href: '/cromoterapie-faciala/' },
      { label: 'Tratamente corporale', href: '/servicii-tratamente-faciale-si-corporale/', heading: true },
      { label: 'Tratament Sculptor', href: '/tratament-sculptor/' },
      { label: 'Masaj transdermic Dermohealth', href: '/masaj-transdermic-dermohealth/' },
      { label: 'ZENTISSE Slim Light Laser', href: '/slabire-cu-zentisse-slim-light-laser/' },
      { label: 'VelaShape2 anticelulită', href: '/tratare-celulita-cu-velashape2/' },
      { label: 'Criolipoliza', href: '/criolipoliza/' },
      { label: 'Electrostimulare', href: '/slabire-prin-electrostimulare/' },
      { label: 'Presoterapie', href: '/presoterapie/' },
      { label: 'Epilare definitivă XLight', href: '/epilarea-definitiva-cu-laserul-xlight/' },
      { label: 'Solar', href: '/solar/' },
    ],
  },
  { label: 'Tarife', href: '/tarife/' },
  { label: 'Contact', href: '/contact/' },
];
