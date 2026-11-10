/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
  /** Override CoachAccountable Discovery Call offering URL. */
  readonly VITE_DISCOVERY_CALL_URL?: string;
  /**
   * CoachAccountable "Start Here" collection script URL (Work With Me embed).
   * Legacy Infisical name — value is the script `src`, not an iframe.
   */
  readonly VITE_COACH_ACCOUNTABLE_START_HERE_IFRAME_SRC?: string;
  /** Guide Walkthrough offering — `/walkthrough` redirect. */
  readonly VITE_GUIDE_WALKTHROUGH_URL?: string;
  /** Kit Library Hours form — `/libraryhours` redirect. */
  readonly VITE_LIBRARY_HOURS_URL?: string;
  /** CoachAccountable Kickoff Call booking URL (Cash Flow Intensive). */
  readonly VITE_CASH_FLOW_INTENSIVE_KICKOFF_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer: unknown[];
  gtag?: (...args: unknown[]) => void;
}
