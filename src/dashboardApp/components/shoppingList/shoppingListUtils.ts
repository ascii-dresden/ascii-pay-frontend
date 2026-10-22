import {
  AccountDto,
  ProductDto,
  ShoppingListItemDto,
} from "../../../common/contracts";
import { hasSubProducts } from "../product/subProductUtils";
import { inventoryDateFormat } from "../inventory/inventoryFormat";
import { GetLastPurchasesBySubProduct } from "../purchase/usePurchaseHistory";
import { unitPriceCents } from "../purchase/purchaseUtils";

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

/**
 * Unit price of the last purchase of the entry's sub product (or of the
 * product, for entries without one); null when it was never bought.
 */
export const shoppingListLastUnitCents = (
  item: ShoppingListItemDto,
  getLastPurchasesBySubProduct: GetLastPurchasesBySubProduct
): number | null => {
  if (!item.product) {
    return null;
  }
  const last = getLastPurchasesBySubProduct(item.product.id).get(
    item.sub_product_id ?? null
  );
  return last
    ? unitPriceCents(last.container_cents, last.container_size)
    : null;
};

/** A row of the shopping list: a plain entry or a product heading with its sub product entries. */
export type ShoppingListRow =
  | { kind: "item"; item: ShoppingListItemDto }
  | { kind: "group"; product: ProductDto; items: ShoppingListItemDto[] };

/**
 * Groups the entries of products with sub products below one heading per
 * product (placed where its first entry was); all other entries stay as they
 * are. A product with sub products is only a category, the entries name the
 * sub products.
 */
export const groupShoppingList = (
  items: ShoppingListItemDto[]
): ShoppingListRow[] => {
  const rows: ShoppingListRow[] = [];
  const groups = new Map<number, ShoppingListItemDto[]>();
  for (const item of items) {
    const product = item.product;
    const grouped =
      product !== null &&
      (item.sub_product_id != null || hasSubProducts(product));
    if (!product || !grouped) {
      rows.push({ kind: "item", item });
      continue;
    }
    const group = groups.get(product.id);
    if (group) {
      group.push(item);
    } else {
      const entries = [item];
      groups.set(product.id, entries);
      rows.push({ kind: "group", product, items: entries });
    }
  }
  return rows;
};
