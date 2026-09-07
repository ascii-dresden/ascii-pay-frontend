import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { ProductDto } from "../../../common/contracts";
import {
  useGetAllProductsQuery,
  useGetProductByBarcodeQuery,
} from "../../redux/api/productApi";
import { usePageTitle } from "../../components/usePageTitle";
import {
  ShopFormPage,
  useShopPurchase,
} from "../../components/purchase/shop/ShopFormPage";
import { AddProductToCart } from "../../components/purchase/shop/AddProductToCart";

/**
 * Resolves a scanned or typed barcode (server lookup, then the cached
 * product list) and shows either the add-to-cart form or the
 * "not registered" options.
 */
export const ScanResultPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const code = (params.code ?? "").trim();

  const title = t("purchase.shop.scanResultTitle");
  usePageTitle([t("layout.purchases"), t("purchase.shop.title"), title]);

  const { purchase, shopPath, fallback } = useShopPurchase(title);

  const lookup = useGetProductByBarcodeQuery(code, {
    skip: code.length === 0,
    refetchOnMountOrArgChange: true,
  });
  const { data: products, isLoading: productsLoading } =
    useGetAllProductsQuery();

  const lookupStatus = (lookup.error as { status?: unknown } | undefined)
    ?.status;
  const notFound = lookup.isError && lookupStatus === 404;
  const lookupFailed = lookup.isError && lookupStatus !== 404;

  let product: ProductDto | null = lookup.data ?? null;
  if (!product && lookup.isError) {
    product = products?.find((p) => (p.barcode ?? "").trim() === code) ?? null;
  }

  if (fallback) {
    return fallback;
  }
  if (!purchase) {
    return null;
  }

  if (product) {
    return (
      <AddProductToCart purchase={purchase} product={product} barcode={code} />
    );
  }

  const resolving =
    code.length > 0 &&
    (lookup.isFetching ||
      lookup.isUninitialized ||
      (lookup.isError && productsLoading));

  if (resolving) {
    return (
      <ShopFormPage purchase={purchase} title={title}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            py: 4,
          }}
        >
          <CircularProgress size={24} />
          <Typography color="text.secondary">
            {t("purchase.shop.resolving")}
          </Typography>
        </Box>
      </ShopFormPage>
    );
  }

  if (lookupFailed || code.length === 0) {
    return (
      <ShopFormPage
        purchase={purchase}
        title={title}
        actions={
          code.length > 0 ? (
            <Button variant="contained" onClick={() => lookup.refetch()}>
              {t("purchase.shop.retry")}
            </Button>
          ) : null
        }
      >
        <Alert severity="error">{t("purchase.shop.lookupFailed")}</Alert>
      </ShopFormPage>
    );
  }

  // notFound (404 and not in the cached list)
  const returnTo = `${shopPath}/scan/${encodeURIComponent(code)}`;
  return (
    <ShopFormPage
      purchase={purchase}
      title={t("purchase.shop.notRegistered")}
      actions={
        <>
          <Button
            variant="outlined"
            component={Link}
            to={`${shopPath}/free?barcode=${encodeURIComponent(code)}`}
          >
            {t("purchase.shop.addFreeItem")}
          </Button>
          <Button
            variant="contained"
            component={Link}
            to={`/products/new?barcode=${encodeURIComponent(
              code
            )}&returnTo=${encodeURIComponent(returnTo)}`}
          >
            {t("purchase.shop.createProduct")}
          </Button>
        </>
      }
    >
      <Typography>
        <Trans
          i18nKey="purchase.shop.notRegisteredHint"
          values={{ code }}
          components={{ bold: <b /> }}
        />
      </Typography>
      {notFound ? null : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {code}
        </Typography>
      )}
    </ShopFormPage>
  );
};
