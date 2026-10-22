/**
 * Google Analytics 4, loaded only after the visitor accepts analytics cookies.
 * Before that no request goes to Google and trackEvent() is a no-op.
 */
import { CONSENT_KEY, isAnalyticsCookie, parseConsent, type Consent } from '../lib/consent';

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag };

const win = window as AnalyticsWindow;

export function readConsent(): Consent | null {
  try {
    return parseConsent(localStorage.getItem(CONSENT_KEY));
  } catch {
    // Storage blocked (private mode, strict settings): ask again on every page.
    return null;
  }
}

function storeConsent(choice: Consent): void {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch (error) {
    console.warn('Cookie choice could not be saved', error);
  }
}

export function loadAnalytics(measurementId: string): void {
  if (win.gtag) return;
  win.dataLayer = win.dataLayer ?? [];
  // gtag.js reads the `arguments` object itself, so this must not be an arrow function.
  win.gtag = function gtag() {
    win.dataLayer?.push(arguments);
  };
  win.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  });
  win.gtag('js', new Date());
  win.gtag('config', measurementId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
}

export function trackEvent(name: string, params: Record<string, string> = {}): void {
  win.gtag?.('event', name, params);
}

/** Removes `_ga*` cookies on this host and on the parent domain gtag.js sets them on. */
export function clearAnalyticsCookies(): void {
  const host = location.hostname.replace(/^www\./, '');
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0]?.trim() ?? '';
    if (!isAnalyticsCookie(name)) continue;
    for (const domain of ['', `; domain=.${host}`]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

export function setConsent(choice: Consent, measurementId: string): void {
  const previous = readConsent();
  storeConsent(choice);
  if (choice === 'granted') {
    loadAnalytics(measurementId);
    return;
  }
  if (previous === 'granted') {
    // Without this gtag.js rewrites its cookie on page hide, right after we delete it.
    win.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    clearAnalyticsCookies();
    // gtag.js cannot be unloaded; a reload starts the page without it.
    location.reload();
  }
}

/** WhatsApp and phone clicks are how visitors book, so they are the site's conversions. */
export function trackContactClicks(): void {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>(
      'a[href^="https://wa.me/"], a[href^="tel:"], a[href^="mailto:"]',
    );
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    if (href.startsWith('https://wa.me/')) {
      trackEvent('click_whatsapp', { page_path: location.pathname });
    } else if (href.startsWith('tel:')) {
      trackEvent('click_to_call', { phone_number: href.slice(4) });
    } else {
      trackEvent('click_email');
    }
  });
}
