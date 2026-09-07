import React from "react";
import { Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { LockOpenOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trans, useTranslation } from "react-i18next";
import { useReopenPurchaseMutation } from "../../redux/api/purchaseApi";
import { usePageTitle } from "../../components/usePageTitle";
import { FormPage, useReturnTo } from "../../components/FormPage";
import {
  PurchaseNoticePage,
  purchasesNavigation,
  usePurchasePage,
  usePurchasePageFallback,
} from "../../components/purchase/usePurchasePage";
import { purchaseLabel } from "../../components/purchase/purchaseUtils";
import { shopSummary } from "../../components/purchase/shop/ShopFormPage";

/** Admin confirmation page that turns a finalized purchase into a draft. */
export const ReopenPurchasePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const title = t("purchase.reopen.title");

  const page = usePurchasePage();
  const { purchase, purchaseId, detailsPath } = page;
  const returnTo = useReturnTo(detailsPath);

  usePageTitle([
    t("layout.purchases"),
    purchase?.id?.toString() ?? t("layout.loading"),
    title,
  ]);

  const [reopenPurchase, { isLoading }] = useReopenPurchaseMutation();

  const fallback = usePurchasePageFallback(page, title);
  if (fallback) {
    return fallback;
  }
  if (!purchase) {
    return null;
  }

  const navigation = purchasesNavigation(t, purchaseId);

  if (purchase.state === "draft") {
    return (
      <PurchaseNoticePage
        title={title}
        subtitle={shopSummary(purchase)}
        navigation={navigation}
        backTo={detailsPath}
        backLabel={t("purchase.shop.toDetails")}
        severity="info"
        message={t("purchase.reopen.alreadyDraft")}
      />
    );
  }

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }
    try {
      await reopenPurchase(purchaseId).unwrap();
      toast.success(t("purchase.reopen.success"));
      navigate(detailsPath, { replace: true });
    } catch (e) {
      toast.error(t("purchase.reopen.error"));
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
            color="warning"
            onClick={handleSubmit}
            loading={isLoading}
            startIcon={<LockOpenOutlined />}
          >
            {t("purchase.reopen.action")}
          </LoadingButton>
        </>
      }
    >
      <Typography>
        <Trans
          i18nKey="purchase.reopen.content"
          values={{ name: purchaseLabel(purchase) }}
          components={{ bold: <b /> }}
        />
      </Typography>
    </FormPage>
  );
};
