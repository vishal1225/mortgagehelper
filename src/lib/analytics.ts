type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", name, params);
    return;
  }

  if (window.dataLayer) {
    window.dataLayer.push({ event: name, ...params });
  }
}
