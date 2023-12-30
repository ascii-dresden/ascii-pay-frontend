import {
  AccountDto,
  ItemWithPriceDto,
  PriceBonusDto,
  ProductDto,
} from "./contracts";

export function getActivePrice(
  item: ItemWithPriceDto,
  account?: AccountDto | null | undefined
): PriceBonusDto {
  const status = account?.status ?? null;
  if (status === null) {
    return item;
  }

  const status_price = item.status_prices.filter(
    (sp) => sp.status.priority <= status.priority
  );

  if (status_price.length === 0) {
    return item;
  }

  status_price.sort((a, b) => b.status.priority - a.status.priority);

  return status_price[0];
}

export function getOriginalPriceIfStatusApplies(
  item: ItemWithPriceDto,
  account?: AccountDto | null | undefined
): PriceBonusDto | null {
  const status = account?.status ?? null;
  if (status === null) {
    return null;
  }

  const status_price = item.status_prices.filter(
    (sp) => sp.status.priority <= status.priority
  );

  if (status_price.length === 0) {
    return null;
  }

  return item;
}

export function groupBy<T>(array: T[], selector: (x: T) => string | null) {
  let map = new Map<string | null, T[]>();
  for (let x of array) {
    let key = selector(x);
    let list = map.get(key);
    if (list) {
      list.push(x);
    } else {
      map.set(key, [x]);
    }
  }
  return map;
}

export function parseQuickAccessPosition(product: ProductDto): {
  row: number;
  col: number;
} {
  let s = product.name.split(":");
  if (s.length !== 3 || s[0] !== "grid") {
    return { row: 0, col: 0 };
  }

  let row = parseInt(s[1]);
  if (isNaN(row)) {
    row = 0;
  }
  let col = parseInt(s[2]);
  if (isNaN(col)) {
    col = 0;
  }

  return { row, col };
}
