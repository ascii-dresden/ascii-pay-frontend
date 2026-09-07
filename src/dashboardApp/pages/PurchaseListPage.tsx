import {
  Box,
  Button,
  Collapse,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Add,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB";
import { usePageTitle } from "../components/usePageTitle";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { DefaultTablePagination } from "../components/DefaultTablePagination";
import { useDashboardDispatch } from "../redux/dashboardStore";
import { PullToRefreshWrapper } from "../components/PullToRefresh";
import { purchaseApi, useGetAllPurchasesQuery } from "../redux/api/purchaseApi";
import { PurchaseDto, PurchaseStateDto } from "../../common/contracts";
import { TransactionListRowAccount } from "../components/transaction/TransactionListRowAccount";
import { moneyToString } from "../../terminalApp/components/Money";
import { ActionButtonAction } from "../components/ActionButton";
import { PurchaseActionButton } from "../components/purchase/PurchaseActionButton";
import { PurchaseItemTable } from "../components/purchase/PurchaseItemTable";
import { PurchaseStateChip } from "../components/purchase/PurchaseStateChip";
import { purchaseTotal } from "../components/purchase/purchaseUtils";

type StateFilter = "all" | PurchaseStateDto;

export const PurchaseListPage = () => {
  const { t } = useTranslation();

  const [stateFilter, setStateFilter] = useState<StateFilter>("all");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const {
    isLoading,
    isError,
    error,
    data: purchases,
  } = useGetAllPurchasesQuery();
  const dispatch = useDashboardDispatch();

  const handleRefresh = () => {
    dispatch(purchaseApi.util?.invalidateTags(["Purchases"]));
  };

  usePageTitle(t("layout.purchases"));

  useEffect(() => {
    if (isError) {
      toast.error("Could not load purchases!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.purchases"),
      target: "/purchases",
    },
  ];

  const actions: ActionButtonAction[] = [
    {
      label: t("purchase.action.newShoppingTrip"),
      icon: <ShoppingCartOutlined />,
      href: "/purchases/new",
    },
    {
      label: t("purchase.action.createPurchase"),
      icon: <Add />,
      href: "/purchases/receipt/new",
    },
  ];

  const header = (
    <PageHeader navigation={navigation} actions={actions}>
      <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
        {t("layout.purchases")}
      </Typography>
    </PageHeader>
  );

  if (isLoading || purchases === undefined) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <PaperScreenLoader>{header}</PaperScreenLoader>
      </LocalizationProvider>
    );
  }

  const draftCount = purchases.filter((p) => p.state === "draft").length;

  let sortedPurchases = purchases.filter(
    (p) => stateFilter === "all" || p.state === stateFilter
  );
  sortedPurchases.sort((a, b) => {
    if (a.state !== b.state) {
      return a.state === "draft" ? -1 : 1;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - sortedPurchases.length)
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

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    value: StateFilter | null
  ) => {
    if (value) {
      setStateFilter(value);
      setPage(0);
    }
  };

  const slicedPurchases =
    rowsPerPage > 0
      ? sortedPurchases.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : sortedPurchases;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <PullToRefreshWrapper onRefresh={handleRefresh}>
        <Container maxWidth="lg">
          {header}

          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={stateFilter}
              onChange={handleFilterChange}
              aria-label="purchase state filter"
            >
              <ToggleButton value="all">
                {t("purchase.filter.all")}
              </ToggleButton>
              <ToggleButton value="draft">
                {t("purchase.filter.drafts")}
                {draftCount > 0 ? ` (${draftCount})` : ""}
              </ToggleButton>
              <ToggleButton value="finalized">
                {t("purchase.filter.finalized")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Paper elevation={4}>
            <TableContainer>
              <Table aria-label="Purchases table">
                <TableHead>
                  <TableRow>
                    <TableCell width={72}></TableCell>
                    <TableCell>{t("purchase.timestamp")}</TableCell>
                    <TableCell>{t("purchase.store")}</TableCell>
                    <TableCell>{t("purchase.total")}</TableCell>
                    <TableCell>{t("purchase.purchaser")}</TableCell>
                    <TableCell width={128}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slicedPurchases?.map((purchase) => (
                    <PurchaseListRow key={purchase.id} purchase={purchase} />
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 67 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <DefaultTablePagination
              count={sortedPurchases.length}
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

const PurchaseListRow = (props: { purchase: PurchaseDto }) => {
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  const total = purchaseTotal(props.purchase);
  const isDraft = props.purchase.state === "draft";

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PurchaseStateChip state={props.purchase.state} />
            <span>{format.format(new Date(props.purchase.timestamp))}</span>
          </Box>
        </TableCell>
        <TableCell>
          {props.purchase.store}
          {props.purchase.name ? (
            <Typography
              variant="caption"
              color="text.secondary"
              component="div"
            >
              {props.purchase.name}
            </Typography>
          ) : null}
        </TableCell>
        <TableCell>{moneyToString(total)}</TableCell>
        <TableCell>
          {props.purchase.purchased_by_account_id ? (
            <TransactionListRowAccount
              accountId={props.purchase.purchased_by_account_id}
            />
          ) : null}
        </TableCell>
        <TableCell width={128}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            {isDraft ? (
              <Button
                size="small"
                variant="contained"
                component={Link}
                to={`/purchases/${props.purchase.id}/shop`}
                startIcon={<ShoppingCartOutlined />}
                sx={{ whiteSpace: "nowrap" }}
              >
                {t("purchase.action.continueShopping")}
              </Button>
            ) : null}
            <PurchaseActionButton
              purchase={props.purchase}
              showNavigationOption
            />
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <PurchaseItemTable purchase={props.purchase} size="small" />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
