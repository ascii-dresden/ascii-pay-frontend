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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetAllTransactionsQuery } from "../../redux/api/accountApi";
import FullScreenLoader from "../FullScreenLoader";
import TransactionItem from "./transaction.component";
import { CreatePayment } from "./create-payment";

export const TransactionList = (props: { accountId: number }) => {
  const [openModal, setOpenModal] = useState(false);
  const {
    isLoading,
    isError,
    error,
    data: transactions,
  } = useGetAllTransactionsQuery(props.accountId);

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

  if (isLoading || transactions === undefined) {
    return <FullScreenLoader />;
  }

  let sortedTransactions = [...transactions];
  sortedTransactions.reverse();

  return (
    <>
      <TableContainer component={Paper}>
        <Toolbar>
          <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
            Transactions
          </Typography>
          <Tooltip title="Create transaction">
            <IconButton onClick={() => setOpenModal(true)}>
              <ShoppingCartOutlined />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Table sx={{ minWidth: 650 }} aria-label="Transactions table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTransactions?.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreatePayment
        accountId={props.accountId}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
};
