import {
  PurchaseDto,
  PurchaseItemDto,
  SavePurchaseItemDto,
} from "../../../common/contracts";
import { format, isValid, parseISO } from "date-fns";

/** Sum of container_count * container_cents over collected items. */
export function purchaseTotal(purchase: Pick<PurchaseDto, "items">): number {
  return purchase.items
    .filter((i) => i.collected)
    .map((i) => i.container_count * i.container_cents)
    .reduce((a, b) => a + b, 0);
}

export function collectedItems(
  purchase: Pick<PurchaseDto, "items">
): PurchaseItemDto[] {
  return purchase.items.filter((i) => i.collected);
}

export function plannedItems(
  purchase: Pick<PurchaseDto, "items">
): PurchaseItemDto[] {
  return purchase.items.filter((i) => !i.collected);
}

/** "YYYY-MM-DD" -> local Date (or null). */
export function parseBestBefore(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const d = parseISO(value);
  return isValid(d) ? d : null;
}

/** Date -> "YYYY-MM-DD" (or null). */
export function serializeBestBefore(
  value: Date | null | undefined
): string | null {
  if (!value || !isValid(value)) {
    return null;
  }
  return format(value, "yyyy-MM-dd");
}

export function formatBestBefore(value: string | null | undefined): string {
  const d = parseBestBefore(value);
  return d ? format(d, "dd.MM.yyyy") : "–";
}

export function purchaseLabel(
  purchase: Pick<PurchaseDto, "id" | "name" | "store">
): string {
  if (purchase.name) {
    return purchase.name;
  }
  if (purchase.store) {
    return purchase.store;
  }
  return `#${purchase.id}`;
}

/** PurchaseItemDto -> SavePurchaseItemDto (keeps all shopping-mode fields). */
export function purchaseItemToSave(item: PurchaseItemDto): SavePurchaseItemDto {
  return {
    name: item.name,
    container_size: item.container_size,
    container_count: item.container_count,
    container_cents: item.container_cents,
    best_before: item.best_before,
    barcode: item.barcode,
    collected: item.collected,
    product_id: item.product?.id ?? null,
  };
}
