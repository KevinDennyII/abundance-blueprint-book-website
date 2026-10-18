/** GA4 measurement ID from the client's Google tag snippet. Public, not a secret. */
export const GA_MEASUREMENT_ID = "G-ER7ZW6KKG6";

const PRODUCTION_HOSTS = new Set([
  "longmoneyconcepts.com",
  "www.longmoneyconcepts.com",
]);

export function isAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return PRODUCTION_HOSTS.has(window.location.hostname);
}

function isAdminPath(path: string): boolean {
  return path === "/admin" || path.startsWith("/admin/");
}

/**
 * Sends a GA4 page_view after the SPA route (and its document.title) is current.
 *
 * The HTML snippet uses `send_page_view: false` so the initial config does not
 * fire with the homepage title from index.html. Do not also leave "Page changes
 * based on browser history events" enabled in GA4 Enhanced Measurement, or
 * route changes will be counted twice.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/views
 * @see https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications
 */
export function trackPageView(path: string): void {
  if (!isAnalyticsEnabled()) return;
  if (isAdminPath(path)) return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path,
  });
}
