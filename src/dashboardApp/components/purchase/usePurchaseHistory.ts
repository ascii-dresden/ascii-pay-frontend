import React from "react";
import { useGetAllPurchasesQuery } from "../../redux/api/purchaseApi";

export type LastPurchaseInfo = {
  purchaseId: number;
  timestamp: string;
  container_cents: number;
  container_size: number;
};

/**
 * Derives, per product id, the newest finalized purchase item from the
 * cached purchase list. Used to prefill price and container size when an
 * article is scanned.
 */
export const usePurchaseHistory = () => {
  const { data: purchases, isLoading } = useGetAllPurchasesQuery({
    state: "finalized",
  });

  const byProduct = React.useMemo(() => {
    const map = new Map<number, LastPurchaseInfo>();
    if (!purchases) {
      return map;
    }
    const sorted = [...purchases]
      .filter((p) => p.state === "finalized")
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    for (const purchase of sorted) {
      for (const item of purchase.items) {
        if (!item.product || !item.collected) {
          continue;
        }
        if (!map.has(item.product.id)) {
          map.set(item.product.id, {
            purchaseId: purchase.id,
            timestamp: purchase.timestamp,
            container_cents: item.container_cents,
            container_size: item.container_size,
          });
        }
      }
    }
    return map;
  }, [purchases]);

  const getLastPurchase = React.useCallback(
    (productId: number | null | undefined): LastPurchaseInfo | null => {
      if (productId === null || productId === undefined) {
        return null;
      }
      return byProduct.get(productId) ?? null;
    },
    [byProduct]
  );

  return { isLoading, getLastPurchase };
};
