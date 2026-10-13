# Deploy — Deea Body Center (Astro static → VPS)

Site Astro 100% static. Deploy **automat prin GitHub Actions** la fiecare push pe `main` (`main` = producție).

Site-ul e găzduit pe VPS-ul agenției `hosting-dh` (188.212.156.159), mutat de pe shared hosting-ul Cyberfolks pe 2026-10-13.
**Zona DNS rămâne la Cyberfolks** (MX/`mail`/`ftp` rămân pe 176.126.202.224).

## Cum funcționează

Workflow-ul `.github/workflows/deploy.yml`:
1. **build** — `npm ci` + `npm run build`, împachetează `dist/` într-o arhivă (fără secrete în acest job).
2. **deploy-vps** — urcă arhiva prin SSH în `dh-deploy-gate` (singura comandă permisă cheii de deploy):
   - `upload <id>` → `/var/www/deeabodycenter.ro/releases/<UTC>-<commit>/`
   - `activate <id>` → comută atomic symlink-ul `current` pe release-ul nou
   - `prune` → păstrează ultimele 5 release-uri (dacă eșuează, doar avertisment: release-ul e deja live)
   - smoke test pe IP-ul serverului (`DEPLOY_HOST` trebuie să fie IP): `/` 200 și conține „Deea Body Center”, `/tarife/` 200, `/sitemap.xml` 200 și e un sitemap index, un redirect vechi 301 spre `/`, URL necunoscut 404. Protocolul se alege singur: HTTP cât timp nu există certificat, HTTPS după ce HTTP începe să redirecționeze (erorile TLS pică testul, nu se ascund).

### Declanșare
- **Automat:** push/merge pe `main`.
- **Manual:** Actions → „Deploy deeabodycenter.ro" → „Run workflow".

### Secrete (Settings → Secrets and variables → Actions)

| Secret | Pentru | Sursă |
|--------|--------|-------|
| `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_KNOWN_HOSTS` | VPS | setate de `scripts/deploy-setup.sh` din repo-ul `vps-administrare-website` (rulat din nou = rotirea cheii) |

## Configurația serverului

- Nginx: regulile specifice site-ului stau în [deploy/server/deeabodycenter.ro.locations](deploy/server/deeabodycenter.ro.locations), instalat ca `/etc/nginx/dh-sites/deeabodycenter.ro.locations`. Conține redirecturile 301 ale paginilor WordPress vechi, `/sitemap.xml` → `sitemap-index.xml`, cache-ul (HTML `no-cache`, `/_astro/` imutabil 1 an, imagini 30 zile).
- HTTPS (Let's Encrypt, reînnoire automată), `www` → apex, gzip și header-ele de securitate vin din configurația comună a serverului.
- O regulă nouă de redirect/cache se adaugă în `.locations`; fișierul modificat se reinstalează pe server (backup + `nginx -t` + reload) din repo-ul `vps-administrare-website` — nu se aplică prin deploy.

## Rollback (VPS)

**Rollback-ul e manual.** Dacă smoke test-ul pică, jobul e roșu, dar release-ul nou rămâne live (intenționat: o eroare de rețea la test nu trebuie să retragă un release bun). Verifică site-ul și, dacă e stricat, revino:

Din repo-ul `vps-administrare-website`, pe server:
```bash
sudo -u s_deeabodycenter_ro -H env SSH_ORIGINAL_COMMAND=list /usr/local/sbin/dh-deploy-gate      # ce e activ
sudo -u s_deeabodycenter_ro -H env SSH_ORIGINAL_COMMAND=rollback /usr/local/sbin/dh-deploy-gate  # release-ul anterior
```
Alternativ: `git revert` pe `main` și push (deploy nou).

## DNS

Zona e la Cyberfolks. E-mailul nu depinde de IP-ul site-ului: `MX 0 mail.deeabodycenter.ro`, `mail` și `ftp` A 176.126.202.224 (nu CNAME spre apex). `@` A → 188.212.156.159 (TTL 300), `www` CNAME spre apex. Certificatul Let's Encrypt (apex + www) se reînnoiește automat pe server.
