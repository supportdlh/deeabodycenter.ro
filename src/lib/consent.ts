/** The visitor's analytics cookie choice, as stored in localStorage. */
export type Consent = 'granted' | 'denied';

export const CONSENT_KEY = 'cookie-consent';

/** Anything other than a known value (missing, edited by hand, old format) means "not asked yet". */
export function parseConsent(raw: string | null): Consent | null {
  return raw === 'granted' || raw === 'denied' ? raw : null;
}

/** Google Analytics cookie names: `_ga` and `_ga_<container>`. */
export function isAnalyticsCookie(name: string): boolean {
  return name === '_ga' || name.startsWith('_ga_');
}
