import { SHOPIFY_BUY_BUTTON_SCRIPT_URL } from "@/lib/shopify-buy-button";

export type ShopifyBuyUI = {
  createComponent: (
    type: "collection" | "product" | "productSet" | "cart" | "toggle",
    config: Record<string, unknown>,
  ) => void;
};

export type ShopifyBuyClient = unknown;

export type ShopifyBuyGlobal = {
  buildClient: (config: {
    domain: string;
    storefrontAccessToken: string;
  }) => ShopifyBuyClient;
  UI: {
    onReady: (client: ShopifyBuyClient) => Promise<ShopifyBuyUI>;
  };
};

declare global {
  interface Window {
    ShopifyBuy?: ShopifyBuyGlobal;
  }
}

/** Prevents duplicate mounts across Strict Mode remounts. */
export const mountedShopifyNodes = new Set<string>();

export function loadBuyButtonScript(): Promise<void> {
  if (window.ShopifyBuy?.UI) {
    return Promise.resolve();
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${SHOPIFY_BUY_BUTTON_SCRIPT_URL}"]`,
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.ShopifyBuy?.UI) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Shopify Buy Button script failed to load")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = SHOPIFY_BUY_BUTTON_SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Shopify Buy Button script failed to load"));
    (document.head || document.body).appendChild(script);
  });
}
