import React from "react";
import { Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetProductQuery } from "../../redux/api/productApi";
import { usePageTitle } from "../../components/usePageTitle";
import { FullScreenLoader } from "../../components/FullScreenLoader";
import {
  ShopFormPage,
  useShopPurchase,
} from "../../components/purchase/shop/ShopFormPage";
import { AddProductToCart } from "../../components/purchase/shop/AddProductToCart";

/**
 * Add-to-cart page for a product chosen from the search field or the list
 * tab of shopping mode.
 */
export const AddProductPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const productId = parseInt(params.productId ?? "");

  const title = t("purchase.shop.addToCart");
  usePageTitle([t("layout.purchases"), t("purchase.shop.title"), title]);

  const { purchase, fallback } = useShopPurchase(title);
  const productQuery = useGetProductQuery(productId, {
    skip: Number.isNaN(productId),
  });

  if (fallback) {
    return fallback;
  }
  if (!purchase) {
    return null;
  }

  // Prefer the copy embedded in the purchase (planned rows) while loading.
  const product =
    productQuery.data ??
    purchase.items.find((i) => i.product?.id === productId)?.product ??
    null;

  if (!product && productQuery.isLoading) {
    return <FullScreenLoader />;
  }
  if (!product) {
    return (
      <ShopFormPage purchase={purchase} title={title}>
        <Alert severity="error">{t("purchase.shop.productNotFound")}</Alert>
      </ShopFormPage>
    );
  }

  return (
    <AddProductToCart
      purchase={purchase}
      product={product}
      barcode={product.barcode ?? null}
    />
  );
};
