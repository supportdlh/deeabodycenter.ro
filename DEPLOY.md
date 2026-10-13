# Deploy — Deea Body Center (Astro static → VPS)

Site Astro 100% static. Deploy **automat prin GitHub Actions** la fiecare push pe `main` (`main` = producție).

Site-ul se mută de pe shared hosting-ul Cyberfolks (176.126.202.224) pe VPS-ul agenției `hosting-dh` (188.212.156.159).
**Zona DNS și e-mailul rămân la Cyberfolks.** Până la mutarea DNS, același build se urcă pe ambele servere.

## Cum funcționează

Workflow-ul `.github/workflows/deploy.yml`:
1. **build** — `npm ci` + `npm run build`, împachetează `dist/` într-o arhivă (fără secrete în acest job).
2. **deploy-vps** — urcă arhiva prin SSH în `dh-deploy-gate` (singura comandă permisă cheii de deploy):
   - `upload <id>` → `/var/www/deeabodycenter.ro/releases/<UTC>-<commit>/`
   - `activate <id>` → comută atomic symlink-ul `current` pe release-ul nou
   - `prune` → păstrează ultimele 5 release-uri (dacă eșuează, doar avertisment: release-ul e deja live)
   - smoke test pe IP-ul serverului (`DEPLOY_HOST` trebuie să fie IP): `/` 200 și conține „Deea Body Center”, `/tarife/` 200, `/sitemap.xml` 200 și e un sitemap index, un redirect vechi 301 spre `/`, URL necunoscut 404. Protocolul se alege singur: HTTP cât timp nu există certificat, HTTPS după ce HTTP începe să redirecționeze (erorile TLS pică testul, nu se ascund).
3. **deploy-ftp** — *(temporar)* urcă același build pe hosting-ul vechi prin FTPS. Se scoate după mutarea DNS.

### Declanșare
- **Automat:** push/merge pe `main`.
- **Manual:** Actions → „Deploy deeabodycenter.ro" → „Run workflow".

### Secrete (Settings → Secrets and variables → Actions)

| Secret | Pentru | Sursă |
|--------|--------|-------|
| `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_KNOWN_HOSTS` | VPS | setate de `scripts/deploy-setup.sh` din repo-ul `vps-administrare-website` (rulat din nou = rotirea cheii) |
| `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR` | hosting vechi (temporar) | contul FTP din cPanel Cyberfolks |

## Configurația serverului

- Nginx: regulile specifice site-ului stau în [deploy/server/deeabodycenter.ro.locations](deploy/server/deeabodycenter.ro.locations), instalat ca `/etc/nginx/dh-sites/deeabodycenter.ro.locations`. Conține echivalentul din `public/.htaccess`: redirecturile 301 ale paginilor WordPress vechi, `/sitemap.xml` → `sitemap-index.xml`, cache-ul (HTML `no-cache`, `/_astro/` imutabil 1 an, imagini 30 zile).
- HTTPS (Let's Encrypt, reînnoire automată), `www` → apex, gzip și header-ele de securitate vin din configurația comună a serverului.
- **O regulă nouă de redirect/cache se adaugă în ambele locuri** (`.locations` și `public/.htaccess`) cât timp rulează și hosting-ul vechi. Fișierul `.locations` modificat se reinstalează pe server (backup + `nginx -t` + reload) din repo-ul `vps-administrare-website`.
- `public/.htaccess` ajunge și pe VPS, dar nginx nu îl citește (și nu îl servește: fișierele ascunse sunt blocate).

## Rollback (VPS)

**Rollback-ul e manual.** Dacă smoke test-ul pică, jobul e roșu, dar release-ul nou rămâne live (intenționat: o eroare de rețea la test nu trebuie să retragă un release bun). Verifică site-ul și, dacă e stricat, revino:

Din repo-ul `vps-administrare-website`, pe server:
```bash
sudo -u s_deeabodycenter_ro -H env SSH_ORIGINAL_COMMAND=list /usr/local/sbin/dh-deploy-gate      # ce e activ
sudo -u s_deeabodycenter_ro -H env SSH_ORIGINAL_COMMAND=rollback /usr/local/sbin/dh-deploy-gate  # release-ul anterior
```
Alternativ: `git revert` pe `main` și push (deploy nou).

## Mutarea DNS (o singură dată)

DNS-ul e la Cyberfolks. E-mailul nu trebuie să depindă de IP-ul site-ului:
- `MX 0 mail.deeabodycenter.ro`, `mail` A 176.126.202.224, `ftp` A 176.126.202.224 (nu CNAME spre apex).

Pași:
1. Primul deploy pe VPS reușit (smoke test verde) + verificarea tuturor URL-urilor din sitemap pe IP.
2. **Cu acordul clientului:** `@` A → 188.212.156.159 (TTL 300). `www` e CNAME spre apex și urmează automat.
3. După propagare: `sudo dh-site ssl deeabodycenter.ro` (certificat pentru apex + www).
4. Checklist-ul de mai jos + test de primire/trimitere e-mail.

Rollback la mutare: `@` A înapoi pe 176.126.202.224 (hosting-ul vechi are același conținut, prin deploy-ul FTP).

## După mutare (checklist)

1. Verifică site-ul live: homepage, câteva pagini de tratament, Tarife, Contact, oferte, un redirect vechi.
2. **Search Console:** (re)trimite `https://deeabodycenter.ro/sitemap.xml`; verifică indexarea în zilele următoare.
3. **Google Analytics 4** (`G-JX978SL3G5`): confirmă că înregistrează trafic (Realtime).
4. Testează un CTA WhatsApp de pe telefon.
5. Verifică schema cu Google Rich Results Test (LocalBusiness pe homepage).
6. Monitor UptimeRobot (HTTP(S), 5 min) — se creează din interfață.

## Curățenie (după 1–2 săptămâni stabile pe VPS)

- Scoate jobul `deploy-ftp` din workflow și secretele `FTP_*` din GitHub.
- Șterge `public/.htaccess`.
- Arhivează fișierele site-ului de pe hosting-ul vechi (contul rămâne pentru e-mail).
