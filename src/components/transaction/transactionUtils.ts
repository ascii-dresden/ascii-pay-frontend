import { CoinAmountDto, TransactionDto } from "../../redux/api/contracts";

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

export function isCoinAmountNegative(coins: CoinAmountDto): boolean {
  if (coins.Cent && coins.Cent < 0) {
    return true;
  }
  if (coins.BottleStamp && coins.BottleStamp < 0) {
    return true;
  }
  return !!(coins.CoffeeStamp && coins.CoffeeStamp < 0);
}
