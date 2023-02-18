import { TableCell, TableRow } from "@mui/material";
import { FC } from "react";
import { TransactionDto } from "../../redux/api/contracts";

interface ITransactionItemProps {
  transaction: TransactionDto;
}

const TransactionItem: FC<ITransactionItemProps> = ({ transaction }) => {
  return (
    <>
      <TableRow>
        <TableCell>{transaction.timestamp}</TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
    </>
  );
};

export default TransactionItem;
