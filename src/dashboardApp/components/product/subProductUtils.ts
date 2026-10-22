import {
  ProductDto,
  PurchaseItemDto,
  SubProductDto,
} from "../../../common/contracts";

export const findSubProduct = (
  product: ProductDto | null | undefined,
  subProductId: number | null | undefined
): SubProductDto | null =>
  subProductId == null
    ? null
    : product?.sub_products?.find((sub) => sub.id === subProductId) ?? null;

/**
 * Sub products that can be picked: the active ones, plus `keepId` when it is
 * inactive (so an existing choice does not vanish from the select).
 */
export const selectableSubProducts = (
  product: ProductDto | null | undefined,
  keepId?: number | null
): SubProductDto[] =>
  (product?.sub_products ?? []).filter(
    (sub) => sub.active || (keepId != null && sub.id === keepId)
  );

export const hasSubProducts = (product: ProductDto | null | undefined) =>
  (product?.sub_products ?? []).some((sub) => sub.active);

/** "Haribo · Goldbären", or just the product name without a sub product. */
export const productDisplayName = (
  product: ProductDto,
  subProductId: number | null | undefined
): string => {
  const sub = findSubProduct(product, subProductId);
  return sub ? `${product.name} · ${sub.name}` : product.name;
};

/** Display name of a purchase row: product (with sub product) or free text. */
export const purchaseItemDisplayName = (
  item: Pick<PurchaseItemDto, "name" | "product" | "sub_product_id">
): string =>
  item.product
    ? productDisplayName(item.product, item.sub_product_id)
    : item.name;
