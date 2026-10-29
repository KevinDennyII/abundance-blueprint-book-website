import { useEffect, useRef } from "react";
import {
  SHOPIFY_MONEY_FORMAT,
  shopifyProductButtonOptions,
} from "@/lib/shopify-buy-button";
import { mountShopifyBuyComponent } from "@/lib/shopify-buy-loader";

type ShopifyBuyProductProps = {
  productId: string;
  variantId: string;
  nodeId: string;
  buttonText: string;
  tone?: "solid" | "outline";
  className?: string;
};

/** Compact Buy Button for one product variant (Library guide CTAs). */
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

    void mountShopifyBuyComponent({
      nodeId,
      node,
      cancelled: () => cancelled,
      create: (ui) => {
        ui.createComponent("product", {
          id: productId,
          variantId,
          node,
          moneyFormat: SHOPIFY_MONEY_FORMAT,
          options: shopifyProductButtonOptions(buttonText, tone),
        });
      },
    }).catch((err) => {
      console.error("[ShopifyBuyProduct]", err);
    });

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
