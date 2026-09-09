import React from "react";
import { useGetAllPurchasesQuery } from "../../redux/api/purchaseApi";

export type LastPurchaseInfo = {
  purchaseId: number;
  timestamp: string;
  container_cents: number;
  container_size: number;
};

/** How a purchase item is matched against the variant we are about to add. */
export type LastPurchaseQuery = {
  /** The scanned code, if any. */
  code?: string | null;
  /** Units per container of the scanned variant, if known. */
  size?: number | null;
};

type HistoryEntry = LastPurchaseInfo & { barcode: string | null };

/** The lookup returned by `usePurchaseHistory`, for passing down to rows. */
export type GetLastPurchase = (
  productId: number | null | undefined,
  query?: LastPurchaseQuery
) => LastPurchaseInfo | null;

/**
 * Derives, per product id, the finalized purchase items of that product
 * (newest first). Used to prefill price and container size when an article is
 * scanned.
 *
 * With several barcodes per product the newest item is not necessarily the
 * right one: buying a crate should suggest the price of the last crate, not of
 * the last single bottle. `getLastPurchase` therefore prefers, in order, the
 * item bought with the same code, then one with the same container size, then
 * the newest item of the product.
 */
export const usePurchaseHistory = () => {
  const { data: purchases, isLoading } = useGetAllPurchasesQuery({
    state: "finalized",
  });

  const byProduct = React.useMemo(() => {
    const map = new Map<number, HistoryEntry[]>();
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
        const entries = map.get(item.product.id) ?? [];
        entries.push({
          purchaseId: purchase.id,
          timestamp: purchase.timestamp,
          container_cents: item.container_cents,
          container_size: item.container_size,
          barcode: item.barcode,
        });
        map.set(item.product.id, entries);
      }
    }
    return map;
  }, [purchases]);

  const getLastPurchase = React.useCallback(
    (
      productId: number | null | undefined,
      query?: LastPurchaseQuery
    ): LastPurchaseInfo | null => {
      if (productId === null || productId === undefined) {
        return null;
      }
      const entries = byProduct.get(productId);
      if (!entries || entries.length === 0) {
        return null;
      }
      const code = (query?.code ?? "").trim();
      const size = query?.size ?? null;
      return (
        (code.length > 0
          ? entries.find((entry) => (entry.barcode ?? "").trim() === code)
          : undefined) ??
        (size !== null
          ? entries.find((entry) => entry.container_size === size)
          : undefined) ??
        entries[0]
      );
    },
    [byProduct]
  );

  return { isLoading, getLastPurchase };
};
