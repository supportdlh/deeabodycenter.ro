# CLAUDE.md — deeabodycenter.ro

Clonă Astro statică a site-ului WordPress deeabodycenter.ro (Deea Body Center, Ploiești — remodelare corporală & tratamente faciale). Astro 7, `output: static`, deploy pe shared hosting. Vezi `docs/superpowers/specs/` și `docs/superpowers/plans/` pentru spec + plan; `DEPLOY.md` pentru deploy.

## Comenzi

- `npm run build` — generează `dist/` (offline, fără sandbox). `npm run dev` — server local Astro (cere `dangerouslyDisableSandbox: true`).
- Preview build static: `cd dist && python3 -m http.server 8080`.
- `npm run astro -- check` — verificare tipuri/conținut Astro.
- Nu există suită de teste — validarea e vizuală, vs site-ul live. Pentru performanță e instalat `lighthouse` (devDependency): `npx lighthouse http://localhost:8080/ --view`.
- Node >= 22.12 (vezi `engines` din `package.json`; CI folosește Node 22).

## Arhitectură

Site data-driven: paginile citesc din **content collections** (`src/content.config.ts`) și din datele partajate (`src/data/`). Aproape tot conținutul stă în frontmatter/markdown, nu hardcodat în `.astro`.

- **Content collections** (`src/content/`, schema Zod în `src/content.config.ts`):
  - `treatments/*.md` → cele 19 pagini de tratament, randate de **o singură rută dinamică** [src/pages/[slug].astro](src/pages/[slug].astro) prin `TreatmentLayout`. **Slug-ul = numele fișierului** (`entry.id`), NU un câmp `slug` din frontmatter — o singură sursă de adevăr pentru URL. Adaugi un tratament = adaugi un `.md`.
  - `offers/*.md` → cele 3 pagini de oferte. Aici **NU** e rută dinamică: fiecare ofertă are un `src/pages/oferte-*.astro` dedicat care face `getEntry('offers', '<slug>')` și pasează entry-ul în `OfferLayout` — fișierul din `src/pages/` rămâne sursa de adevăr a URL-ului. Prețurile stau în frontmatter (`packages`, `introPromo`, `promoBanners`) ca date structurate, nu proză.
- **Date partajate** (`src/data/`): [site.ts](src/data/site.ts) (NAP, geo, ore, social, GA4, `waLink()` pentru CTA WhatsApp) și [nav.ts](src/data/nav.ts) (meniu — slug-uri identice cu WordPress). Editează aici pentru contact/telefon/adresă/meniu, nu în componente.
- **Layouts** (`src/layouts/`): `BaseLayout` (head/SEO/Header/Footer, folosit de toate) → `TreatmentLayout` / `OfferLayout` (șabloane pentru colecții). Paginile statice (`index`, `contact`, `tarife`, `servicii-*`) folosesc `BaseLayout` direct.
- **SEO/schema**: `Seo.astro` + `components/schema/` (LocalBusiness pe homepage, Service pe tratamente). Sitemap generat automat (`@astrojs/sitemap`). URL-uri directory-style (`trailingSlash: 'always'`, `format: 'directory'`) — identice cu WP, zero redirecturi.
- **Stiluri**: `src/styles/tokens.css` (design tokens) → `global.css` → `buttons.css`. Fonturi self-hosted via `@fontsource` (Playfair Display + Poppins).
- **Imagini**: sursă optimizabilă în `src/assets/` (procesate de `astro:assets`/sharp); galeriile mari pre-optimizate (webp din WP) stau în `public/galleries/<slug>/` și sunt referite ca căi absolute în frontmatter (`gallery`) ca să nu încetinească build-ul. `public/.htaccess` ajunge automat în `dist/`.

## Reguli de lucru

### Agenți & workflow-uri de fundal — verifică-le periodic
Când rulez agenți/workflow-uri în fundal, **verific starea lor din când în când (o dată la ~10 min)** — NU aștept la nesfârșit o singură notificare. Un agent se poate bloca (server „activ" dar fără progres) fără să dea eroare. Cum verific:
- `lsof -ti:<port>` pentru serverele agenților + `stat -f "%Sm %N" <fișiere pe care le editează>` (mtime): dacă mtime nu s-a schimbat de mult timp → agentul e blocat.
- Dacă un agent e blocat > ~10 min fără progres: îl opresc (`TaskStop <id>`) și fac fixul direct.

### Viteză vs rigoare
- Fixurile clare/mecanice (poziție element, culoare, text, layout evident) le fac **direct** (Edit + build), NU cu agenți lenți de comparație-în-browser.
- Rezerv agenții cu comparație-în-browser vs live doar pentru potriviri vizuale cu adevărat subtile.

### Build & deploy
- `npm run build` rulează offline (fără flag sandbox). Comenzile de rețea (curl, npm install, push, servere locale) cer `dangerouslyDisableSandbox: true`.
- Preview local: `cd dist && python3 -m http.server 8080`.
- Deploy = push pe `main` → [.github/workflows/deploy.yml](.github/workflows/deploy.yml) face `npm ci` + `npm run build` și urcă `dist/` prin FTPS pe shared hosting (secrete `FTP_SERVER`/`FTP_USERNAME`/`FTP_PASSWORD`/`FTP_SERVER_DIR`). `main` = producție: **push pe `main` publică live imediat — NU împinge până nu confirmă clientul.** (`build/astro` = branch istoric, rămas în urmă; nu se mai folosește.)

### Referință pixel-perfect
- Ținta e **site-ul LIVE** deeabodycenter.ro (NU mockup-urile din `mockups/`, care diverg).
- Conținut 100% verbatim din live — zero fabricație (mai ales prețuri/oferte).
