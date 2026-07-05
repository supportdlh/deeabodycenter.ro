# Deea Body Center — Astro Clone: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstrui site-ul deeabodycenter.ro (WordPress) ca site Astro static, în direcția de design V2 „Rafinat", cu paritate de conținut și SEO, publicabil pe shared hosting.

**Architecture:** Astro `output: static` cu URL-uri directory identice cu WordPress. Un layout parametrizat pentru cele 17 pagini de tratament + un layout pentru 3 oferte, alimentate din Content Collections (Zod). Pagini unice pentru Home/Contact/Tarife/Hub. Componente comune. Imagini optimizate cu `astro:assets`. Programări pe WhatsApp (zero backend). Sursa de adevăr pentru design: `mockups/v2-rafinat/*.html` (deja construit și aprobat).

**Tech Stack:** Astro (latest), `@astrojs/sitemap`, `@fontsource/playfair-display`, `@fontsource/poppins`, `sharp` (astro:assets), Node 18+ (doar la build, nu pe server).

## Global Constraints

- Output **static** (`output: 'static'`), **`build.format: 'directory'`** — trailing slash pe toate URL-urile.
- **Slug-uri EXACTE** ca în `reference/site-inventory.md` — zero URL nou, zero redirect.
- Limbă: **română cu diacritice**. Copy preluat EXACT din site-ul actual (scraping) — niciodată inventat când există.
- **Programări → WhatsApp** `https://wa.me/40723882529` (mesaj pre-completat contextual). FĂRĂ formulare, FĂRĂ backend.
- **Fără framework UI** (React/Vue/Tailwind). Astro + CSS scoped + tokens CSS. Interacțiuni cu `<details>` și checkbox-hack (fără JS de framework).
- **Design tokens:** Playfair Display (700) titluri, Poppins (400/500/600) body. Culori: navy `#051145`, magenta `#A7408F`, magenta-hover `#8f3579`, auriu `#FEC42D`, teal `#1C7261`, surface-alt lavandă `#F4F2FA`. (Sursă: `mockups/v2-rafinat/index.html` `:root`.)
- **Analytics:** GA4 `G-JX978SL3G5` (gtag.js), doar în producție.
- **SEO parity** e gate de go-live (vezi Task 9 checklist). Site-ul stă bine pe SEO local — nu regresăm.
- Commit-uri dese, mesaje în română, cu `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Ramură de lucru: `build/astro` (NU direct pe `main`); PR/merge la final.

---

## File Structure

```
astro.config.mjs                     # config static + directory + sitemap
package.json
tsconfig.json
public/
  robots.txt
  favicon.svg / favicon.ico
  .htaccess                          # (sau generat; vezi Task 11)
  images/og-default.jpg
