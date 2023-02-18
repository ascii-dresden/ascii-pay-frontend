import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useGetAllTransactionsQuery } from "../../redux/api/accountApi";
import FullScreenLoader from "../FullScreenLoader";
import TransactionItem from "./transaction.component";

export const TransactionList = (props: { id: number }) => {
  const {
    isLoading,
    isError,
    error,
    data: transactions,
  } = useGetAllTransactionsQuery(props.id);

  useEffect(() => {
    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
          Transactions
        </Typography>
        <Tooltip title="Create transaction">
          <IconButton>
            <ShoppingCartOutlined />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Table sx={{ minWidth: 650 }} aria-label="Transactions table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions?.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
