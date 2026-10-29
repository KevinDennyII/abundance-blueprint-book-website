import { useEffect, useRef } from "react";
import {
  SHOPIFY_MONEY_FORMAT,
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  shopifyProductButtonOptions,
} from "@/lib/shopify-buy-button";
import {
  loadBuyButtonScript,
  mountedShopifyNodes,
} from "@/lib/shopify-buy-loader";

type ShopifyBuyProductProps = {
  productId: string;
  variantId: string;
  nodeId: string;
  buttonText: string;
  tone?: "solid" | "outline";
  className?: string;
};

/**
 * Compact Shopify Buy Button for a single product variant (Library guide CTAs).
 * Card chrome stays in React; only the checkout button is Shopify’s iframe.
 */
export function ShopifyBuyProduct({
  productId,
  variantId,
  nodeId,
  buttonText,
  tone = "solid",
  className,
}: ShopifyBuyProductProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let cancelled = false;

    async function mount() {
      try {
        await loadBuyButtonScript();
        if (cancelled || !node || !window.ShopifyBuy?.UI) return;
        if (mountedShopifyNodes.has(nodeId)) return;

        mountedShopifyNodes.add(nodeId);
        node.replaceChildren();

        const client = window.ShopifyBuy.buildClient({
          domain: SHOPIFY_STORE_DOMAIN,
          storefrontAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        });

        const ui = await window.ShopifyBuy.UI.onReady(client);
        if (cancelled) {
          mountedShopifyNodes.delete(nodeId);
          return;
        }

        ui.createComponent("product", {
          id: productId,
          variantId,
          node,
          moneyFormat: SHOPIFY_MONEY_FORMAT,
          options: shopifyProductButtonOptions(buttonText, tone),
        });
      } catch (err) {
        mountedShopifyNodes.delete(nodeId);
        console.error("[ShopifyBuyProduct]", err);
      }
    }

    void mount();

    return () => {
      cancelled = true;
    };
  }, [buttonText, nodeId, productId, tone, variantId]);

  return (
    <div
      ref={containerRef}
      id={nodeId}
      className={className}
      data-testid={`shopify-product-${nodeId}`}
    />
  );
}
