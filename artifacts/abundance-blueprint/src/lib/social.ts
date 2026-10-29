export const INSTAGRAM_URL = "https://www.instagram.com/longmoneycpa/";
export const INSTAGRAM_HANDLE = "@longmoneycpa";

export const COMPANY_PHONE_DISPLAY = "443-961-5664";
export const COMPANY_PHONE_TEL = "tel:+14439615664";

export const LONG_MONEY_CIRCLE_FACEBOOK_URL =
  "https://www.facebook.com/share/g/1JMNzjXHi6/?mibextid=wwXIfr";

export const SIMPLETEXTING_JOIN_FORM_URL =
  "https://app2.simpletexting.com/join/joinWebForm?webFormId=6a66181d3d07f1b47d9053a3&c=USA";

/** Acuity discovery call — used for green readiness results (Reset & Advisory). */
export const DISCOVERY_CALL_URL =
  "https://longmoneycpa.as.me/DiscoveryCall";

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
 * Weekly Pulse Kit signup forms (Business / Personal).
 * Embed scripts (for reference):
 *   <script async data-uid="c01e8fb0af" src="…/c01e8fb0af/index.js"></script>
 *   <script async data-uid="b240865c92" src="…/b240865c92/index.js"></script>
 * Library CTAs link to the hosted form pages so the card keeps its button layout.
 */
export const KIT_WEEKLY_PULSE_BUSINESS_FORM_UID = "c01e8fb0af";
export const KIT_WEEKLY_PULSE_PERSONAL_FORM_UID = "b240865c92";
export const KIT_WEEKLY_PULSE_BUSINESS_FORM_URL = `${KIT_SITE_URL}${KIT_WEEKLY_PULSE_BUSINESS_FORM_UID}`;
export const KIT_WEEKLY_PULSE_PERSONAL_FORM_URL = `${KIT_SITE_URL}${KIT_WEEKLY_PULSE_PERSONAL_FORM_UID}`;

/** Weekly Pulse card art (Library). */
export const WEEKLY_PULSE_IMAGE_URL = "/library/weekly-pulse.png";

/**
 * Guides checkout moved to Shopify Buy Button collection — see
 * `@/lib/shopify-buy-button` and `ShopifyBuyCollection`.
 *
 * Legacy Kit / Lulu guide URLs kept for reference only (no longer linked on Library).
 */
export const KIT_COMMERCE_SCRIPT_URL = `${LETTER_SITE_URL}/commerce.js`;
export const KIT_FINANCIAL_FOUNDATIONS_URL =
  "https://long-money-concepts-llc.kit.com/products/financial-foundations-workbook";
export const KIT_BUSINESS_NOT_ATM_URL = `${LETTER_SITE_URL}/products/yourbusinessisnotyouratm`;
export const LULU_FINANCIAL_FOUNDATIONS_URL =
  "https://svc.lulu.com/?items=49658522-c522-49f0-a220-f3119faac926";
export const LULU_BUSINESS_NOT_ATM_URL =
  "https://svc.lulu.com/?items=92680474-6caf-4551-8c3c-bae84a27fe89";

/**
 * Merch checkout moved to Shopify Buy Button — see `@/lib/shopify-buy-button`
 * (`SHOPIFY_MERCH_COLLECTION_*`) and `ShopifyBuyCollection` on /library.
 * Legacy Printful storefront kept for reference only.
 */
export const PRINTFUL_SHOP_URL = "https://longmoneyconcepts.printful.me/";

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

/** Official Urban Dictionary entry for okayinaire. */
export const OKAYINAIRE_URBAN_DICTIONARY_URL =
  "https://www.urbandictionary.com/define.php?term=okayinaire&defid=18752636";
