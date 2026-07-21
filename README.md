# deeabodycenter.ro

Site-ul **Deea Body Center** (Ploiești — remodelare corporală & tratamente faciale), migrat de pe WordPress + Elementor pe **Astro static**.

## Obiectiv
Clonă fidelă în conținut, în direcția de design **V2 „Rafinat"**, publicată pe shared hosting, cu păstrarea completă a SEO-ului (slug-uri, linkuri interne, meta, schema LocalBusiness).

## Stadiu
🟢 **Implementat și în producție** — site-ul Astro e construit și se publică automat la fiecare push pe `main`. Dezvoltarea continuă cu ajustări de conținut și design.

## Structura repo
- `src/` — sursa Astro: `content/` (tratamente + oferte în markdown), `data/` (NAP, meniu), `layouts/`, `components/`, `pages/`, `styles/`.
- `public/` — fișiere servite ca atare (galerii pre-optimizate, `.htaccess`).
- `docs/superpowers/specs/` și `docs/superpowers/plans/` — specificația de design aprobată + planul de implementare.
- `reference/` — design tokens, conținut extras, inventar site, imagini sursă.
- `mockups/` — cele 3 variante de design HTML (V1 clonă / V2 rafinat / V3 modern) + hub de comparație. **V2 = varianta aleasă.** Istoric: referința de lucru e site-ul live, nu mockup-urile.

Detalii de arhitectură și convenții: [CLAUDE.md](CLAUDE.md). Deploy: [DEPLOY.md](DEPLOY.md).

## Decizii cheie
- Astro `output: static`, URL-uri directory identice cu WordPress (zero redirecturi).
- Conținutul stă în content collections (markdown + frontmatter), nu hardcodat în `.astro`.
- Programări prin **WhatsApp** (`wa.me/40723882529`) — fără backend de formular.
- Găzduire pe **shared hosting**; deploy automat prin GitHub Actions (build + upload `dist/` prin FTPS).
- Analytics: **GA4 `G-JX978SL3G5`** (păstrat din site-ul actual).

## Dezvoltare locală

Necesită Node >= 22.12.

```bash
npm install
npm run dev        # server de dezvoltare Astro
npm run build      # generează dist/
```

Preview al build-ului static:

```bash
cd dist && python3 -m http.server 8080
```
