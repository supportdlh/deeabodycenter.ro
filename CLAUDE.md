# CLAUDE.md — deeabodycenter.ro

Clonă Astro statică a site-ului WordPress deeabodycenter.ro. Vezi `docs/superpowers/specs/` și `docs/superpowers/plans/` pentru spec + plan.

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
- Deploy = merge pe `main` → GitHub Actions. **NU face merge pe main până nu confirmă clientul** (review pe `build/astro` întâi).

### Referință pixel-perfect
- Ținta e **site-ul LIVE** deeabodycenter.ro (NU mockup-urile din `mockups/`, care diverg).
- Conținut 100% verbatim din live — zero fabricație (mai ales prețuri/oferte).
