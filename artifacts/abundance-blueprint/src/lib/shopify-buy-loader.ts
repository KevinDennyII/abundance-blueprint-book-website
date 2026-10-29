import {
  SHOPIFY_BUY_BUTTON_SCRIPT_URL,
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
} from "@/lib/shopify-buy-button";

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
const mountedShopifyNodes = new Set<string>();

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
    // Cross-origin CDN; no SRI — Shopify serves a floating /latest/ build.
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Shopify Buy Button script failed to load"));
    (document.head || document.body).appendChild(script);
  });
}

type MountArgs = {
  nodeId: string;
  node: HTMLElement;
  cancelled: () => boolean;
  create: (ui: ShopifyBuyUI) => void;
};

/** Load script once, build client, create a Buy Button component on `node`. */
export async function mountShopifyBuyComponent({
  nodeId,
  node,
  cancelled,
  create,
}: MountArgs): Promise<void> {
  await loadBuyButtonScript();
  if (cancelled() || !window.ShopifyBuy?.UI) return;
  if (mountedShopifyNodes.has(nodeId)) return;

  mountedShopifyNodes.add(nodeId);
  node.replaceChildren();

  try {
    const client = window.ShopifyBuy.buildClient({
      domain: SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });
    const ui = await window.ShopifyBuy.UI.onReady(client);
    if (cancelled()) {
      mountedShopifyNodes.delete(nodeId);
      return;
    }
    create(ui);
  } catch (err) {
    mountedShopifyNodes.delete(nodeId);
    throw err;
  }
}
