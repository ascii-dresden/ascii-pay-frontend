import { AccountDto, CoinAmountDto, TransactionDto } from "./contracts";
import { PaymentTransactionItem } from "../terminalApp/redux/features/paymentSlice";

export type PseudoProductDto = {
  id?: number;
  name: string;
  price: CoinAmountDto;
  bonus: CoinAmountDto;
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

export function getPossiblePrices(product: PseudoProductDto): CoinAmountDto[] {
  let prices: CoinAmountDto[] = [];

  if (product.price.Cent && product.price.Cent !== 0) {
    prices.push({
      Cent: product.price.Cent - (product.bonus.Cent ?? 0),
      BottleStamp: product.bonus.BottleStamp
        ? -product.bonus.BottleStamp
        : undefined,
      CoffeeStamp: product.bonus.CoffeeStamp
        ? -product.bonus.CoffeeStamp
        : undefined,
    });
  }
  if (product.price.BottleStamp && product.price.BottleStamp !== 0) {
    prices.push({
      BottleStamp: product.price.BottleStamp,
      CoffeeStamp: product.bonus.CoffeeStamp
        ? -product.bonus.CoffeeStamp
        : undefined,
    });
  }
  if (product.price.CoffeeStamp && product.price.CoffeeStamp !== 0) {
    prices.push({
      BottleStamp: product.bonus.BottleStamp
        ? -product.bonus.BottleStamp
        : undefined,
      CoffeeStamp: product.price.CoffeeStamp,
    });
  }

  if (prices.length === 0) {
    prices.push({
      Cent: product.bonus.Cent ? -product.bonus.Cent : undefined,
      BottleStamp: product.bonus.BottleStamp
        ? -product.bonus.BottleStamp
        : undefined,
      CoffeeStamp: product.bonus.CoffeeStamp
        ? -product.bonus.CoffeeStamp
        : undefined,
    });
  }

  return prices;
}

export function selectNextCoinAmount(
  product: PseudoProductDto,
  current: CoinAmountDto
): CoinAmountDto {
  let prices = getPossiblePrices(product);

  for (let i = 0; i < prices.length; i++) {
    if (equalCoinAmount(current, prices[i])) {
      let next = (i + 1) % prices.length;
      return prices[next];
    }
  }

  return prices[0];
}

export function getPaymentItemSum(
  items: PaymentTransactionItem[]
): CoinAmountDto {
  let total: CoinAmountDto = {};
  for (const item of items) {
    total = addCoinAmount(total, item.effective_price);
  }
  return total;
}

class TransactionHelper {
  total: CoinAmountDto;

  constructor(total?: CoinAmountDto) {
    this.total = total ?? {};
  }

  static fromItems(items: PaymentTransactionItem[]) {
    let helper = new TransactionHelper();
    for (let item of items) {
      helper.addItem(item);
    }
    return helper;
  }

  addItem(item: PaymentTransactionItem) {
    this.total = addCoinAmount(this.total, item.effective_price);
  }

  removeItem(item: PaymentTransactionItem) {
    this.total = subCoinAmount(this.total, item.effective_price);
  }

  clone(): TransactionHelper {
    return new TransactionHelper(this.total);
  }

  checkIfItemCouldBePaidWithStamps(
    balance: CoinAmountDto,
    item: PaymentTransactionItem
  ): boolean {
    if (
      item.product.price.CoffeeStamp &&
      item.product.price.CoffeeStamp > 0 &&
      item.product.price.CoffeeStamp !== item.effective_price.CoffeeStamp
    ) {
      return (
        (balance.CoffeeStamp &&
          balance.CoffeeStamp >= item.product.price.CoffeeStamp) === true
      );
    }

    if (
      item.product.price.BottleStamp &&
      item.product.price.BottleStamp > 0 &&
      item.product.price.BottleStamp !== item.effective_price.BottleStamp
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
  balance: CoinAmountDto,
  items: PaymentTransactionItem[]
): PaymentTransactionItem[] | null {
  let helper = TransactionHelper.fromItems(items);

  let removableItems = helper.findItemsThatCouldBePaidWithStamps(
    balance,
    items
  );

  let maxPrice: number = 0;
  let maxIndex: number = -1;

  for (let i = 0; i < removableItems.length; i++) {
    let item = removableItems[i];
    if (
      item.effective_price.Cent &&
      (item.effective_price.Cent ?? 0 > maxPrice)
    ) {
      maxPrice = item.effective_price.Cent;
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
    removeItem.effective_price
  );

  newItems.splice(removeIndex, 1, {
    ...removeItem,
    effective_price: newPrice,
  });

  let newBalance = subCoinAmount(balance, newPrice);
  let recursive = calculateStampPaymentTransactionItems(newBalance, newItems);
  return recursive ?? newItems;
}

export function checkIfAccountBalanceIsSufficient(
  account: AccountDto,
  items: PaymentTransactionItem[]
): boolean {
  let sum = getPaymentItemSum(items);
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
