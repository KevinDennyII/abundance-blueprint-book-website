/**
 * Shopify Buy Button (Storefront) — Guides + Merch on /library.
 *
 * Security notes:
 * - SHOPIFY_STOREFRONT_ACCESS_TOKEN must remain a Storefront API token
 *   (catalog/checkout only). Never put an Admin API token (`shpat_…`) here.
 * - Script URL uses `/latest/` because Shopify requires the current Storefront
 *   Buy Button build after Checkout API deprecation; versioned CDN paths 404.
 *   Compensating control: Vite/Replit CSP allowlists `sdks.shopifycdn.com`.
 */

export const SHOPIFY_BUY_BUTTON_SCRIPT_URL =
  "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

export const SHOPIFY_STORE_DOMAIN = "9uqgh1-a9.myshopify.com";

/**
 * Public Storefront API token for Buy Button embeds (intentional client exposure).
 * Verify in Shopify Admin → Buy Button / Storefront API that scopes are
 * storefront-only; rotate if this was ever issued as Admin credentials.
 */
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  "574e3072a5a90306f8f65f4509bc86a0";

/** Decodes to `${{amount}}`. */
export const SHOPIFY_MONEY_FORMAT = "%24%7B%7Bamount%7D%7D";

/** Brand tokens for Buy Button iframe styles (match site primary). */
export const SHOPIFY_BRAND = {
  primary: "#2d1b4e",
  primaryForeground: "#f7f1ea",
  border: "#2d1b4e",
} as const;

/** Merch collection. */
export const SHOPIFY_MERCH_COLLECTION_ID = "512265158765";
export const SHOPIFY_MERCH_COLLECTION_NODE_ID =
  "collection-component-1793233624648";

export type GuideBadgeTone = "solid" | "new";

/**
 * Guide products + variants from Storefront API (numeric Buy Button ids).
 * Digital / Print map to the Library card CTAs.
 */
export const SHOPIFY_GUIDES = {
  financialFoundations: {
    productId: "15414445080685",
    title: "Financial Foundations",
    eyebrow: "Guide + workbook",
    audience: "For anyone building their footing",
    body: "A guide and workbook with five foundations, plain-language teaching, and real journal space to make it yours.",
    badge: "Available now",
    badgeTone: "solid" as GuideBadgeTone,
    digital: {
      variantId: "67895113711725",
      priceLabel: "$27",
      nodeId: "shopify-ff-digital",
      buttonText: "Buy Now",
    },
    print: {
      variantId: "67895110959213",
      priceLabel: "Print on demand",
      nodeId: "shopify-ff-print",
      buttonText: "Buy Print",
    },
  },
  businessNotAtm: {
    productId: "15414428663917",
    title: "Your Business Is Not Your ATM",
    eyebrow: "Guide + workbook",
    audience: "For business owners, owner-operators & 1099 contractors",
    body: "Separate what the business earns from what you live on. Learn to treat taxes as a regular weekly bill instead of a yearly surprise, and pay yourself on purpose.",
    badge: "New",
    badgeTone: "new" as GuideBadgeTone,
    digital: {
      variantId: "67895103029357",
      priceLabel: "$47",
      nodeId: "shopify-atm-digital",
      buttonText: "Buy Now",
    },
    print: {
      variantId: "67895102996589",
      priceLabel: "Print on demand",
      nodeId: "shopify-atm-print",
      buttonText: "Buy Print",
    },
  },
} as const;

const shopifyCheckoutChrome = {
  modalProduct: {
    contents: {
      img: false,
      imgWithCarousel: true,
      button: false,
      buttonWithQuantity: true,
    },
    styles: {
      button: {
        "background-color": SHOPIFY_BRAND.primary,
        color: SHOPIFY_BRAND.primaryForeground,
        "border-radius": "6px",
      },
    },
    text: {
      button: "Add to cart",
    },
  },
  cart: {
    text: {
      total: "Subtotal",
      button: "Checkout",
    },
    styles: {
      button: {
        "background-color": SHOPIFY_BRAND.primary,
        color: SHOPIFY_BRAND.primaryForeground,
      },
    },
  },
  toggle: {
    styles: {
      toggle: {
        "background-color": SHOPIFY_BRAND.primary,
      },
    },
  },
} as const;

/** Compact product button options for guide Digital / Print CTAs. */
export function shopifyProductButtonOptions(
  buttonText: string,
  tone: "solid" | "outline" = "solid",
) {
  const isSolid = tone === "solid";
  return {
    product: {
      contents: {
        img: false,
        imgWithCarousel: false,
        title: false,
        variantTitle: false,
        price: false,
        description: false,
        options: false,
        quantity: false,
        button: true,
        buttonWithQuantity: false,
      },
      styles: {
        product: {
          "text-align": "left",
          "margin-bottom": "0",
        },
        button: {
          "font-family": "inherit",
          "font-size": "14px",
          "font-weight": "500",
          "border-radius": "6px",
          padding: "10px 16px",
          width: "100%",
          "background-color": isSolid ? SHOPIFY_BRAND.primary : "transparent",
          color: isSolid
            ? SHOPIFY_BRAND.primaryForeground
            : SHOPIFY_BRAND.primary,
          border: `1px solid ${SHOPIFY_BRAND.border}`,
          ":hover": {
            "background-color": isSolid
              ? "#24163f"
              : "rgba(45, 27, 78, 0.06)",
          },
        },
      },
      text: {
        button: buttonText,
      },
    },
    ...shopifyCheckoutChrome,
  };
}

/** Merch collection embed options — branded grid inside our card. */
export const SHOPIFY_MERCH_COLLECTION_OPTIONS = {
  product: {
    styles: {
      product: {
        "@media (min-width: 601px)": {
          "max-width": "calc(50% - 20px)",
          "margin-left": "20px",
          "margin-bottom": "40px",
          width: "calc(50% - 20px)",
        },
        "text-align": "left",
      },
      title: {
        "font-family": "Georgia, 'Times New Roman', serif",
        "font-size": "18px",
        color: SHOPIFY_BRAND.primary,
      },
      price: {
        color: "#6b6560",
      },
      button: {
        "font-family": "inherit",
        "background-color": "transparent",
        color: SHOPIFY_BRAND.primary,
        border: `1px solid ${SHOPIFY_BRAND.border}`,
        "border-radius": "6px",
        ":hover": {
          "background-color": "rgba(45, 27, 78, 0.06)",
        },
      },
    },
    text: {
      button: "Add to cart",
    },
  },
  productSet: {
    styles: {
      products: {
        "@media (min-width: 601px)": {
          "margin-left": "-20px",
        },
      },
    },
  },
  option: {},
  ...shopifyCheckoutChrome,
};