src/
  styles/ tokens.css, global.css
  data/ site.ts, nav.ts
  components/ Seo.astro, Header.astro, Footer.astro, WhatsAppButton.astro,
              ScrollCue.astro, ServiceCard.astro, OfferCard.astro,
              Accordion.astro, TestimonialCard.astro, ContactBlock.astro,
              Analytics.astro
  layouts/ BaseLayout.astro, TreatmentLayout.astro, OfferLayout.astro
  content/ config.ts, treatments/*.md (17), offers/*.md (3)
  pages/
    index.astro
    contact.astro
    tarife.astro
    servicii-tratamente-faciale-si-corporale.astro
    oferte-speciale-tratamente-faciale-si-corporale.astro
    oferte-tratamente-corporale.astro
    oferte-tratamente-faciale.astro
    [slug].astro                     # rutează cele 17 tratamente din colecție
```

Fiecare fișier = o responsabilitate. Componentele mici sunt preferate față de pagini monolitice.

---

### Task 1: Scaffold Astro + config + design tokens + BaseLayout

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Create: `src/data/site.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro` (placeholder temporar)

**Interfaces:**
- Produces: `BaseLayout` cu props `{ title: string; description: string; canonicalPath: string; ogImage?: string }` și un `<slot />`. Exportă design tokens ca CSS custom properties globale.
- Produces: `src/data/site.ts` — `export const site` cu câmpurile de mai jos.

- [ ] **Step 1: Creează proiectul Astro (branch nou întâi)**

```bash
cd /Users/dorin.popescu/Claude/Projects/deeabodycenter.ro
git checkout -b build/astro
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --yes
npm install
npm install @astrojs/sitemap @fontsource/playfair-display @fontsource/poppins sharp
```

- [ ] **Step 2: Configurează `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://deeabodycenter.ro',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  image: { /* astro:assets folosește sharp implicit */ },
});
```

- [ ] **Step 3: `src/data/site.ts` — sursă unică de adevăr**

```ts
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
```

- [ ] **Step 4: `src/styles/tokens.css` — copiază `:root` din mockup**

Sursă: `mockups/v2-rafinat/index.html` blocul `:root { --navy … }`. Copiază toate custom properties (culori, `--r-sm/md/lg/pill`, `--sh-*`, `--t-fast`, spacing) într-un `:root` global. `global.css` = reset + `body { font-family: Poppins; color: var(--text); }` + import fonturi:

```css
/* global.css */
@import '@fontsource/playfair-display/700.css';
@import '@fontsource/poppins/400.css';
@import '@fontsource/poppins/500.css';
@import '@fontsource/poppins/600.css';
/* + reset minimal (box-sizing, margin 0) și stiluri base h1-h3 -> Playfair */
```

- [ ] **Step 5: `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/tokens.css';
import '../styles/global.css';
import Seo from '../components/Seo.astro';       // creat în Task 2 (import forward OK)
import Header from '../components/Header.astro';   // Task 3
import Footer from '../components/Footer.astro';   // Task 3
import Analytics from '../components/Analytics.astro'; // Task 2
const { title, description, canonicalPath, ogImage } = Astro.props;
---
<!doctype html>
<html lang="ro">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <Seo title={title} description={description} canonicalPath={canonicalPath} ogImage={ogImage}>
    <slot name="head" />
  </Seo>
  <Analytics />
</head>
<body>
  <Header />
  <main><slot /></main>
  <Footer />
</body>
</html>
```

- [ ] **Step 6: `src/pages/index.astro` placeholder** care folosește BaseLayout cu un `<h1>OK</h1>` temporar.

- [ ] **Step 7: Build & verify**

Run: `npm run build`
Expected: build reușit, `dist/index.html` există, `dist/sitemap-index.xml` generat. `npm run dev` → pagina randează cu fontul Poppins și tokens aplicate.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: schelet Astro, config static, design tokens, BaseLayout

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Seo + Analytics components

**Files:**
- Create: `src/components/Seo.astro`, `src/components/Analytics.astro`

**Interfaces:**
- Consumes: `site` din `src/data/site.ts`.
- Produces: `Seo` props `{ title, description, canonicalPath, ogImage? }`, cu `<slot name="head" />` pentru JSON-LD per pagină. `Analytics` fără props (citește `site.ga4`).

- [ ] **Step 1: `Seo.astro`**

```astro
---
import { site } from '../data/site.ts';
const { title, description, canonicalPath, ogImage = '/images/og-default.jpg' } = Astro.props;
const canonical = new URL(canonicalPath, Astro.site).href;
const ogUrl = new URL(ogImage, Astro.site).href;
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogUrl} />
<meta property="og:locale" content="ro_RO" />
<meta name="twitter:card" content="summary_large_image" />
<slot name="head" />
```

- [ ] **Step 2: `Analytics.astro`** (gtag doar în producție)

```astro
---
import { site } from '../data/site.ts';
const isProd = import.meta.env.PROD;
---
{isProd && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.ga4}`}></script>
    <script is:inline define:vars={{ id: site.ga4 }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', id);
    </script>
  </>
)}
```

- [ ] **Step 3: Build & verify**

Run: `npm run build && grep -r "og:title" dist/index.html`
Expected: meta tags prezente în output. `grep "G-JX978SL3G5" dist/index.html` → prezent (build e PROD).

- [ ] **Step 4: Commit** (`feat: componente Seo + Analytics (GA4)`).

