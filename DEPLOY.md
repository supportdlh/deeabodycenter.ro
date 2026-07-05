# Deploy — Deea Body Center (Astro static → shared hosting)

Site Astro 100% static. Deploy **automat prin GitHub Actions** la fiecare push pe `main`.

## Deploy automat (recomandat)

La fiecare `push`/merge pe branch-ul `main`, workflow-ul `.github/workflows/deploy.yml`:
1. face `npm ci` + `npm run build` (generează `dist/`),
2. urcă **conținutul `dist/`** pe shared hosting prin FTP/FTPS.

### Secrete necesare (Settings → Secrets and variables → Actions)

Workflow-ul referă EXACT aceste nume — asigură-te că se potrivesc:

| Secret | Valoare | Exemplu |
|--------|---------|---------|
| `FTP_SERVER` | host-ul FTP | `ftp.deeabodycenter.ro` sau IP-ul din cPanel |
| `FTP_USERNAME` | utilizatorul FTP | `deploy@deeabodycenter.ro` |
| `FTP_PASSWORD` | parola FTP | *(secret)* |
| `FTP_SERVER_DIR` | directorul de destinație pe server | `/public_html/` |

> Dacă ai folosit alte nume la crearea secretelor, fie le redenumești în GitHub, fie îmi spui numele și ajustez `deploy.yml`.
> Protocolul e setat pe `ftps` (recomandat). Dacă hostul acceptă doar FTP simplu, schimbă `protocol: ftps` → `protocol: ftp` în workflow. Dacă cere SFTP, trecem pe `wlixcc/SFTP-Deploy-Action`.

### Declanșare
- **Automat:** merge pe `main`.
- **Manual:** Actions → „Deploy pe shared hosting" → „Run workflow".

## Deploy manual (fallback)

```bash
npm ci
npm run build
# urcă TOT conținutul din dist/ în public_html prin FTP client sau cPanel File Manager
```
`.htaccess` e inclus în `dist/` (din `public/.htaccess`) — se urcă automat.

## După primul deploy (checklist)

1. Verifică site-ul live: homepage, câteva pagini de tratament, Tarife, Contact, oferte.
2. Confirmă că `https://deeabodycenter.ro/` servește noul site (nu cache-ul WordPress) — golește cache-ul din cPanel/LiteSpeed dacă e cazul.
3. **Search Console:** (re)trimite `https://deeabodycenter.ro/sitemap-index.xml`; verifică indexarea în zilele următoare.
4. **Google Analytics 4** (`G-JX978SL3G5`): confirmă că înregistrează trafic (Realtime).
5. Testează un CTA WhatsApp de pe telefon.
6. Verifică schema cu Google Rich Results Test (LocalBusiness pe homepage).

## Note
- Slug-urile sunt identice cu WordPress → fără redirecturi, fără pierdere SEO.
- Backup: păstrează o copie a WordPress-ului până confirmi că noul site rulează corect câteva zile.
