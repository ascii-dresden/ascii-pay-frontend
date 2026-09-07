import React from "react";
import {
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DeleteOutline } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trans, useTranslation } from "react-i18next";
import { useDeletePurchaseMutation } from "../../redux/api/purchaseApi";
import { useDashboardSelector } from "../../redux/dashboardStore";
import { moneyToString } from "../../../terminalApp/components/Money";
import { usePageTitle } from "../../components/usePageTitle";
import { FormPage, useReturnTo } from "../../components/FormPage";
import { PurchaseStateChip } from "../../components/purchase/PurchaseStateChip";
import {
  PurchaseNoticePage,
  purchasesNavigation,
  usePurchasePage,
  usePurchasePageFallback,
} from "../../components/purchase/usePurchasePage";
import { purchaseTotal } from "../../components/purchase/purchaseUtils";

const format = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
  timeStyle: "medium",
});

/** Confirmation page that permanently deletes a purchase. */
export const DeletePurchasePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const title = t("purchase.edit.deleteTitle");

  const page = usePurchasePage();
  const { purchase, purchaseId, detailsPath } = page;
  const returnTo = useReturnTo(detailsPath);
  const user = useDashboardSelector((state) => state.userState.user);
  const isAdmin = user?.role === "Admin";

  usePageTitle([
    t("layout.purchases"),
    purchase?.id?.toString() ?? t("layout.loading"),
    title,
  ]);

  const [deletePurchase, { isLoading }] = useDeletePurchaseMutation();

  const fallback = usePurchasePageFallback(page, title);
  if (fallback) {
    return fallback;
  }
  if (!purchase) {
    return null;
  }

  const navigation = purchasesNavigation(t, purchaseId);

  if (purchase.state !== "draft" && !isAdmin) {
    return (
      <PurchaseNoticePage
        title={title}
        navigation={navigation}
        backTo={detailsPath}
        backLabel={t("purchase.shop.toDetails")}
        severity="info"
        message={t("purchase.details.editLocked")}
      />
    );
  }

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }
    try {
      await deletePurchase(purchaseId).unwrap();
      toast.success("Purchase deleted successfully!");
      navigate("/purchases", { replace: true });
    } catch (e) {
      toast.error("Purchase could not be deleted!");
      console.error(e);
    }
  };

  const row = (label: string, value: React.ReactNode) => (
    <TableRow sx={{ "& > *": { borderBottom: "unset !important" } }}>
      <TableCell sx={{ fontWeight: "bold", pl: 0, width: 120 }}>
        {label}
      </TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );

  return (
    <FormPage
      title={title}
      navigation={navigation}
      backTo={returnTo}
      actions={
        <>
          <Button variant="outlined" component={Link} to={returnTo}>
            {t("purchase.action.cancel")}
          </Button>
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleSubmit}
            loading={isLoading}
            startIcon={<DeleteOutline />}
          >
            {t("purchase.edit.deleteAction")}
          </LoadingButton>
        </>
      }
    >
      <Typography sx={{ mb: 2 }}>
        <Trans
          i18nKey="purchase.edit.deleteContent"
          values={{ name: purchase.id }}
          components={{ bold: <b /> }}
        />
      </Typography>
      <Table size="small">
        <TableBody>
          {row(
            t("purchase.timestamp"),
            format.format(new Date(purchase.timestamp))
          )}
          {row(t("purchase.store"), purchase.store)}
          {purchase.name ? row(t("purchase.name"), purchase.name) : null}
          {row(
            t("purchase.stateLabel"),
            <PurchaseStateChip state={purchase.state} />
          )}
          {row(
            t("purchase.total"),
            `${moneyToString(purchaseTotal(purchase))} · ${t(
              "purchase.shop.items",
              { count: purchase.items.length }
            )}`
          )}
        </TableBody>
      </Table>
      {purchase.state !== "draft" ? (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t("purchase.state.finalized")}
        </Alert>
      ) : null}
    </FormPage>
  );
};
