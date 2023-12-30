import {
  AccountDto,
  CoinAmountDto,
  ProductStatusPriceDto,
  TransactionDto,
} from "./contracts";
import { PaymentTransactionItem } from "../terminalApp/redux/features/paymentSlice";
import { getActivePrice } from "./statusPriceUtils";

export type PseudoProductDto = {
  id?: number;
  name: string;
  price: CoinAmountDto;
  bonus: CoinAmountDto;
  status_prices: ProductStatusPriceDto[];
};

export function getTransactionSum(transaction: TransactionDto): CoinAmountDto {
  let centAmount = 0;
  let coffeeStampAmount = 0;
  let bottleStampAmount = 0;

  for (const item of transaction.items) {
    if (item.effective_price.Cent) {
      centAmount += item.effective_price.Cent;
    }
    if (item.effective_price.CoffeeStamp) {
      coffeeStampAmount += item.effective_price.CoffeeStamp;
    }
    if (item.effective_price.BottleStamp) {
      bottleStampAmount += item.effective_price.BottleStamp;
    }
  }

  return {
    Cent: centAmount,
    CoffeeStamp: coffeeStampAmount,
    BottleStamp: bottleStampAmount,
  };
}

export function addCoinAmount(
  left: CoinAmountDto,
  right: CoinAmountDto
): CoinAmountDto {
  return {
    Cent: (left.Cent ?? 0) + (right.Cent ?? 0),
    CoffeeStamp: (left.CoffeeStamp ?? 0) + (right.CoffeeStamp ?? 0),
    BottleStamp: (left.BottleStamp ?? 0) + (right.BottleStamp ?? 0),
  };
}

export function subCoinAmount(
  left: CoinAmountDto,
  right: CoinAmountDto
): CoinAmountDto {
  return {
    Cent: (left.Cent ?? 0) - (right.Cent ?? 0),
    CoffeeStamp: (left.CoffeeStamp ?? 0) - (right.CoffeeStamp ?? 0),
    BottleStamp: (left.BottleStamp ?? 0) - (right.BottleStamp ?? 0),
  };
}

export function equalCoinAmount(
  left: CoinAmountDto,
  right: CoinAmountDto
): boolean {
  return (
    (left.Cent ?? 0) === (right.Cent ?? 0) &&
    (left.CoffeeStamp ?? 0) === (right.CoffeeStamp ?? 0) &&
    (left.BottleStamp ?? 0) === (right.BottleStamp ?? 0)
  );
}

export function isCoinAmountEmpty(coins: CoinAmountDto): boolean {
  if (coins.Cent && coins.Cent !== 0) {
    return false;
  }
  if (coins.BottleStamp && coins.BottleStamp !== 0) {
    return false;
  }
  return !(coins.CoffeeStamp && coins.CoffeeStamp !== 0);
}

export function getPossiblePrices(
  product: PseudoProductDto,
  account: AccountDto | null | undefined
): CoinAmountDto[] {
  let prices: CoinAmountDto[] = [];

  let { price, bonus } = getActivePrice(product, account);

  if (price.Cent && price.Cent !== 0) {
    prices.push({
      Cent: price.Cent - (bonus.Cent ?? 0),
      BottleStamp: bonus.BottleStamp ? -bonus.BottleStamp : undefined,
      CoffeeStamp: bonus.CoffeeStamp ? -bonus.CoffeeStamp : undefined,
    });
  }
  if (price.BottleStamp && price.BottleStamp !== 0) {
    prices.push({
      BottleStamp: price.BottleStamp,
      CoffeeStamp: bonus.CoffeeStamp ? -bonus.CoffeeStamp : undefined,
    });
  }
  if (price.CoffeeStamp && price.CoffeeStamp !== 0) {
    prices.push({
      BottleStamp: bonus.BottleStamp ? -bonus.BottleStamp : undefined,
      CoffeeStamp: price.CoffeeStamp,
    });
  }

  if (prices.length === 0) {
    prices.push({
      Cent: bonus.Cent ? -bonus.Cent : undefined,
      BottleStamp: bonus.BottleStamp ? -bonus.BottleStamp : undefined,
      CoffeeStamp: bonus.CoffeeStamp ? -bonus.CoffeeStamp : undefined,
    });
  }

  return prices;
}

export function selectNextCoinAmount(
  product: PseudoProductDto,
  account: AccountDto | null | undefined,
  current: CoinAmountDto | number
): CoinAmountDto {
  let prices = getPossiblePrices(product, account);

  if (typeof current === "number") {
    let next = (current + 1) % prices.length;
    return prices[next];
  } else {
    for (let i = 0; i < prices.length; i++) {
      if (equalCoinAmount(current, prices[i])) {
        let next = (i + 1) % prices.length;
        return prices[next];
      }
    }
  }

  return prices[0];
}

