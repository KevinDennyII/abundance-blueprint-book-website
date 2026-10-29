import { useEffect, useRef } from "react";
import {
  SHOPIFY_MERCH_COLLECTION_ID,
  SHOPIFY_MERCH_COLLECTION_NODE_ID,
  SHOPIFY_MERCH_COLLECTION_OPTIONS,
  SHOPIFY_MONEY_FORMAT,
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
} from "@/lib/shopify-buy-button";
import {
  loadBuyButtonScript,
  mountedShopifyNodes,
} from "@/lib/shopify-buy-loader";

type ShopifyBuyCollectionProps = {
  className?: string;
  nodeId?: string;
  collectionId?: string;
  "data-testid"?: string;
};

/**
 * Shopify Buy Button collection embed (Merch grid inside branded Library card).
 */
export function ShopifyBuyCollection({
  className,
  nodeId = SHOPIFY_MERCH_COLLECTION_NODE_ID,
  collectionId = SHOPIFY_MERCH_COLLECTION_ID,
  "data-testid": dataTestId = "shopify-buy-collection",
}: ShopifyBuyCollectionProps) {
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

        ui.createComponent("collection", {
          id: collectionId,
          node,
          moneyFormat: SHOPIFY_MONEY_FORMAT,
          options: SHOPIFY_MERCH_COLLECTION_OPTIONS,
        });
      } catch (err) {
        mountedShopifyNodes.delete(nodeId);
        console.error("[ShopifyBuyCollection]", err);
      }
    }

    void mount();

    return () => {
      cancelled = true;
    };
  }, [collectionId, nodeId]);

  return (
    <div
      ref={containerRef}
      id={nodeId}
      className={className}
      data-testid={dataTestId}
    />
  );
}
