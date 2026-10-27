import React from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  SaveShoppingListItemDto,
  ShoppingListItemDto,
} from "../../../common/contracts";
import {
  useCreateShoppingListItemMutation,
  useDeleteShoppingListItemMutation,
  useMarkShoppingListItemDoneMutation,
  useReopenShoppingListItemMutation,
} from "../../redux/api/shoppingListApi";
import { undoToast } from "../undoToast";
import { shoppingListItemName } from "./shoppingListUtils";

export const shoppingListItemToSave = (
  item: ShoppingListItemDto
): SaveShoppingListItemDto => ({
  name: item.name,
  quantity: item.quantity,
  note: item.note,
  product_id: item.product?.id ?? null,
  sub_product_id: item.sub_product_id ?? null,
});

/**
 * Deletes an entry without confirmation; the toast re-creates it (as a new
 * entry with the same values). Resolves to true when the entry was deleted.
 */
export const useRemoveShoppingListItem = () => {
  const { t } = useTranslation();
  const [deleteItem] = useDeleteShoppingListItemMutation();
  const [createItem] = useCreateShoppingListItemMutation();

  return React.useCallback(
    async (item: ShoppingListItemDto): Promise<boolean> => {
      try {
        await deleteItem(item.id).unwrap();
      } catch (e) {
        toast.error(t("shoppingList.error"));
        console.error(e);
        return false;
      }
      undoToast(
        t("shoppingList.removed", { name: shoppingListItemName(item) }),
        t("shoppingList.undo"),
        () => {
          createItem(shoppingListItemToSave(item))
            .unwrap()
            .catch((e) => {
              toast.error(t("shoppingList.error"));
              console.error(e);
            });
        }
      );
      return true;
    },
    [deleteItem, createItem, t]
  );
};

/** Ticks an entry off (Purchaser/Admin); the toast reopens it. */
export const useMarkShoppingListItemDone = () => {
  const { t } = useTranslation();
  const [markDone] = useMarkShoppingListItemDoneMutation();
  const [reopen] = useReopenShoppingListItemMutation();

  return React.useCallback(
    async (
      item: ShoppingListItemDto,
      purchaseId: number | null = null
    ): Promise<boolean> => {
      try {
        await markDone({ id: item.id, purchase_id: purchaseId }).unwrap();
      } catch (e) {
        toast.error(t("shoppingList.error"));
        console.error(e);
        return false;
      }
      undoToast(
        t("shoppingList.done", { name: shoppingListItemName(item) }),
        t("shoppingList.undo"),
        () => {
          reopen(item.id)
            .unwrap()
            .catch((e) => {
              toast.error(t("shoppingList.error"));
              console.error(e);
            });
        }
      );
      return true;
    },
    [markDone, reopen, t]
  );
};

/** Puts a bought entry back on the list; the toast ticks it off again. */
export const useReopenShoppingListItem = () => {
  const { t } = useTranslation();
  const [markDone] = useMarkShoppingListItemDoneMutation();
  const [reopen] = useReopenShoppingListItemMutation();

  return React.useCallback(
    async (item: ShoppingListItemDto): Promise<boolean> => {
      try {
        await reopen(item.id).unwrap();
      } catch (e) {
        toast.error(t("shoppingList.error"));
        console.error(e);
        return false;
      }
      undoToast(
        t("shoppingList.reopened", { name: shoppingListItemName(item) }),
        t("shoppingList.undo"),
        () => {
          markDone({ id: item.id, purchase_id: item.purchase_id })
            .unwrap()
            .catch((e) => {
              toast.error(t("shoppingList.error"));
              console.error(e);
            });
        }
      );
      return true;
    },
    [markDone, reopen, t]
  );
};
