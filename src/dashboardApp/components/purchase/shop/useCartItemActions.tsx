import React from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PurchaseItemDto } from "../../../../common/contracts";
import {
  useAddPurchaseItemMutation,
  useDeletePurchaseItemMutation,
  useUpdatePurchaseItemMutation,
} from "../../../redux/api/purchaseApi";
import { purchaseItemToSave } from "../purchaseUtils";
import { undoToast } from "../../undoToast";
import { purchaseItemDisplayName } from "../../product/subProductUtils";

/**
 * Increments the container count of a collected row by one and offers an
 * undo toast. Resolves to true when the change was saved.
 */
export const useIncrementCartItem = (purchaseId: number) => {
  const { t } = useTranslation();
  const [updateItem] = useUpdatePurchaseItemMutation();

  return React.useCallback(
    async (item: PurchaseItemDto): Promise<boolean> => {
      const previous = item.container_count;
      const next = previous + 1;
      const put = (count: number) =>
        updateItem({
          id: purchaseId,
          itemId: item.id,
          item: { ...purchaseItemToSave(item), container_count: count },
        }).unwrap();
      try {
        await put(next);
      } catch (e) {
        toast.error(t("purchase.shop.error"));
        console.error(e);
        return false;
      }
      undoToast(
        t("purchase.shop.increased", {
          name: purchaseItemDisplayName(item),
          count: next,
        }),
        t("purchase.shop.undo"),
        () => {
          put(previous).catch((e) => {
            toast.error(t("purchase.shop.error"));
            console.error(e);
          });
        }
      );
      return true;
    },
    [purchaseId, updateItem, t]
  );
};

/**
 * Deletes a row (cart or shopping list) without a confirmation dialog; the
 * toast offers to restore it (re-added as a new row with the same values,
 * including `collected`). Resolves to true when the row was deleted.
 */
export const useRemoveCartItem = (purchaseId: number) => {
  const { t } = useTranslation();
  const [deleteItem] = useDeletePurchaseItemMutation();
  const [addItem] = useAddPurchaseItemMutation();

  return React.useCallback(
    async (item: PurchaseItemDto): Promise<boolean> => {
      try {
        await deleteItem({ id: purchaseId, itemId: item.id }).unwrap();
      } catch (e) {
        toast.error(t("purchase.shop.error"));
        console.error(e);
        return false;
      }
      const message = item.collected
        ? t("purchase.shop.removed")
        : t("purchase.shop.removedFromList");
      undoToast(message, t("purchase.shop.undo"), () => {
        addItem({ id: purchaseId, item: purchaseItemToSave(item) })
          .unwrap()
          .catch((e) => {
            toast.error(t("purchase.shop.error"));
            console.error(e);
          });
      });
      return true;
    },
    [purchaseId, deleteItem, addItem, t]
  );
};
