import {
  Avatar,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useGetAllTransactionsQuery } from "../../redux/api/accountApi";
import { CoinAmountView } from "./CoinAmountView";
import { AccountDto, TransactionDto } from "../../redux/api/contracts";
import { BASE_URL } from "../../redux/api/customFetchBase";
import { stringAvatar } from "../stringAvatar";
import { TransactionChart } from "./TransactionChart";
import { getTransactionSum } from "./transactionUtils";

export const TransactionListView = (props: { account: AccountDto }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const {
    isLoading,
    isError,
    error,
    data: transactions,
  } = useGetAllTransactionsQuery(props.account.id);

  useEffect(() => {
    if (isError) {
      toast.error("Could not load transactions!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || transactions === undefined) {
    return (
      <>
        <Paper sx={{ p: 2, mb: 4 }} elevation={4}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <div style={{ height: "365px" }}></div>
            <CircularProgress />
          </Box>
        </Paper>
        <Paper elevation={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ height: "16rem" }}
          >
            <CircularProgress />
          </Box>
        </Paper>
      </>
    );
  }

  let sortedTransactions = [...transactions];
  sortedTransactions.reverse();

  let totalUp = {
    Cent: 0,
    CoffeeStamp: 0,
    BottleStamp: 0,
  };
  let totalDown = {
    Cent: 0,
    CoffeeStamp: 0,
    BottleStamp: 0,
  };
  for (let transaction of sortedTransactions) {
    for (let item of transaction.items) {
      if (item.effective_price.Cent) {
        if (item.effective_price.Cent > 0) {
          totalDown.Cent += item.effective_price.Cent;
        } else if (item.effective_price.Cent < 0) {
          totalUp.Cent -= item.effective_price.Cent;
        }
      }
      if (item.effective_price.CoffeeStamp) {
        if (item.effective_price.CoffeeStamp > 0) {
          totalDown.CoffeeStamp += item.effective_price.CoffeeStamp;
        } else if (item.effective_price.CoffeeStamp < 0) {
          totalUp.CoffeeStamp -= item.effective_price.CoffeeStamp;
        }
      }
      if (item.effective_price.BottleStamp) {
        if (item.effective_price.BottleStamp > 0) {
          totalDown.BottleStamp += item.effective_price.BottleStamp;
        } else if (item.effective_price.BottleStamp < 0) {
          totalUp.BottleStamp -= item.effective_price.BottleStamp;
        }
      }
    }
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - sortedTransactions.length)
      : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedTransactions =
    rowsPerPage > 0
      ? sortedTransactions.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : sortedTransactions;

  return (
    <>
      <Paper sx={{ p: 2, mb: 4 }} elevation={4}>
        <TransactionChart account={props.account} transactions={transactions} />
      </Paper>
      <TableContainer component={Paper} elevation={4}>
        <Table aria-label="Transactions table">
          <TableHead>
            <TableRow>
              <TableCell width={72}></TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedTransactions?.map((transaction) => (
              <TransactionListRow
                key={transaction.id}
                transaction={transaction}
              />
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 67 * emptyRows }}>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={sortedTransactions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", mt: 4 }}>
        <Paper sx={{ mr: 4, flex: "1 1 100%" }} elevation={4}>
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="h6" component="div">
              Total down
            </Typography>
            <CoinAmountView coins={totalDown} isTransaction={true} />
          </Box>
        </Paper>
        <Paper sx={{ flex: "1 1 100%" }} elevation={4}>
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="h6" component="div">
              Total up
            </Typography>
            <CoinAmountView coins={totalUp} />
          </Box>
        </Paper>
      </Box>
    </>
  );
};

const TransactionListRow = (props: { transaction: TransactionDto }) => {
  const [open, setOpen] = React.useState(false);

  const format = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "medium",
  });
  return (
    <>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset !important" } }}
        style={{ height: 67 }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          {format.format(new Date(props.transaction.timestamp))}
        </TableCell>
        <TableCell align="right">
          <CoinAmountView
            coins={getTransactionSum(props.transaction)}
            isTransaction={true}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell width={72}></TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.transaction.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.product ? (
                          <Avatar
                            alt={item.product.name}
                            src={`${BASE_URL}/product/${item.product.id}/image`}
                            variant="rounded"
                            {...stringAvatar(item.product.name)}
                          />
                        ) : null}
                      </TableCell>
                      <TableCell>{item.product?.name ?? "-"}</TableCell>
                      <TableCell>
                        <CoinAmountView
                          coins={item.effective_price}
                          isTransaction={true}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
