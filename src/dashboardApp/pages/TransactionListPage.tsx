import {
  Avatar,
  Box,
  Breadcrumbs,
  Collapse,
  Container,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  useGetAccountQuery,
  useGetGlobalTransactionsQuery,
} from "../redux/api/accountApi";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Remove,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { stringAvatar } from "../../common/stringAvatar";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { TransactionDto } from "../../common/contracts";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { getTransactionSum } from "../../common/transactionUtils";
import { BASE_URL } from "../redux/api/customFetchBase";
import { GlobalTransactionChart } from "../components/transaction/GlobalTransactionChart";
import { GlobalTransactionSummary } from "../components/transaction/GlobalTransactionSummary";
import { DatePicker } from "@mui/x-date-pickers";
import { RoleChip } from "../components/account/RoleChip";

export const TransactionListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [startDate, setStartDate] = React.useState<Date | null>(
    new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const onRequestZoomHandler = React.useMemo(
    () => (s: Date, e: Date) => {
      setStartDate(s);
      setEndDate(e);
    },
    [setStartDate, setEndDate]
  );

  const {
    isLoading,
    isError,
    error,
    data: transactions,
  } = useGetGlobalTransactionsQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Could not load transactions!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const rangePickerDisabled = isLoading || transactions === undefined;
  const rangePicker = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        opacity: rangePickerDisabled ? 0.5 : 1,
      }}
    >
      <DatePicker
        label="Start date"
        value={startDate}
        onChange={(v) => setStartDate(v)}
        disabled={rangePickerDisabled}
      />
      <Remove sx={{ mx: 1, opacity: rangePickerDisabled ? 0.4 : 1 }} />
      <DatePicker
        label="End date"
        value={endDate}
        onChange={(v) => setEndDate(v)}
        disabled={rangePickerDisabled}
      />
    </Box>
  );

  const header = (
    <Paper elevation={0}>
      <Box sx={{ px: 1, py: 2, mb: 2 }}>
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
              Transactions
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate("/")}
              >
                ascii-pay
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                aria-current="page"
                onClick={() => navigate("/transactions")}
              >
                Transactions
              </Link>
            </Breadcrumbs>
          </div>

          {rangePicker}
        </Toolbar>
      </Box>
    </Paper>
  );

  if (isLoading || transactions === undefined) {
    return <PaperScreenLoader>{header}</PaperScreenLoader>;
  }

  let filteredTransactions = transactions;
  let previousTransactions: TransactionDto[] = [];
  if (startDate || endDate) {
    filteredTransactions = transactions.filter((transaction) => {
      let date = new Date(transaction.timestamp);

      if (startDate && startDate.getTime() > date.getTime()) {
        return false;
      }

      if (endDate && endDate.getTime() < date.getTime()) {
        return false;
      }

      return true;
    });
    previousTransactions = transactions.filter((transaction) => {
      let date = new Date(transaction.timestamp);

      if (startDate && startDate.getTime() > date.getTime()) {
        return true;
      }

      return false;
    });
  }

  let sortedTransactions = [...filteredTransactions];
  sortedTransactions.reverse();

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
    <Container maxWidth="lg">
      {header}

      <Box sx={{ display: "flex", mb: 4 }}>
        <GlobalTransactionSummary
          transactions={filteredTransactions}
          previousTransactions={previousTransactions}
        />
      </Box>

      <Paper sx={{ p: 2, mb: 4 }} elevation={4}>
        <GlobalTransactionChart
          transactions={filteredTransactions}
          previousTransactions={previousTransactions}
          startDate={startDate}
          endDate={endDate}
          onRequestZoom={onRequestZoomHandler}
        />
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
    </Container>
  );
};

const format = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
  timeStyle: "medium",
});

const TransactionListRow = (props: { transaction: TransactionDto }) => {
  const [open, setOpen] = React.useState(false);

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
              {props.transaction.account_id ? (
                <TransactionListRowAccount
                  accountId={props.transaction.account_id}
                />
              ) : null}
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
                    <TableRow
                      key={index}
                      sx={{ "& > *": { borderBottom: "unset !important" } }}
                    >
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

const TransactionListRowAccount = (props: { accountId: number }) => {
  const { isLoading, data: account } = useGetAccountQuery(props.accountId);

  if (isLoading) {
    return <span>Loading...</span>;
  }
  if (!account) {
    return <span>Error...</span>;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar
        alt={account.name}
        {...stringAvatar(account.name)}
        sx={{ mr: 2 }}
      />
      <Typography sx={{ mr: 2 }}>{account.name}</Typography>
      <RoleChip role={account.role} />
    </Box>
  );
};
