export const INSTAGRAM_URL = "https://www.instagram.com/longmoneycpa/";
export const INSTAGRAM_HANDLE = "@longmoneycpa";

export const COMPANY_PHONE_DISPLAY = "443-961-5664";
export const COMPANY_PHONE_TEL = "tel:+14439615664";

export const LONG_MONEY_CIRCLE_FACEBOOK_URL =
  "https://www.facebook.com/share/g/1JMNzjXHi6/?mibextid=wwXIfr";

export const SIMPLETEXTING_JOIN_FORM_URL =
  "https://app2.simpletexting.com/join/joinWebForm?webFormId=6a66181d3d07f1b47d9053a3&c=USA";

function viteOptionalUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * CoachAccountable Discovery Call offering (all "Book a discovery call" CTAs).
 * Override with VITE_DISCOVERY_CALL_URL if the offering link changes.
 */
export const DISCOVERY_CALL_URL =
  viteOptionalUrl(import.meta.env.VITE_DISCOVERY_CALL_URL) ??
  "https://www.coachaccountable.com/offering/PO86ljO5WWYIdEe503YZjxGwK1SLDuX";

/**
 * CoachAccountable "Start Here" collection script (Work With Me embed).
 * Client snippet:
 * `<script src="https://www.coachaccountable.com/offering/SwYxIc8SsSSlpyKBLzuOwSf2o3Nj09g"></script>`
 * Infisical key VITE_COACH_ACCOUNTABLE_START_HERE_IFRAME_SRC can override (legacy name).
 */
export const COACH_ACCOUNTABLE_START_HERE_SCRIPT_SRC =
  viteOptionalUrl(import.meta.env.VITE_COACH_ACCOUNTABLE_START_HERE_IFRAME_SRC) ??
  "https://www.coachaccountable.com/offering/SwYxIc8SsSSlpyKBLzuOwSf2o3Nj09g";

/** @deprecated Use COACH_ACCOUNTABLE_START_HERE_SCRIPT_SRC */
export const COACH_ACCOUNTABLE_START_HERE_IFRAME_SRC =
  COACH_ACCOUNTABLE_START_HERE_SCRIPT_SRC;

/**
 * Guide Walkthrough offering — `/walkthrough` redirect target.
 * Override with VITE_GUIDE_WALKTHROUGH_URL if the offering link changes.
 */
export const GUIDE_WALKTHROUGH_URL =
  viteOptionalUrl(import.meta.env.VITE_GUIDE_WALKTHROUGH_URL) ??
  "https://www.coachaccountable.com/offering/PbLRXATJynz9VcHhCX50M4ok4juiOvc";

/**
 * Library Hours form on the letter site — `/libraryhours` redirect target.
 * Override with VITE_LIBRARY_HOURS_URL if the form URL changes.
 */
export const LIBRARY_HOURS_URL =
  viteOptionalUrl(import.meta.env.VITE_LIBRARY_HOURS_URL) ??
  "https://letter.longmoneyconcepts.com/libraryhours";

/** Unlisted Cash Flow Intensive detail page (share after discovery; not linked from nav). */
export const CASH_FLOW_INTENSIVE_PATH = "/cash-flow-intensive";

/**
 * CoachAccountable Kickoff Call booking for the Cash Flow Intensive.
 * Set via VITE_CASH_FLOW_INTENSIVE_KICKOFF_URL — CTA stays disabled until set.
 */
export const CASH_FLOW_INTENSIVE_KICKOFF_URL = viteOptionalUrl(
  import.meta.env.VITE_CASH_FLOW_INTENSIVE_KICKOFF_URL,
);

/** Hosted crisis PDFs — free, no signup. Library cards route to `/crisis`. */
export const CRISIS_PAGE_PATH = "/crisis";
export const CRISIS_STABILIZATION_ROADMAP_URL =
  "/crisis/crisis-stabilization-roadmap.pdf";
export const CRISIS_RESOURCE_GUIDE_URL = "/crisis/crisis-resource-guide.pdf";

/**
 * The Long Money Letter — public newsletter/articles host.
 * `/articles` and `/blog` on the main site permanently redirect here.
 */
export const LETTER_SITE_URL = "https://letter.longmoneyconcepts.com";

/** Kit (ConvertKit) creator site (legacy Kit domain; letter subdomain is canonical). */
export const KIT_SITE_URL = "https://long-money-concepts-llc.kit.com/";

/** Book launch / Chapter 1 landing page on Kit. */
export const KIT_BOOK_LAUNCH_URL =
  "https://long-money-concepts-llc.kit.com/e30afd8248";

/**
 * Weekly Pulse Kit signup forms (Business / Personal) — hosted form pages.
 * Soft gate: Library/Live link here; after signup, Kit automation should email
 * the unlisted app at https://www.longmoneyconcepts.com/pulse
 */
export const KIT_WEEKLY_PULSE_BUSINESS_FORM_URL = `${KIT_SITE_URL}c01e8fb0af`;
export const KIT_WEEKLY_PULSE_PERSONAL_FORM_URL = `${KIT_SITE_URL}b240865c92`;
/** Unlisted Weekly Money Pulse web app (not in nav; share after Kit signup). */
export const WEEKLY_MONEY_PULSE_APP_PATH = "/pulse";

/**
 * Workshop waitlist — confirm Kit/form URL + month with client.
 * Placeholder month until she confirms.
 */
export const WORKSHOP_WAITLIST_URL: string | null = null;
export const WORKSHOP_COMING_LABEL = "Coming [MONTH]";

/** Okayinaire / Long Money Letter list — Kit form ID (public, not a secret). */
export const KIT_OKAYINAIRE_FORM_ID = "10086596";

/** Okayinaire Kit form embed UID (reference / Tag Assistant). */
export const KIT_OKAYINAIRE_FORM_UID = "ae4843bb11";

/** Long Money Live waitlist — Kit form ID (public, not a secret). */
export const KIT_LIVE_FORM_ID = "10117125";

/** Long Money Live Kit form embed UID (reference / Tag Assistant). */
export const KIT_LIVE_FORM_UID = "aeeec1565c";

/** Kit tag applied to Long Money Live waitlist subscribers. */
export const KIT_LIVE_TAG = "long-money-live";

/** Hosting inquiry for Long Money Live. */
export const LIVE_HOSTING_EMAIL = "latoya@longmoneyconcepts.com";
export const LIVE_HOSTING_MAILTO =
  "mailto:latoya@longmoneyconcepts.com?subject=Hosting%20Long%20Money%20Live";

/** Official Urban Dictionary entry for okayinaire. */
export const OKAYINAIRE_URBAN_DICTIONARY_URL =
  "https://www.urbandictionary.com/define.php?term=okayinaire&defid=18752636";
