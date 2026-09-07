import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import {
  LockOpenOutlined,
  LockOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { purchaseApi, useGetPurchaseQuery } from "../redux/api/purchaseApi";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { PurchaseActionButton } from "../components/purchase/PurchaseActionButton";
import { usePageTitle } from "../components/usePageTitle";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import {
  useDashboardDispatch,
  useDashboardSelector,
} from "../redux/dashboardStore";
import { PullToRefreshWrapper } from "../components/PullToRefresh";
import { moneyToString } from "../../terminalApp/components/Money";
import { TransactionListRowAccount } from "../components/transaction/TransactionListRowAccount";
import { PurchaseItemTable } from "../components/purchase/PurchaseItemTable";
import { PurchaseStateChip } from "../components/purchase/PurchaseStateChip";
import {
  plannedItems,
  purchaseTotal,
} from "../components/purchase/purchaseUtils";

const format = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
  timeStyle: "medium",
});

export const PurchaseDetailsPage = () => {
  const { t } = useTranslation();

  let params = useParams();
  let purchaseId = parseInt(params.purchaseId ?? "");

  const user = useDashboardSelector((state) => state.userState.user);
  const isAdmin = user?.role === "Admin";

  const {
    isLoading,
    isError,
    error,
    data: purchase,
  } = useGetPurchaseQuery(purchaseId);
  const dispatch = useDashboardDispatch();

  const handleRefresh = () => {
    dispatch(
      purchaseApi.util?.invalidateTags([{ type: "Purchases", id: purchaseId }])
    );
  };

  usePageTitle([
    t("layout.purchases"),
    purchase?.id?.toString() ?? t("layout.loading"),
  ]);

  useEffect(() => {
    if (isError) {
      toast.error("Could not load purchase!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !purchase) {
    return <FullScreenLoader />;
  }

  let navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.purchases"),
      target: "/purchases",
    },
    {
      label: purchase.id.toString(),
      target: `/purchases/${purchaseId}`,
    },
  ];

  const total = purchaseTotal(purchase);
  const isDraft = purchase.state === "draft";
  const uncollected = plannedItems(purchase).length;

  const infoRow = (label: string, value: React.ReactNode) => (
    <TableRow sx={{ "& > *": { borderBottom: "unset !important" } }}>
      <TableCell width={100} align="right" sx={{ fontWeight: "bold" }}>
        {label}
      </TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
      <Container maxWidth="lg">
        <PageHeader
          navigation={navigation}
          actionButtonView={<PurchaseActionButton purchase={purchase} />}
        >
          <Typography
            sx={{
              flex: "1 1 100%",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
            variant="h5"
            component="div"
          >
            <span>{format.format(new Date(purchase.timestamp))}</span>
            <PurchaseStateChip state={purchase.state} size="medium" />
          </Typography>
        </PageHeader>

        <Box sx={{ mb: 4 }}>
          {!isDraft ? (
            <Alert severity="info" icon={<LockOutlined />} sx={{ mb: 2 }}>
              {t("purchase.details.editLocked")}
            </Alert>
          ) : null}

          <Paper sx={{ display: { xs: "block", md: "flex" } }} elevation={4}>
            <Box sx={{ p: 2, flexGrow: 1 }}>
              <Table size="small">
                <TableBody>
                  {infoRow(
                    t("purchase.timestamp"),
                    format.format(new Date(purchase.timestamp))
                  )}
                  {infoRow(t("purchase.store"), purchase.store)}
                  {purchase.name
                    ? infoRow(t("purchase.name"), purchase.name)
                    : null}
                  {infoRow(
                    t("purchase.purchaser"),
                    purchase.purchased_by_account_id ? (
                      <TransactionListRowAccount
                        accountId={purchase.purchased_by_account_id}
                      />
                    ) : null
                  )}
                  {purchase.finalized_at
                    ? infoRow(
                        t("purchase.finalizedAt"),
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <span>
                            {format.format(new Date(purchase.finalized_at))}
                          </span>
                          {purchase.finalized_by_account_id ? (
                            <TransactionListRowAccount
                              accountId={purchase.finalized_by_account_id}
                            />
                          ) : null}
                        </Box>
                      )
                    : null}
                  {infoRow(t("purchase.total"), moneyToString(total))}
                </TableBody>
              </Table>
            </Box>
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: { xs: "stretch", md: "center" },
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row", md: "column" }}
                spacing={1.5}
                sx={{ width: "100%" }}
              >
                {isDraft ? (
                  <>
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/purchases/${purchaseId}/shop`}
                      startIcon={<ShoppingCartOutlined />}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {t("purchase.action.continueShopping")}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LockOutlined />}
                      component={Link}
                      to={`/purchases/${purchaseId}/finalize`}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {t("purchase.action.finalize")}
                      {uncollected > 0 ? ` (${uncollected})` : ""}
                    </Button>
                  </>
                ) : null}
                {!isDraft && isAdmin ? (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<LockOpenOutlined />}
                    component={Link}
                    to={`/purchases/${purchaseId}/reopen`}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {t("purchase.action.reopen")}
                  </Button>
                ) : null}
              </Stack>
            </Box>
          </Paper>

          <Paper
            sx={{ display: { xs: "block", md: "flex" }, mt: { xs: 2, sm: 4 } }}
            elevation={4}
          >
            <TableContainer>
              <PurchaseItemTable purchase={purchase} />
            </TableContainer>
          </Paper>
        </Box>
      </Container>
    </PullToRefreshWrapper>
  );
};
