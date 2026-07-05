# Inventar complet site deeabodycenter.ro (din sitemap)

Total: **24 de pagini**, fără blog real (doar postarea default „hello-world", de ignorat).

## Pagini principale (4)
- `/` — Homepage
- `/contact/` — Contact
- `/tarife/` — Tarife
- `/servicii-tratamente-faciale-si-corporale/` — Hub servicii

## Pagini oferte (3)
- `/oferte-speciale-tratamente-faciale-si-corporale/`
- `/oferte-tratamente-corporale/`
- `/oferte-tratamente-faciale/`

## Pagini tratamente faciale (8)
- `/tratament-facial-intraceuticals/`
- `/tratament-opti-firm/`
- `/tratament-green-peel-by-dr-schrammek/`
- `/tratament-hidratiq/`
- `/tratament-facial-cu-radiofrecventa-4k/`
- `/tratament-facial-micropen/`
- `/microdermabraziune/`
- `/cromoterapie-faciala/`

## Pagini tratamente corporale / remodelare (9)
- `/tratament-sculptor/`
- `/masaj-transdermic-dermohealth/`
- `/slabire-cu-zentisse-slim-light-laser/`
- `/tratare-celulita-cu-velashape2/`
- `/criolipoliza/`
- `/slabire-prin-electrostimulare/`
- `/presoterapie/`
- `/epilarea-definitiva-cu-laserul-xlight/`
- `/solar/`

## Note pentru migrarea Astro
- Toate paginile de tratament par să folosească același template (hero full-width + intro + acordeoane Corporal/Facial + sidebar cu beneficii + formular) — un singur layout parametrizat în Astro, alimentat din content collections.
- Paginile de oferte = un al doilea template.
- Homepage, Contact, Tarife, Hub servicii = pagini unice.
- Păstrează EXACT aceleași slug-uri URL (SEO — evită redirecturi). Ex: `/tratament-sculptor/`.
- CTA programare → WhatsApp `wa.me/40723882529` (vezi memoria de proiect).
- De verificat la faza de spec: robots.txt, favicon, Open Graph / meta per pagină, Google Analytics/Pixel existent, sitemap.xml de regenerat, 301 pentru orice URL vechi diferit.
