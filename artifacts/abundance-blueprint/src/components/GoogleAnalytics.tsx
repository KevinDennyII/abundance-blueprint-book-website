import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackPageView } from "@/lib/analytics";

/**
 * One virtual page_view per public client-side route.
 * Waits a tick so PageMeta can apply the route title first.
 */
export function GoogleAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      trackPageView(location);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location]);

  return null;
}
