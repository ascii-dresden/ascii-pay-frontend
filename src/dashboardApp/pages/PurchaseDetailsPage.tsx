import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { purchaseApi, useGetPurchaseQuery } from "../redux/api/purchaseApi";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { PurchaseActionButton } from "../components/purchase/PurchaseActionButton";
import { usePageTitle } from "../components/usePageTitle";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { useDashboardDispatch } from "../redux/dashboardStore";
import { PullToRefreshWrapper } from "../components/PullToRefresh";
import { moneyToString } from "../../terminalApp/components/Money";
import { TransactionListRowAccount } from "../components/transaction/TransactionListRowAccount";
import { PurchaseItemTable } from "../components/purchase/PurchaseItemTable";

const format = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
  timeStyle: "medium",
});

export const PurchaseDetailsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  let params = useParams();
  let purchaseId = parseInt(params.purchaseId ?? "");

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

  let total = purchase.items
    .map((i) => i.container_count * i.container_cents)
    .reduce((a, b) => a + b, 0);

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
      <Container maxWidth="lg">
        <PageHeader
          navigation={navigation}
          actionButtonView={<PurchaseActionButton purchase={purchase} />}
        >
          <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
            <span style={{ marginRight: "0.6rem" }}>
              {format.format(new Date(purchase.timestamp))}
            </span>
          </Typography>
        </PageHeader>

        <Box sx={{ mb: 4 }}>
          <Paper sx={{ display: { xs: "block", md: "flex" } }} elevation={4}>
            <Box sx={{ p: 2, flexGrow: 1 }}>
              <Table size="small">
                <TableBody>
                  <TableRow
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell
                      width={100}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      {t("purchase.timestamp")}
                    </TableCell>
                    <TableCell>
                      {format.format(new Date(purchase.timestamp))}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell
                      width={100}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      {t("purchase.store")}
                    </TableCell>
                    <TableCell>{purchase.store}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell
                      width={100}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      {t("purchase.purchaser")}
                    </TableCell>
                    <TableCell>
                      {purchase.purchased_by_account_id ? (
                        <TransactionListRowAccount
                          accountId={purchase.purchased_by_account_id}
                        />
                      ) : null}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell
                      width={100}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      {t("purchase.total")}
                    </TableCell>
                    <TableCell>{moneyToString(total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