export function getPaymentItemSum(
  items: PaymentTransactionItem[],
  account: AccountDto | null | undefined
): CoinAmountDto {
  let total: CoinAmountDto = {};
  for (const item of items) {
    let effective_price = getEffectivePrice(item, account);
    total = addCoinAmount(total, effective_price);
  }
  return total;
}

export function getEffectivePrice(
  item: PaymentTransactionItem,
  account: AccountDto | null | undefined
): CoinAmountDto {
  return selectNextCoinAmount(item.product, account, {});
}

class TransactionHelper {
  total: CoinAmountDto;
  account: AccountDto | null | undefined;

  constructor(account: AccountDto | null | undefined, total?: CoinAmountDto) {
    this.total = total ?? {};
    this.account = account;
  }

  static fromItems(
    account: AccountDto | null | undefined,
    items: PaymentTransactionItem[]
  ) {
    let helper = new TransactionHelper(account);
    for (let item of items) {
      helper.addItem(item);
    }
    return helper;
  }

  addItem(item: PaymentTransactionItem) {
    let effective_price = getEffectivePrice(item, this.account);
    this.total = addCoinAmount(this.total, effective_price);
  }

  removeItem(item: PaymentTransactionItem) {
    let effective_price = getEffectivePrice(item, this.account);
    this.total = subCoinAmount(this.total, effective_price);
  }

  clone(): TransactionHelper {
    return new TransactionHelper(this.account, this.total);
  }

  checkIfItemCouldBePaidWithStamps(
    balance: CoinAmountDto,
    item: PaymentTransactionItem
  ): boolean {
    let effective_price = getEffectivePrice(item, this.account);
    if (
      item.product.price.CoffeeStamp &&
      item.product.price.CoffeeStamp > 0 &&
      item.product.price.CoffeeStamp !== effective_price.CoffeeStamp
    ) {
      return (
        (balance.CoffeeStamp &&
          balance.CoffeeStamp >= item.product.price.CoffeeStamp) === true
      );
    }

    if (
      item.product.price.BottleStamp &&
      item.product.price.BottleStamp > 0 &&
      item.product.price.BottleStamp !== effective_price.BottleStamp
    ) {
      return (
        (balance.BottleStamp &&
          balance.BottleStamp >= item.product.price.BottleStamp) === true
      );
    }

    return false;
  }

  findItemsThatCouldBePaidWithStamps(
    balance: CoinAmountDto,
    items: PaymentTransactionItem[]
  ): PaymentTransactionItem[] {
    let result: PaymentTransactionItem[] = [];

    for (let item of items) {
      let helper = this.clone();
      helper.removeItem(item);

      if (helper.checkIfItemCouldBePaidWithStamps(balance, item)) {
        result.push(item);
      }
    }

    return result;
  }
}

export function calculateStampPaymentTransactionItems(
  account: AccountDto | null | undefined,
  balance: CoinAmountDto,
  items: PaymentTransactionItem[]
): PaymentTransactionItem[] | null {
  let helper = TransactionHelper.fromItems(account, items);

  let removableItems = helper.findItemsThatCouldBePaidWithStamps(
    balance,
    items
  );

  let maxPrice: number = 0;
  let maxIndex: number = -1;

  for (let i = 0; i < removableItems.length; i++) {
    let item = removableItems[i];
    let effective_price = getEffectivePrice(item, account);
    if (effective_price.Cent && (effective_price.Cent ?? 0 > maxPrice)) {
      maxPrice = effective_price.Cent;
      maxIndex = i;
    }
  }

  if (maxIndex < 0) {
    return null;
  }

  let newItems = items.slice();
  let removeItem = removableItems[maxIndex];

  let removeIndex = items.indexOf(removeItem);

  let newPrice = selectNextCoinAmount(
    removeItem.product,
    account,
    removeItem.currentPriceIndex ?? 0
  );

  newItems.splice(removeIndex, 1, {
    ...removeItem,
    // effective_price: newPrice, TODO
  });

  let newBalance = subCoinAmount(balance, newPrice);
  let recursive = calculateStampPaymentTransactionItems(
    account,
    newBalance,
    newItems
  );
  return recursive ?? newItems;
}

export function checkIfAccountBalanceIsSufficient(
  account: AccountDto,
  items: PaymentTransactionItem[]
): boolean {
  let sum = getPaymentItemSum(items, account);
  let balance = subCoinAmount(account.balance, sum);

  if (balance.Cent && balance.Cent < 0) {
    if (balance.Cent < (account.balance.Cent ?? 0)) {
      return false;
    }
  }
  if (balance.CoffeeStamp && balance.CoffeeStamp < 0) {
    if (balance.CoffeeStamp < (account.balance.CoffeeStamp ?? 0)) {
      return false;
    }
  }
  if (balance.BottleStamp && balance.BottleStamp < 0) {
    if (balance.BottleStamp < (account.balance.BottleStamp ?? 0)) {
      return false;
    }
  }

  return true;
}
