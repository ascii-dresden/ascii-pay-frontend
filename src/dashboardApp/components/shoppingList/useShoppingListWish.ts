import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetShoppingListItemQuery,
  useMarkShoppingListItemDoneMutation,
} from "../../redux/api/shoppingListApi";

/**
 * Shopping mode sub-pages are opened with `?wish=<shopping list entry id>`
 * when the user ticks an entry of the shared shopping list. The hook loads
 * the entry (for prefilling the quantity) and ticks it off once the article
 * has been added to the cart (best effort: failures are only logged).
 */
export const useShoppingListWish = () => {
  const [searchParams] = useSearchParams();
  const raw = searchParams.get("wish");
  const parsed = raw ? parseInt(raw, 10) : NaN;
  const wishId = Number.isInteger(parsed) && parsed > 0 ? parsed : null;

  const { data } = useGetShoppingListItemQuery(wishId ?? 0, {
    skip: wishId === null,
  });
  const [markDone] = useMarkShoppingListItemDoneMutation();

  const completeWish = React.useCallback(
    (purchaseId: number) => {
      if (wishId === null) {
        return;
      }
      markDone({ id: wishId, purchase_id: purchaseId })
        .unwrap()
        .catch((e) =>
          console.error("Could not tick off shopping list entry", e)
        );
    },
    [wishId, markDone]
  );

  return { wishId, wish: wishId !== null ? data ?? null : null, completeWish };
};
