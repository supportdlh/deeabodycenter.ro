# Spec — Clonă Astro pentru deeabodycenter.ro

**Data:** 2026-07-05
**Obiectiv:** Reconstruirea completă a site-ului Deea Body Center (actual WordPress + Elementor) ca site **Astro static**, cu paritate de conținut și direcția de design **V2 „Rafinat"** (aprobată), pentru a renunța la WordPress.

---

## 1. Context & decizii deja luate

- **Business:** Deea Body Center, centru de remodelare corporală și tratamente faciale, Ploiești. Telefon: **0723 882 529**.
- **Site actual:** WordPress + Hello Elementor + Elementor Pro. 24 de pagini, fără blog real.
- **Direcție de design:** **V2 Rafinat** (vezi `mockups/v2-rafinat/`) — aceeași identitate de brand ca originalul, execuție îngrijită. Include ajustările aprobate pe hero: imagine mărită cu float subtil, buton „Programare" alb, indicator de scroll animat „Descoperă".
- **Programări:** **exclusiv prin WhatsApp** — `https://wa.me/40723882529` cu mesaj pre-completat. FĂRĂ backend de formular. (memorie: `deeabody-appointments-whatsapp`)
- **Găzduire:** **shared hosting propriu** (unde stă și WordPress-ul). Deci **output 100% static**, deploy prin FTP/cPanel în `public_html`. FĂRĂ Node pe server. (memorie: `deeabody-hosting-shared`)
- **Limbă:** română (cu diacritice), o singură limbă.

## 2. Ce NU facem (YAGNI)

