import { useEffect, useRef } from "react";
import {
  SHOPIFY_MERCH_COLLECTION_ID,
  SHOPIFY_MERCH_COLLECTION_NODE_ID,
  SHOPIFY_MERCH_COLLECTION_OPTIONS,
  SHOPIFY_MONEY_FORMAT,
} from "@/lib/shopify-buy-button";
import { mountShopifyBuyComponent } from "@/lib/shopify-buy-loader";

type ShopifyBuyCollectionProps = {
  className?: string;
  nodeId?: string;
  collectionId?: string;
  "data-testid"?: string;
};

/** Buy Button collection embed (Merch grid inside branded Library card). */
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

    void mountShopifyBuyComponent({
      nodeId,
      node,
      cancelled: () => cancelled,
      create: (ui) => {
        ui.createComponent("collection", {
          id: collectionId,
          node,
          moneyFormat: SHOPIFY_MONEY_FORMAT,
          options: SHOPIFY_MERCH_COLLECTION_OPTIONS,
        });
      },
    }).catch((err) => {
      console.error("[ShopifyBuyCollection]", err);
    });

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
