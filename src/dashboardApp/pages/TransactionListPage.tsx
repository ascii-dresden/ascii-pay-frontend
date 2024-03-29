import {
  Avatar,
  Box,
  Collapse,
  Container,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  accountApi,
  useGetGlobalTransactionsQuery,
} from "../redux/api/accountApi";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Remove,
} from "@mui/icons-material";
import { stringAvatar } from "../../common/stringAvatar";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { TransactionDto } from "../../common/contracts";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { getTransactionSum } from "../../common/transactionUtils";
import {
  dateToGrouping,
  GlobalTransactionChart,
} from "../components/transaction/GlobalTransactionChart";
import { GlobalTransactionSummary } from "../components/transaction/GlobalTransactionSummary";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB";
import { TransactionListRowAccount } from "../components/transaction/TransactionListRowAccount";
import { TransactionListRowAuthorization } from "../components/transaction/TransactionListRowAuthorization";
import { TransactionHeatmap } from "../components/transaction/TransactionHeatmap";
import { usePageTitle } from "../components/usePageTitle";
import { BASE_URL } from "../../const";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { DefaultTablePagination } from "../components/DefaultTablePagination";
import { useDashboardDispatch } from "../redux/dashboardStore";
import { PullToRefreshWrapper } from "../components/PullToRefresh";

export const TransactionListPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = React.useState(
    isNaN(parseInt(localStorage["ascii-pay-transactions-tab-index"]))
      ? 0
      : parseInt(localStorage["ascii-pay-transactions-tab-index"])
  );
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
  const dispatch = useDashboardDispatch();

  const handleRefresh = () => {
    dispatch(accountApi.util?.invalidateTags(["Transactions"]));
  };

  usePageTitle(t("layout.transactions"));

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
        views={["year", "month", "day"]}
        label={t("date.start")}
        value={startDate}
        onChange={(v) => setStartDate(v)}
        disabled={rangePickerDisabled}
      />
      <Remove sx={{ mx: 1, opacity: rangePickerDisabled ? 0.4 : 1 }} />
      <DatePicker
        views={["year", "month", "day"]}
        label={t("date.end")}
        value={endDate}
        onChange={(v) => setEndDate(v)}
        disabled={rangePickerDisabled}
      />
    </Box>
  );

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.transactions"),
      target: "/transactions",
    },
  ];

  const header = (
    <PageHeader
      navigation={navigation}
      actionButtonView={isMobile ? undefined : rangePicker}
    >
      <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
        {t("layout.transactions")}
      </Typography>
    </PageHeader>
  );

  if (isLoading || transactions === undefined) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <PaperScreenLoader>{header}</PaperScreenLoader>
      </LocalizationProvider>
    );
  }

  let filteredTransactions = transactions;
  let previousTransactions: TransactionDto[] = [];
  if (startDate || endDate) {
    filteredTransactions = transactions.filter((transaction) => {
      let date = new Date(transaction.timestamp);

      if (startDate && dateToGrouping(startDate) > dateToGrouping(date)) {
        return false;
      }

      if (endDate && dateToGrouping(endDate) < dateToGrouping(date)) {
        return false;
      }

      return true;
    });
    previousTransactions = transactions.filter((transaction) => {
      let date = new Date(transaction.timestamp);

      if (startDate && dateToGrouping(startDate) > dateToGrouping(date)) {
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
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <PullToRefreshWrapper onRefresh={handleRefresh}>
        <Container maxWidth="lg">
          {header}

          {isMobile ? <Box sx={{ mb: 2 }}>{rangePicker}</Box> : null}

          <GlobalTransactionSummary
            transactions={filteredTransactions}
            previousTransactions={previousTransactions}
          />

          <Paper sx={{ mb: { xs: 2, sm: 4 } }} elevation={4}>
            <Tabs
              sx={{ px: 2, pt: 1 }}
              value={tabIndex}
              onChange={(event, newValue) => {
                setTabIndex(newValue);
                localStorage["ascii-pay-transactions-tab-index"] = newValue;
              }}
            >
              <Tab label={t("account.balanceTrend")} />
              <Tab label={t("account.heatmap")} />
            </Tabs>
            <Box sx={{ px: 2, pb: 1 }}>
              {tabIndex === 0 ? (
                <GlobalTransactionChart
                  transactions={filteredTransactions}
                  previousTransactions={previousTransactions}
                  startDate={startDate}
                  endDate={endDate}
                  onRequestZoom={onRequestZoomHandler}
                />
              ) : null}
              {tabIndex === 1 ? (
                <TransactionHeatmap
                  transactions={filteredTransactions}
                  startDate={startDate}
                  endDate={endDate}
                />
              ) : null}
            </Box>
          </Paper>

          <Paper elevation={4}>
            <TableContainer>
              <Table aria-label="Transactions table">
                <TableHead>
                  <TableRow>
                    <TableCell width={72}></TableCell>
                    <TableCell>{t("transactions.date")}</TableCell>
                    <TableCell>{t("transactions.total")}</TableCell>
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
              </Table>
            </TableContainer>
            <DefaultTablePagination
              count={sortedTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Container>
      </PullToRefreshWrapper>
    </LocalizationProvider>
  );
};

const format = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
  timeStyle: "medium",
});

const TransactionListRow = (props: { transaction: TransactionDto }) => {
  const { t } = useTranslation();

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
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                {props.transaction.account_id ? (
                  <TransactionListRowAccount
                    accountId={props.transaction.account_id}
                  />
                ) : null}
                {props.transaction.authorized_by_account_id ? (
                  <TransactionListRowAuthorization
                    accountId={props.transaction.authorized_by_account_id}
                    auth_method={
                      props.transaction.authorized_with_method ?? null
                    }
                  />
                ) : null}
              </Box>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell width={72}></TableCell>
                    <TableCell>{t("transactions.product")}</TableCell>
                    <TableCell>{t("transactions.price")}</TableCell>
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
