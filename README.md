# deeabodycenter.ro

Migrarea site-ului **Deea Body Center** (Ploiești — remodelare corporală & tratamente faciale) de pe WordPress + Elementor pe **Astro static**.

## Obiectiv
Clonă fidelă în conținut, în direcția de design **V2 „Rafinat"**, publicabilă pe shared hosting, cu păstrarea completă a SEO-ului (slug-uri, linkuri interne, meta, schema LocalBusiness).

## Stadiu
🟡 **Faza de design & planificare** — spec aprobat, mockup-uri gata, urmează implementarea Astro.

## Structura repo (momentan)
- `docs/superpowers/specs/` — specificația de design aprobată.
- `reference/` — design tokens, conținut extras, inventar site, imagini sursă.
- `mockups/` — cele 3 variante de design HTML (V1 clonă / V2 rafinat / V3 modern) + hub de comparație. **V2 = varianta aleasă.**

## Decizii cheie
- Astro `output: static`, URL-uri directory identice cu WordPress (zero redirecturi).
- Programări prin **WhatsApp** (`wa.me/40723882529`) — fără backend de formular.
- Găzduire pe **shared hosting** (deploy `dist/` prin FTP/cPanel).
- Analytics: **GA4 `G-JX978SL3G5`** (păstrat din site-ul actual).

## Preview mockup-uri (local)
```bash
cd mockups && python3 -m http.server 8899
# apoi deschide http://127.0.0.1:8899/
```
