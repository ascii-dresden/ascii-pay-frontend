import { TableCell, TableRow } from "@mui/material";
import { CoinAmountDto, TransactionDto } from "../../redux/api/contracts";
import { CoinAmountView } from "../CoinAmountView";

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

export function substractCoinAmount(
  left: CoinAmountDto,
  right: CoinAmountDto
): CoinAmountDto {
  return {
    Cent: (left.Cent ?? 0) - (right.Cent ?? 0),
    CoffeeStamp: (left.CoffeeStamp ?? 0) - (right.CoffeeStamp ?? 0),
    BottleStamp: (left.BottleStamp ?? 0) - (right.BottleStamp ?? 0),
  };
}

const TransactionItem = (props: { transaction: TransactionDto }) => {
  const format = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "long",
  });
  return (
    <>
      <TableRow>
        <TableCell>
          {format.format(new Date(props.transaction.timestamp))}
        </TableCell>
        <TableCell align="right">
          <CoinAmountView coins={getTransactionSum(props.transaction)} />
        </TableCell>
      </TableRow>
    </>
  );
};

export default TransactionItem;
