import React from "react";
import {
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { LockOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trans, useTranslation } from "react-i18next";
import { useFinalizePurchaseMutation } from "../../redux/api/purchaseApi";
import { moneyToString } from "../../../terminalApp/components/Money";
import { usePageTitle } from "../../components/usePageTitle";
import { FormPage, useReturnTo } from "../../components/FormPage";
import {
  PurchaseNoticePage,
  purchasesNavigation,
  usePurchasePage,
  usePurchasePageFallback,
} from "../../components/purchase/usePurchasePage";
import {
  collectedItems,
  plannedItems,
  purchaseTotal,
} from "../../components/purchase/purchaseUtils";
import { shopSummary } from "../../components/purchase/shop/ShopFormPage";

/** Confirmation page that locks a draft purchase. */
export const FinalizePurchasePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const title = t("purchase.finalize.title");

  const page = usePurchasePage();
  const { purchase, purchaseId, detailsPath } = page;
  const returnTo = useReturnTo(detailsPath);

  usePageTitle([
    t("layout.purchases"),
    purchase?.id?.toString() ?? t("layout.loading"),
    title,
  ]);

  const [finalizePurchase, { isLoading }] = useFinalizePurchaseMutation();

  const fallback = usePurchasePageFallback(page, title);
  if (fallback) {
    return fallback;
  }
  if (!purchase) {
    return null;
  }

  const navigation = purchasesNavigation(t, purchaseId);

  if (purchase.state !== "draft") {
    return (
      <PurchaseNoticePage
        title={title}
        subtitle={shopSummary(purchase)}
        navigation={navigation}
        backTo={detailsPath}
        backLabel={t("purchase.shop.toDetails")}
        severity="info"
        message={t("purchase.finalize.alreadyFinalized")}
      />
    );
  }

  const total = purchaseTotal(purchase);
  const uncollected = plannedItems(purchase);
  const cartCount = collectedItems(purchase).length;

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }
    try {
      await finalizePurchase(purchaseId).unwrap();
      toast.success(t("purchase.finalize.success"));
      navigate(detailsPath, { replace: true });
    } catch (e) {
      toast.error(t("purchase.finalize.error"));
      console.error(e);
    }
  };

  return (
    <FormPage
      title={title}
      subtitle={shopSummary(purchase)}
      navigation={navigation}
      backTo={returnTo}
      actions={
        <>
          <Button variant="outlined" component={Link} to={returnTo}>
            {t("purchase.action.cancel")}
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={isLoading}
            startIcon={<LockOutlined />}
          >
            {t("purchase.finalize.action")}
          </LoadingButton>
        </>
      }
    >
      <Typography>
        <Trans
          i18nKey="purchase.finalize.content"
          values={{ total: moneyToString(total) }}
          components={{ bold: <b /> }}
        />
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {t("purchase.shop.items", { count: cartCount })}
      </Typography>
      {uncollected.length > 0 ? (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t("purchase.finalize.uncollected", { count: uncollected.length })}
          <List dense disablePadding sx={{ mt: 1 }}>
            {uncollected.map((item) => (
              <ListItem key={item.id} disableGutters sx={{ py: 0 }}>
                <ListItemText
                  primary={item.product?.name ?? item.name}
                  secondary={`${item.container_count} × ${t(
                    "purchase.item.container_size"
                  )} ${item.container_size}`}
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>
            ))}
          </List>
        </Alert>
      ) : null}
    </FormPage>
  );
};
