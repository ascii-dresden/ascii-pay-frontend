import React from "react";
import { Alert, AlertColor, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useGetPurchaseQuery } from "../../redux/api/purchaseApi";
import { PageHeaderNavigation } from "../PageHeader";
import { FormPage } from "../FormPage";
import { FullScreenLoader } from "../FullScreenLoader";

export const purchasesNavigation = (
  t: (key: string) => string,
  purchaseId?: number
): PageHeaderNavigation[] => {
  const navigation: PageHeaderNavigation[] = [
    { label: t("layout.purchases"), target: "/purchases" },
  ];
  if (purchaseId !== undefined && !Number.isNaN(purchaseId)) {
    navigation.push({
      label: purchaseId.toString(),
      target: `/purchases/${purchaseId}`,
    });
  }
  return navigation;
};

/**
 * Loads the purchase from the `:purchaseId` route param and reports load
 * errors with a toast (like the existing detail pages).
 */
export const usePurchasePage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const purchaseId = parseInt(params.purchaseId ?? "");
  const invalidId = Number.isNaN(purchaseId);

  const { data, isLoading, isError, error } = useGetPurchaseQuery(purchaseId, {
    skip: invalidId,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error(t("purchase.shop.loadError"));
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError]);

  return {
    purchaseId,
    purchase: data,
    isLoading: isLoading && !invalidId,
    isError: isError || invalidId,
    detailsPath: `/purchases/${purchaseId}`,
    shopPath: `/purchases/${purchaseId}/shop`,
  };
};

/**
 * Full page notice (not found, locked, already done) with a back button.
 */
export const PurchaseNoticePage = (props: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  navigation: PageHeaderNavigation[];
  backTo: string;
  backLabel?: React.ReactNode;
  severity?: AlertColor;
  message: React.ReactNode;
  extraActions?: React.ReactNode;
}) => {
  const { t } = useTranslation();
  return (
    <FormPage
      title={props.title}
      subtitle={props.subtitle}
      navigation={props.navigation}
      backTo={props.backTo}
      actions={
        <>
          {props.extraActions}
          <Button variant="outlined" component={Link} to={props.backTo}>
            {props.backLabel ?? t("purchase.action.back")}
          </Button>
        </>
      }
    >
      <Alert severity={props.severity ?? "warning"}>{props.message}</Alert>
    </FormPage>
  );
};

/**
 * Loading / not-found shell for purchase pages. Returns null when the
 * purchase is available and the page can render itself.
 */
export const usePurchasePageFallback = (
  state: ReturnType<typeof usePurchasePage>,
  title: string,
  backTo?: string
): React.ReactElement | null => {
  const { t } = useTranslation();
  if (state.isLoading) {
    return <FullScreenLoader />;
  }
  if (!state.purchase) {
    return (
      <PurchaseNoticePage
        title={title}
        navigation={purchasesNavigation(t)}
        backTo={backTo ?? "/purchases"}
        severity="error"
        message={
          state.isError ? t("purchase.notFound") : t("purchase.shop.loadError")
        }
      />
    );
  }
  return null;
};