---

### Task 3: Componente shell — Header, Footer, WhatsAppButton, ScrollCue

**Files:**
- Create: `src/data/nav.ts`
- Create: `src/components/WhatsAppButton.astro`, `Header.astro`, `Footer.astro`, `ScrollCue.astro`

**Interfaces:**
- Consumes: `site`, `waLink` din `site.ts`.
- Produces: `WhatsAppButton` props `{ message?: string; label?: string; variant?: 'primary'|'nav'|'ghost'; class?: string }`. `Header`/`Footer`/`ScrollCue` fără props.

- [ ] **Step 1: `nav.ts`** — structura meniului (Home, Oferte▾, Servicii▾, Tarife, Contact) cu sub-itemi și href-urile reale (slug-urile din inventar).

- [ ] **Step 2: `WhatsAppButton.astro`**

```astro
---
import { waLink } from '../data/site.ts';
const { message, label = 'Programează-te', variant = 'primary', class: cls = '' } = Astro.props;
---
<a href={waLink(message)} target="_blank" rel="noopener" class={`btn btn-${variant} ${cls}`}>{label}</a>
<style>/* stiluri .btn din mockup V2; .btn-nav = text ALB pe magenta */</style>
```

- [ ] **Step 3: `Header.astro`** — portează header-ul sticky din `mockups/v2-rafinat/index.html` (logo, nav din `nav.ts`, meniu mobil checkbox-hack). CTA-ul „Programare" = `<WhatsAppButton variant="nav" label="Programare" />` cu **text alb** (fix-ul aprobat). Logo → `/`.

- [ ] **Step 4: `Footer.astro`** — 4 coloane (slogan+social / Servicii / Oferte / Program din `site.hours`) portate din mockup. Copyright „© 2022 Deea Body Center" (păstrat) — sau anul curent, de confirmat.

- [ ] **Step 5: `ScrollCue.astro`** — indicatorul animat „Descoperă" + mouse, din hero-ul V2 aprobat (cu `prefers-reduced-motion`).

- [ ] **Step 6: Build & verify** — randează pe index placeholder; verifică: nav links corecte, butonul WhatsApp deschide `wa.me/40723882529`, text alb pe CTA header.

- [ ] **Step 7: Commit** (`feat: Header, Footer, WhatsAppButton, ScrollCue`).

---

### Task 4: Homepage

**Files:**
- Create: `src/components/ServiceCard.astro`, `OfferCard.astro`, `TestimonialCard.astro`, `Accordion.astro`, `ContactBlock.astro`
- Rewrite: `src/pages/index.astro`
- Copy: imaginile home din `reference/assets/` → `src/assets/` (pentru `astro:assets`)

**Interfaces:**
- Consumes: toate componentele anterioare.
- Produces: `ServiceCard` props `{ title, excerpt, image, href }`; `OfferCard` props `{ title, excerpt, image, href }`; `TestimonialCard` props `{ name, text }`; `Accordion` props `{ title, open? }` + `<slot />`; `ContactBlock` (blocul WhatsApp+telefon+program care înlocuiește formularul).

- [ ] **Step 1: Componentele de card + Accordion + ContactBlock** — portează markup+CSS din mockup V2; imaginile prin `astro:assets` (`import { Image } from 'astro:assets'`), cu `width/height`, `loading="lazy"`, format webp/avif. `ContactBlock` = titlu „Trimite o programare" → înlocuit cu buton WhatsApp mare + `tel:` + program (fără câmpuri de formular).

- [ ] **Step 2: `index.astro`** — reconstruiește homepage-ul V2 secțiune cu secțiune folosind componentele: hero (imagine mărită + float + `<ScrollCue />`), split Faciale, grid 6 carduri faciale, split Corporal, grid 9 carduri corporale, Solar, 3 OfferCard, 3 TestimonialCard, ContactBlock + FAQ (Accordion). Datele cardurilor pot veni deja din colecția `treatments` (după Task 5) — dar la acest pas pot fi inline; refactor la array după Task 5. Copy EXACT din `reference/content.md`. Meta: title/desc din `reference/design-tokens.md`.

