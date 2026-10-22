import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingListItemDto } from "../../../common/contracts";
import {
  useGetShoppingListItemQuery,
  useGetShoppingListQuery,
  useMarkShoppingListItemDoneMutation,
  useReopenShoppingListItemMutation,
} from "../../redux/api/shoppingListApi";
import { undoToast } from "../undoToast";
import { shoppingListItemName } from "./shoppingListUtils";

/**
 * The article that just landed in the cart. Every open entry of the shared
 * shopping list that means the same article is ticked off.
 */
export type CheckedOffArticle = {
  /** Product of the cart row, when it has one. */
  productId?: number | null;
  /**
   * Sub product of the cart row. An entry that asks for a specific sub
   * product is only ticked off by that one; entries without one by any.
   */
  subProductId?: number | null;
  /** Display name of the cart row (used for free-text entries). */
  name?: string | null;
  /** Entry the page was opened from (`?wish=`); ticked off regardless of name. */
  wishId?: number | null;
};

const normalize = (value: string): string => value.trim().toLowerCase();

/**
 * Ticks entries of the shared shopping list off when the article is put into
 * the cart — scanned, searched or collected from the planned rows. Someone
 * asked for it, it is now in the basket, so it has no business staying on the
 * list for the next purchaser.
 *
 * An entry matches when it is linked to the same product or when its text is
 * the name of the cart row; the undo toast puts everything back. Failures are
 * only logged: the article is in the cart either way, and the list can still
 * be ticked off by hand.
 */
export const useShoppingListCheckoff = () => {
  const { t } = useTranslation();
  // Shopping mode has this list loaded already, so the cache answers without
  // a request; if it has not arrived yet nothing is ticked off (the entry
  // stays on the list, which is the harmless direction).
  const { data: openItems } = useGetShoppingListQuery({ state: "open" });
  const [markDone] = useMarkShoppingListItemDoneMutation();
  const [reopen] = useReopenShoppingListItemMutation();

  return React.useCallback(
    async (purchaseId: number, article: CheckedOffArticle): Promise<void> => {
      const name = normalize(article.name ?? "");
      const matches = (openItems ?? []).filter(
        (item) =>
          (article.wishId != null && item.id === article.wishId) ||
          (article.productId != null &&
            item.product?.id === article.productId &&
            (item.sub_product_id == null ||
              item.sub_product_id === (article.subProductId ?? null))) ||
          (name.length > 0 &&
            normalize(shoppingListItemName(item)) === name &&
            (item.sub_product_id == null ||
              item.sub_product_id === (article.subProductId ?? null)))
      );
      if (matches.length === 0) {
        return;
      }

      const done: ShoppingListItemDto[] = [];
      for (const item of matches) {
        try {
          await markDone({ id: item.id, purchase_id: purchaseId }).unwrap();
          done.push(item);
        } catch (e) {
          console.error("Could not tick off shopping list entry", e);
        }
      }
      if (done.length === 0) {
        return;
      }

      undoToast(
        t("shoppingList.checkedOff", {
          names: done.map(shoppingListItemName).join(", "),
        }),
        t("shoppingList.undo"),
        () => {
          done.forEach((item) =>
            reopen(item.id)
              .unwrap()
              .catch((e) =>
                console.error("Could not reopen shopping list entry", e)
              )
          );
        }
      );
    },
    [openItems, markDone, reopen, t]
  );
};

/**
 * Shopping mode sub-pages are opened with `?wish=<shopping list entry id>`
 * when the user ticks an entry of the shared shopping list. The hook loads
 * the entry (for prefilling the quantity) and `completeWish` ticks it off —
 * together with every other entry that means the same article.
 */
export const useShoppingListWish = () => {
  const [searchParams] = useSearchParams();
  const raw = searchParams.get("wish");
  const parsed = raw ? parseInt(raw, 10) : NaN;
  const wishId = Number.isInteger(parsed) && parsed > 0 ? parsed : null;

  const { data } = useGetShoppingListItemQuery(wishId ?? 0, {
    skip: wishId === null,
  });
  const checkOff = useShoppingListCheckoff();

  const completeWish = React.useCallback(
    (purchaseId: number, article: CheckedOffArticle) => {
      checkOff(purchaseId, { ...article, wishId });
    },
    [wishId, checkOff]
  );

  return { wishId, wish: wishId !== null ? data ?? null : null, completeWish };
};