- ❌ CMS / admin panel — conținutul e stabil, editare direct în fișiere content collections.
- ❌ Backend de formular / trimitere email — programările merg pe WhatsApp.
- ❌ Blog — nu există conținut de blog real (doar postarea default „hello-world", ignorată).
- ❌ SSR / adaptere Node / funcții server — pur static.
- ❌ Multi-limbă / i18n — site monolingv.
- ❌ Framework UI (React/Vue) — Astro pur + CSS. Zero JS de framework; interacțiunile (acordeoane, meniu mobil) se fac cu HTML/CSS nativ (`<details>`, checkbox hack) sau minim JS vanilla.

## 3. Stack tehnic

- **Astro** (ultima versiune stabilă), `output: 'static'`.
- **`build.format: 'directory'`** → URL-uri identice cu WordPress, cu trailing slash (ex. `/tratament-sculptor/` servit ca `.../tratament-sculptor/index.html`). Zero redirecturi necesare.
- **Content Collections** (type-safe, cu Zod schema) pentru tratamente și oferte.
- **`astro:assets`** pentru optimizare imagini (WebP/AVIF, responsive `srcset`, lazy-loading, dimensiuni explicite anti-CLS).
- **Google Fonts:** Playfair Display (700) + Poppins (400/500/600), self-hosted local (via `@fontsource`) pentru performanță și zero dependență externă la runtime.
- Fără Tailwind — CSS scoped în componente Astro + un fișier global de design tokens (CSS custom properties). Motiv: portăm direct CSS-ul rafinat din mockup-ul V2, e mai rapid și mai curat pentru acest volum.

## 4. Structura proiectului

```
src/
  components/
    Header.astro            # nav sticky + logo + buton WhatsApp
    Footer.astro            # 4 coloane (Servicii/Oferte/Program) + social
    WhatsAppButton.astro    # CTA reutilizabil → wa.me cu mesaj parametrizabil
    ServiceCard.astro       # card tratament (grid home + listări)
    OfferCard.astro         # card ofertă
    Accordion.astro         # <details>/<summary> stilizat
    TestimonialCard.astro
    FaqList.astro
    Seo.astro               # <head> meta/OG/JSON-LD centralizat
    ScrollCue.astro         # indicatorul animat din hero
  layouts/
    BaseLayout.astro        # <html>, <head> (Seo), Header, <slot>, Footer
    TreatmentLayout.astro   # template parametrizat pt. paginile de tratament
    OfferLayout.astro       # template pt. paginile de oferte
  content/
    config.ts               # definițiile colecțiilor + Zod schemas
    treatments/             # .md/.mdx per tratament (17 fișiere)
    offers/                 # .md/.mdx per ofertă (3 fișiere)
  data/
    site.ts                 # constante: telefon, program, social, WhatsApp, NAP
    nav.ts                  # structura meniului (cu dropdown-uri)
  pages/
    index.astro                                          # /
    contact.astro                                        # /contact/
    tarife.astro                                         # /tarife/
    servicii-tratamente-faciale-si-corporale.astro       # hub servicii
    oferte-speciale-tratamente-faciale-si-corporale.astro
    oferte-tratamente-corporale.astro
    oferte-tratamente-faciale.astro
    [treatment].astro  SAU  fișiere per slug             # vezi §6
  styles/
    tokens.css              # design tokens (culori, fonturi, spacing, radii)
    global.css              # reset, base, utilitare
public/
  images/                   # imaginile din reference/assets (optimizate)
  favicon, robots.txt, .htaccess (copiat la build sau în public)
```

## 5. Content model (Zod schemas)

**`treatments` collection** — un fișier per tratament:
```ts
{
  title: string            // „Tratament Sculptor"
  slug: string             // „tratament-sculptor" (= URL, păstrat identic)
  category: 'facial' | 'corporal'
  excerpt: string          // descrierea scurtă din cardul de pe home
  heroImage: string        // imagine hero full-width
  sidebarImage?: string
  intro: string[]          // paragrafele de intro
  sections: [{ group: 'Corporal'|'Facial', items: [{ title, body, open? }] }]  // acordeoane
  benefits?: string[]      // lista „Beneficii" din sidebar
  order: number            // ordinea în grid-uri
  seo: { title, description }
  // câmpuri opționale adiționale (adăugate la implementare):
  sidebarTitle?: string    // titlu explicit pentru sidebar; altfel se derivă din title (strip „Tratament ")
  sidebarPromo?: string[]  // propozițiile promo din sidebar care nu încap în excerpt/intro/benefits
}
```

Notă: în Astro 7 configul colecțiilor stă în `src/content.config.ts` (glob loader); routing-ul folosește `entry.id` (derivat din numele fișierului = slug).

**`offers` collection** — un fișier per ofertă:
```ts
{
  title, slug, excerpt, image, body, category, seo
  // câmp opțional adițional (adăugat la implementare, task 7):
  packages?: [{ title?, items: string[], price, oldPrice?, badge? }]
  // pachetele de preț („Abonament nr. X", tarife fixe) de pe paginile live de oferte sunt
  // liste de proceduri + preț, nu proză continuă — `body` (proză) nu le poate reda fidel.
  // Opțional: pagina „Oferte speciale" nu are pachete text (conținutul ei real e un colaj
  // de imagini promoționale rotative, nedurabile, nu date structurate stabile).
}
```

Datele „constante" (telefon, program, social, NAP) trăiesc în `src/data/site.ts`, importate oriunde e nevoie — o singură sursă de adevăr.

## 6. Rutare & template-uri

- **Cele 17 pagini de tratament** folosesc UN SINGUR `TreatmentLayout.astro`, alimentat din colecția `treatments`. Generare prin `getStaticPaths()` dintr-un fișier dinamic care mapează slug-ul din colecție la URL. **Slug-urile rămân EXACT ca în WordPress** (listă în `reference/site-inventory.md`).
- **Cele 3 pagini de oferte** → `OfferLayout.astro` + colecția `offers`.
- **Homepage, Contact, Tarife, Hub servicii** = pagini unice (`.astro` dedicate), dar reutilizează componentele comune.
- Structura template-ului de tratament (din pagina Sculptor): hero full-width cu casetă + intro pe 2 coloane (stânga: intro + acordeoane Corporal/Facial; dreapta: sidebar cu imagine, beneficii, CTA WhatsApp).

## 7. Integrare WhatsApp

- Componenta `WhatsAppButton.astro` primește un prop `message` opțional și generează:
  `https://wa.me/40723882529?text=<mesaj URL-encoded>`
- Toate CTA-urile de programare („Programează-te", „Programare" din header, „Trimite programare", „Vezi ofertele" unde e cazul) → WhatsApp.
- Mesaje pre-completate contextuale: pe pagina unui tratament, mesajul include numele tratamentului (ex. „Bună, aș dori o programare pentru Tratament Sculptor").
- **DECIS:** formularele vizuale (Nume/Telefon/Email/Mesaj) se **elimină**. În locul lor: un bloc de contact cu **buton WhatsApp mare + numărul de telefon** (clickabil `tel:`) + programul. Fără câmpuri care nu trimit nimic.

## 8. SEO — PĂSTRARE COMPLETĂ (prioritate; site-ul stă bine pe SEO local)

Principiu: migrarea trebuie să fie **invizibilă pentru Google**. Păstrăm tot ce dă ranking acum și îmbunătățim doar viteza/tehnica.

**Paritate URL & linkuri**
- **Slug-uri identice**, cu trailing slash (listă exactă în `reference/site-inventory.md`). Zero URL nou, zero redirect necesar.
- **Toate linkurile interne păstrate**: meniu (cu dropdown-uri), footer, cardurile de pe home → paginile de tratament, cross-linkuri între pagini. Fiecare link intern țintește exact același URL ca acum. Verificare automată: 0 linkuri interne rupte (crawl la build).
- Același domeniu, același `https`, aceeași convenție de trailing slash (canonicalizare consistentă în `.htaccess`).

**Conținut on-page (extras EXACT din site-ul actual, nu inventat)**
- `<title>` și `<meta description>` **preluate identic** per pagină prin scraping (fallback generat doar dacă lipsesc).
- Structura de heading-uri (H1 unic per pagină, H2/H3) păstrată — un singur H1 cu cheia principală, ca acum.
- `alt` pe imagini păstrat/îmbunătățit (relevante pentru image SEO local).
- Text integral păstrat (densitatea de keyword-uri locale „Ploiești", denumiri tratamente etc. rămâne).

**SEO LOCAL (critic)**
- **Schema.org JSON-LD `HealthAndBeautyBusiness`/`LocalBusiness`** pe homepage cu **NAP exact** (nume, adresă completă, telefon 0723 882 529), `geo` (lat/long), `openingHoursSpecification` (L–V 9–20, Sâmbătă 10–16, Duminică închis), `priceRange`, `sameAs` (Facebook, Instagram), `image`/`logo`.
- **NAP consistent** peste tot (footer, contact, schema) — identic cu Google Business Profile.
- `Service` JSON-LD pe fiecare pagină de tratament (nume, descriere, `provider` = business-ul, `areaServed` = Ploiești).
- De preluat de pe site-ul actual: adresa completă exactă + coordonatele geo (de pe pagina Contact / GBP). **Item de verificat la build.**

**Tehnic**
- `Seo.astro` centralizează `<title>`, description, canonical self-referențial, OG + Twitter card per pagină.
- **`sitemap.xml`** regenerat (`@astrojs/sitemap`) cu aceleași URL-uri; **`robots.txt`** cu referință la sitemap.
- **Google Analytics 4 păstrat** — detectat pe site-ul actual: **`G-JX978SL3G5`** (gtag.js). Fără GTM, fără Meta Pixel, fără altele. Se integrează identic. (DECIS)
- Favicon + OG image default (de preluat logo la rezoluție bună).
- **Post-deploy:** (re)trimitere sitemap în Search Console, verificare indexare, comparație poziții. Recomand conectarea Search Console dacă nu e deja. Îi arăt clientului pașii (`DEPLOY.md`).

**Checklist de paritate SEO (gate de QA înainte de go-live)** — pentru fiecare din cele 24 de pagini: URL identic ✓, title identic ✓, meta description identică ✓, H1 identic ✓, linkuri interne funcționale ✓, imagini cu alt ✓, JSON-LD valid ✓.

## 9. Performanță, accesibilitate, responsive

- Imagini prin `astro:assets` → AVIF/WebP, `srcset` responsive, `loading="lazy"` sub fold, `width`/`height` explicite (anti-CLS).
- Fonturi self-hosted cu `font-display: swap`, preload pentru fontul de titlu.
- CSS critic inline (Astro face asta by default pentru CSS scoped mic).
- `prefers-reduced-motion` respectat pentru toate animațiile (deja în mockup).
- Responsive: breakpoint principal ~768px (grid-uri → 1 coloană, meniu hamburger CSS-only), plus verificare la 375 / 768 / 1024 / 1440.
- Accesibilitate: contrast AA, `alt` pe toate imaginile, focus states vizibile, landmark-uri semantice, meniu accesibil de la tastatură.
- Țintă: Lighthouse 95+ pe toate categoriile (realist pentru site static).

## 10. Deploy pe shared hosting (automat, prin GitHub Actions)

- **DECIS:** deploy **automat prin GitHub Actions** — la fiecare merge pe `main`, workflow-ul face `astro build` și urcă `dist/` pe shared hosting prin FTP/SFTP. Fără upload manual de rutină.
- Se face **LA FINAL**, după ce clientul revizuiește rezultatul live în browser și aprobă.
- Secrete în GitHub (setate de client): `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_REMOTE_DIR` (ex. `/public_html/`).
- **`.htaccess`** (urcat din `public/`): compresie gzip/brotli, cache headers pe assets (cache lung, hash în nume), forțare HTTPS, canonicalizare trailing slash, eventuale 301.
- **`DEPLOY.md`**: documentează fluxul automat + fallback manual (build local → upload `dist/` prin FTP/cPanel) + pași post-deploy (verificare live, retrimitere sitemap în Search Console, confirmare GA4).

## 11. Decizii confirmate & riscuri rămase

**Decis:**
1. ✅ **Formulare** — eliminate; înlocuite cu buton WhatsApp + telefon + program. (§7)
2. ✅ **Analytics** — se păstrează GA4 `G-JX978SL3G5` (detectat pe site; fără GTM/Pixel). (§8)
3. ✅ **Conținut** — extragere prin **scraping** din paginile publice.
4. ✅ **SEO** — păstrare completă: slug-uri, linkuri interne, title/description exacte, schema LocalBusiness pentru SEO local, GA4. (§8)
5. ✅ **Repo** — `github.com/supportdlh/deeabodycenter.ro`. Găzduire: shared hosting (static).

**Riscuri / de verificat la build:**
- **Adresă exactă + coordonate geo** pentru schema LocalBusiness — de preluat de pe pagina Contact / Google Business Profile.
- **Imagini lipsă/aproximative** — câteva carduri de pe home refolosesc o imagine (ex. Dermohealth); la build folosim imaginea corectă de pe pagina respectivă.
- **Favicon / logo la rezoluție bună** — de confirmat varianta bună a logo-ului.
- **Meta descrieri** — dacă vreo pagină nu are una setată în WP, generăm una potrivită.

## 12. Fazele implementării (detaliul complet vine în planul de implementare)

1. **Schelet Astro** — init proiect, config (static, directory URLs, sitemap, assets), design tokens din V2, layout de bază, Header + Footer + WhatsAppButton. *(Opus)*
2. **Homepage** — portare completă V2 (cu ajustările de hero aprobate) în componente Astro. *(Opus scaffold → Sonnet)*
3. **Template tratament** — `TreatmentLayout` + colecție + schema; validare pe pagina Sculptor. *(Opus)*
4. **Extragere conținut** — scraping cele 24 de pagini → populare content collections (text + imagini optimizate). *(Sonnet, paralel)*
5. **Restul paginilor** — cele 17 tratamente, 3 oferte, Tarife, Contact, Hub servicii. *(Sonnet, paralel)*
6. **SEO & schema** — Seo.astro, JSON-LD, sitemap, robots, OG, favicon. *(Sonnet)*
7. **QA** — verificare vizuală vs. original pe toate paginile, responsive, Lighthouse, linkuri, WhatsApp. *(Opus review + Sonnet fix)*
8. **Deploy** — `.htaccess`, build, ghid FTP, upload. *(Opus)*

---

**Criteriu de succes:** site Astro static care reproduce fidel conținutul și structura celor 24 de pagini, în direcția de design V2 aprobată, cu URL-uri identice, programări pe WhatsApp, publicabil pe shared hosting, cu performanță și SEO cel puțin la nivelul (realist: peste) site-ului WordPress actual.