- [ ] **Step 3: Build & verify paritate** — `npm run build`; deschide `dist` cu un server local și compară vizual cu `mockups/v2-rafinat/index.html` (trebuie să fie identice, minus optimizarea imaginilor). Verifică hero-ul (imagine mare, scroll cue vizibil în fold), toate CTA → WhatsApp.

- [ ] **Step 4: Commit** (`feat: homepage completă (V2)`).

---

### Task 5: Content Collections + TreatmentLayout + rută dinamică

**Files:**
- Create: `src/content/config.ts`
- Create: `src/layouts/TreatmentLayout.astro`
- Create: `src/pages/[slug].astro`
- Create: `src/content/treatments/tratament-sculptor.md` (exemplu complet)

**Interfaces:**
- Produces: colecția `treatments` cu schema din spec §5; `[slug].astro` generează o pagină per intrare, la `/{slug}/`.

- [ ] **Step 1: `content/config.ts`** — definește `treatments` și `offers` cu Zod (câmpurile din spec §5). `category: z.enum(['facial','corporal'])`, `sections`, `benefits`, `seo`, `order`, imagini ca string (path în `src/assets`) sau `image()` helper.

- [ ] **Step 2: `TreatmentLayout.astro`** — portează structura paginii Sculptor din `mockups/v2-rafinat/tratament-sculptor.html`: hero full-width cu casetă, 2 coloane (stânga intro+acordeoane Corporal/Facial din `sections`; dreapta sidebar cu imagine, `benefits`, **bloc WhatsApp** în loc de formular). Props din frontmatter-ul colecției.

- [ ] **Step 3: `[slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import TreatmentLayout from '../layouts/TreatmentLayout.astro';
export async function getStaticPaths() {
  const items = await getCollection('treatments');
  return items.map((entry) => ({ params: { slug: entry.slug }, props: { entry } }));
}
const { entry } = Astro.props;
---
<TreatmentLayout entry={entry} />
```

- [ ] **Step 4: `tratament-sculptor.md`** — populează COMPLET din `reference/content.md` (intro, sections Corporal/Facial cu HiFu deschis, benefits, seo). Slug `tratament-sculptor`.

- [ ] **Step 5: Build & verify** — `/tratament-sculptor/` randează identic cu mockup-ul; acordeoanele funcționează; sidebar WhatsApp OK; URL are trailing slash.

- [ ] **Step 6: Commit** (`feat: content collections + TreatmentLayout + ruta de tratament`).

---

### Task 6: Scraping + populare cele 16 pagini de tratament rămase

**Files:**
- Create: `src/content/treatments/*.md` (16 fișiere rămase)
- Copy: imaginile per pagină în `src/assets/`

Slug-uri (din inventar): criolipoliza, cromoterapie-faciala, epilarea-definitiva-cu-laserul-xlight, microdermabraziune, slabire-prin-electrostimulare, tratament-facial-intraceuticals, presoterapie, tratament-opti-firm, tratament-green-peel-by-dr-schrammek, slabire-cu-zentisse-slim-light-laser, tratare-celulita-cu-velashape2, masaj-transdermic-dermohealth, tratament-hidratiq, tratament-facial-cu-radiofrecventa-4k, tratament-facial-micropen, solar.

**Interfaces:** Consumes: schema `treatments` (Task 5).

