import React from "react";
import { Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PurchaseDto } from "../../../../common/contracts";
import { moneyToString } from "../../../../terminalApp/components/Money";
import { FormPage } from "../../FormPage";
import { PageHeaderNavigation } from "../../PageHeader";
import { purchaseLabel, purchaseTotal } from "../purchaseUtils";
import {
  PurchaseNoticePage,
  purchasesNavigation,
  usePurchasePage,
  usePurchasePageFallback,
} from "../usePurchasePage";

/** Location state understood by the shopping mode page. */
export type ShopLocationState = { tab?: "scan" | "cart" | "list" };

export const shopNavigation = (
  t: (key: string) => string,
  purchaseId: number
): PageHeaderNavigation[] => [
  ...purchasesNavigation(t, purchaseId),
  {
    label: t("purchase.shop.title"),
    target: `/purchases/${purchaseId}/shop`,
  },
];

/** "Store · Name · 12,34 €" summary line for the sub-page subtitle. */
export const shopSummary = (purchase: PurchaseDto): string =>
  [
    purchase.store || purchaseLabel(purchase),
    purchase.store && purchase.name ? purchase.name : null,
    moneyToString(purchaseTotal(purchase)),
  ]
    .filter(Boolean)
    .join(" · ");

/**
 * Loads the purchase for a shopping-mode sub-page. `fallback` is a complete
 * page element (loader, not found, finalized notice) or null when the page
 * can render its own content.
 */
export const useShopPurchase = (title: string) => {
  const { t } = useTranslation();
  const state = usePurchasePage();
  let fallback = usePurchasePageFallback(state, title, state.shopPath);
  if (!fallback && state.purchase && state.purchase.state === "finalized") {
    fallback = (
      <PurchaseNoticePage
        title={title}
        subtitle={shopSummary(state.purchase)}
        navigation={shopNavigation(t, state.purchaseId)}
        backTo={state.detailsPath}
        backLabel={t("purchase.shop.toDetails")}
        severity="info"
        message={t("purchase.shop.finalizedNotice")}
      />
    );
  }
  return { ...state, fallback };
};

/**
 * Layout for shopping-mode sub-pages: breadcrumbs down to shopping mode,
 * a compact trip summary as subtitle and "Back to shopping" as the
 * secondary action.
 */
export const ShopFormPage = (props: {
  purchase: PurchaseDto;
  title: React.ReactNode;
  children: React.ReactNode;
  /** Primary action(s); the back-to-shopping button is added. */
  actions?: React.ReactNode;
  hideBackAction?: boolean;
}) => {
  const { t } = useTranslation();
  const shopPath = `/purchases/${props.purchase.id}/shop`;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <FormPage
        title={props.title}
        subtitle={shopSummary(props.purchase)}
        navigation={shopNavigation(t, props.purchase.id)}
        backTo={shopPath}
        actions={
          <>
            {props.hideBackAction ? null : (
              <Button variant="outlined" component={Link} to={shopPath}>
                {t("purchase.shop.backToShopping")}
              </Button>
            )}
            {props.actions}
          </>
        }
      >
        {props.children}
      </FormPage>
    </LocalizationProvider>
  );
};
