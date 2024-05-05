import {
  Avatar,
  Box,
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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Add, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { stringAvatar } from "../../common/stringAvatar";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB";
import { usePageTitle } from "../components/usePageTitle";
import { BASE_URL } from "../../const";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { DefaultTablePagination } from "../components/DefaultTablePagination";
import { useDashboardDispatch } from "../redux/dashboardStore";
import { PullToRefreshWrapper } from "../components/PullToRefresh";
import { purchaseApi, useGetAllPurchasesQuery } from "../redux/api/purchaseApi";
import { PurchaseDto } from "../../common/contracts";
import { TransactionListRowAccount } from "../components/transaction/TransactionListRowAccount";
import { moneyToString } from "../../terminalApp/components/Money";
import { ActionButtonAction } from "../components/ActionButton";
import { CreatePurchaseDialog } from "../components/purchase/CreatePurchaseDialog";
import { PurchaseActionButton } from "../components/purchase/PurchaseActionButton";

export const PurchaseListPage = () => {
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);

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
      label: t("purchase.action.createPurchase"),
      icon: <Add />,
      action: () => setOpenModal(true),
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

  let sortedPurchases = [...purchases];
  sortedPurchases.reverse();

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

          <Paper elevation={4}>
            <TableContainer>
              <Table aria-label="Purchases table">
                <TableHead>
                  <TableRow>
                    <TableCell width={72}></TableCell>
                    <TableCell>{t("purchase.timestamp")}</TableCell>
                    <TableCell>{t("purchase.store")}</TableCell>
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
                      <TableCell colSpan={5} />
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

          <CreatePurchaseDialog open={openModal} setOpen={setOpenModal} />
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
          {format.format(new Date(props.purchase.timestamp))}
        </TableCell>
        <TableCell>{props.purchase.store}</TableCell>
        <TableCell>
          {props.purchase.purchased_by_account_id ? (
            <TransactionListRowAccount
              accountId={props.purchase.purchased_by_account_id}
            />
          ) : null}
        </TableCell>
        <TableCell width={128}>
          <PurchaseActionButton
            purchase={props.purchase}
            showNavigationOption
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell width={72}></TableCell>
                    <TableCell>{t("purchase.item.name")}</TableCell>
                    <TableCell>{t("purchase.item.container_size")}</TableCell>
                    <TableCell>{t("purchase.item.container_count")}</TableCell>
                    <TableCell>{t("purchase.item.container_cents")}</TableCell>
                    <TableCell>{t("purchase.item.cents_per_item")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.purchase.items.map((item, index) => (
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
                      <TableCell>{item.product?.name ?? item.name}</TableCell>
                      <TableCell>{item.container_size}</TableCell>
                      <TableCell>{item.container_count}</TableCell>
                      <TableCell>
                        {moneyToString(item.container_cents)}
                      </TableCell>
                      <TableCell>
                        {moneyToString(
                          item.container_cents / item.container_size
                        )}
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