- [ ] **Step 1: Scrape fiecare pagină** — cu metoda deja validată (Playwright `innerText` + listă imagini + `curl` cu sandbox off pentru descărcare; `<title>`/`<meta description>` din HTML brut). Pentru fiecare: extrage intro, secțiunile Corporal/Facial (acordeoane), beneficiile din sidebar, imaginile, title+description.
- [ ] **Step 2: Scrie fișierul `.md`** per tratament, conform schemei. `category` corectă (facial/corporal). `order` pentru poziția în grid-uri.
- [ ] **Step 3: Descarcă+optimizează imaginile** specifice fiecărei pagini în `src/assets/` (rezolvă și imaginile „aproximative" de pe home cu cele corecte).
- [ ] **Step 4: Build & verify** — toate cele 17 pagini de tratament randează, 0 erori, linkuri interne OK. (Paralelizabil pe subagenți Sonnet, câte un grup de pagini fiecare.)
- [ ] **Step 5: Commit** (`content: toate cele 17 pagini de tratament`).

---

### Task 7: OfferLayout + cele 3 pagini de oferte

**Files:**
- Create: `src/layouts/OfferLayout.astro`
- Create: `src/content/offers/*.md` (3)
- Create: `src/pages/oferte-speciale-...astro`, `oferte-tratamente-corporale.astro`, `oferte-tratamente-faciale.astro`

**Interfaces:** Consumes: colecția `offers`.

- [ ] **Step 1: `OfferLayout.astro`** — layout pt. pagini de oferte (hero + conținut + CTA WhatsApp). Design coerent cu V2.
- [ ] **Step 2: Scrape + `.md`** pentru cele 3 oferte (title, excerpt, body, image, seo).
- [ ] **Step 3: Cele 3 pagini** — fie rută per pagină care încarcă intrarea din colecție, fie fișiere `.astro` dedicate (slug-uri exacte din inventar).
- [ ] **Step 4: Build & verify** — cele 3 URL-uri de oferte randează, linkurile „Vezi ofertele" de pe home țintesc corect.
- [ ] **Step 5: Commit** (`feat: pagini oferte + OfferLayout`).

---

### Task 8: Pagini unice — Tarife, Contact, Hub servicii

**Files:**
- Create: `src/pages/tarife.astro`, `contact.astro`, `servicii-tratamente-faciale-si-corporale.astro`

- [ ] **Step 1: Scrape** conținutul celor 3 pagini.
- [ ] **Step 2: `tarife.astro`** — tabelul/lista de tarife, portat fidel.
- [ ] **Step 3: `contact.astro`** — NAP complet, program (`site.hours`), buton WhatsApp + `tel:`, hartă (embed static/link Google Maps), fără formular. **Completează adresa+geo în `site.ts` din această pagină.**
- [ ] **Step 4: `servicii-...astro`** — hub cu linkuri către toate tratamentele (faciale+corporale), din colecție.
- [ ] **Step 5: Build & verify** — cele 3 pagini randează, linkuri interne corecte.
- [ ] **Step 6: Commit** (`feat: pagini Tarife, Contact, Hub servicii`).

---

### Task 9: SEO finalization — schema, sitemap, robots, favicon, checklist paritate

**Files:**
- Modify: `BaseLayout`/`index.astro`/`TreatmentLayout` (JSON-LD via slot `head`)
- Create: `public/robots.txt`, `public/favicon.svg`, `public/images/og-default.jpg`
- Create: `src/components/LocalBusinessالسchema` → `src/components/schema/*.astro` (JSON-LD)

- [ ] **Step 1: JSON-LD `HealthAndBeautyBusiness`** pe homepage (NAP din `site.ts`, `openingHoursSpecification`, `geo`, `telephone`, `sameAs` FB/IG, `priceRange`, `image`). Injectat prin `<slot name="head">`.
- [ ] **Step 2: JSON-LD `Service`** pe fiecare pagină de tratament (name, description, provider, areaServed = Ploiești).
- [ ] **Step 3: `robots.txt`** (allow all + `Sitemap: https://deeabodycenter.ro/sitemap-index.xml`), `favicon`, `og-default.jpg`.
- [ ] **Step 4: Verifică sitemap** — `npm run build && grep -c "<loc>" dist/sitemap-0.xml` → 24 URL-uri, toate cu trailing slash.
- [ ] **Step 5: Checklist paritate SEO** — script/verificare per pagină: URL identic, `<title>` identic cu originalul, `<meta description>` identică, un singur `<h1>`, JSON-LD valid (validator). Compară cu site-ul actual (scraping title/desc original vs nou). Remediază diferențele.
- [ ] **Step 6: Commit** (`feat: SEO — schema LocalBusiness/Service, sitemap, robots, checklist paritate`).

---

### Task 10: QA — linkuri, responsive, Lighthouse, paritate vizuală

- [ ] **Step 1: Broken link check** — crawl intern pe `dist/` (ex. cu un linkchecker sau script Playwright); 0 linkuri interne rupte.
- [ ] **Step 2: Paritate vizuală** — screenshot toate paginile Astro vs. originalul (Playwright), verifică diferențele majore.
- [ ] **Step 3: Responsive** — verifică 375/768/1024/1440 pe home + o pagină de tratament + contact (meniu mobil, grid-uri 1 coloană, hero).
- [ ] **Step 4: Lighthouse** — pe home + o pagină de tratament; țintă ≥95 Perf/SEO/Best/A11y. Remediază (imagini, alt, contrast, focus).
- [ ] **Step 5: Commit** remedierile (`fix: QA — linkuri/responsive/lighthouse/a11y`).

---

### Task 11: Deploy — .htaccess, GitHub Actions (CI/CD → shared hosting), DEPLOY.md

**Se execută LA FINAL**, după ce clientul revizuiește rezultatul live în browser (preview local sau staging). Deploy-ul e **automat prin GitHub Actions**: la fiecare merge pe `main`, workflow-ul face build Astro și urcă `dist/` pe shared hosting prin FTP/SFTP.

**Files:**
- Create: `public/.htaccess`, `.github/workflows/deploy.yml`, `DEPLOY.md`

- [ ] **Step 1: `.htaccess`** — forțare HTTPS, canonicalizare trailing slash, gzip/brotli, cache headers lungi pe assets (imagini/fonturi/CSS cu hash), fallback 404. (Include eventuale 301 doar dacă apare vreun URL diferit.) Se urcă odată cu `dist/` (din `public/`).

- [ ] **Step 2: GitHub Actions `deploy.yml`** — build + deploy FTP către shared hosting:

```yaml
name: Deploy to shared hosting
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - name: Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: ${{ secrets.FTP_REMOTE_DIR }}   # ex: /public_html/
```

  Secretele (`FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_REMOTE_DIR`) se adaugă de client în **Settings → Secrets → Actions** (la final). Dacă hostul suportă doar SFTP, folosim în loc `wlixcc/SFTP-Deploy-Action` sau FTPS (`protocol: ftps`).

- [ ] **Step 3: `DEPLOY.md`** — documentează: (a) fluxul automat (merge pe `main` → deploy), (b) ce secrete trebuie setate și de unde le ia din cPanel, (c) fallback manual (build local → upload `dist/` prin FTP/File Manager), (d) post-deploy: verificare live, (re)trimitere sitemap în Search Console, confirmare GA4.

- [ ] **Step 4: Build final local** — `npm run build`, verifică `dist/` complet (24 pagini + sitemap + robots + `.htaccess` + assets).

- [ ] **Step 5: PR către `main`** — push `build/astro`, deschide PR cu rezumatul. **Merge-ul (care declanșează primul deploy automat) se face DOAR după ce clientul aprobă rezultatul live** și a setat secretele FTP.

---

## Self-Review (verificare plan vs spec)

**Spec coverage:** §2 YAGNI (fără CMS/backend/blog) → respectat în toate task-urile. §3 stack → Task 1. §4 structură → File Structure + Task 1. §5 content model → Task 5. §6 rutare/template → Task 5–8. §7 WhatsApp → Task 3 (buton), 4 (ContactBlock), 5/7 (layouts). §8 SEO complet → Task 9 + checklist. §9 perf/a11y → Task 10. §10 deploy → Task 11. Toate secțiunile au task. ✅

**Placeholder scan:** Câmpurile marcate `COMPLETEAZĂ` în `site.ts` (adresă, geo, social) sunt intenționat de completat din pagina Contact la Task 8/3 — sunt riscuri cunoscute din spec §11, nu placeholder-e de cod. Restul pașilor au cod/comenzi concrete.

**Type consistency:** `site`, `waLink(message)`, `WhatsAppButton` props (`message/label/variant`), `treatments`/`offers` colecții, `getStaticPaths` slug — consistente între task-uri.
