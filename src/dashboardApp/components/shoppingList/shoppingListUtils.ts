import { AccountDto, ShoppingListItemDto } from "../../../common/contracts";
import { inventoryDateFormat } from "../inventory/inventoryFormat";

/** Purchasers and admins tick entries off and reopen them. */
export const canManageShoppingList = (user: AccountDto | null): boolean =>
  user?.role === "Admin" || user?.role === "Purchaser";

/** Everybody may edit and delete their own entries; purchasers/admins all. */
export const canEditShoppingListItem = (
  user: AccountDto | null,
  item: ShoppingListItemDto
): boolean =>
  canManageShoppingList(user) ||
  (user !== null &&
    item.created_by_account_id !== null &&
    item.created_by_account_id === user.id);

export const shoppingListItemName = (item: ShoppingListItemDto): string =>
  item.name.trim() || item.product?.name || "";

/**
 * Secondary line: "2 × · note · requested by NAME · 7. Sept. 2026".
 * The date is omitted in shopping mode where space is tight.
 */
export const shoppingListSecondary = (
  t: (key: string, options?: Record<string, unknown>) => string,
  item: ShoppingListItemDto,
  options: { date?: boolean; doneDate?: boolean } = {}
): string => {
  const parts: (string | null)[] = [
    item.quantity > 1
      ? t("shoppingList.quantity", { count: item.quantity })
      : null,
    item.note.trim() || null,
    item.created_by_name
      ? t("shoppingList.requestedBy", { name: item.created_by_name })
      : null,
    options.date ? inventoryDateFormat.format(new Date(item.created_at)) : null,
    options.doneDate && item.done_at
      ? t("shoppingList.boughtOn", {
          date: inventoryDateFormat.format(new Date(item.done_at)),
        })
      : null,
  ];
  return parts.filter(Boolean).join(" · ");
};
