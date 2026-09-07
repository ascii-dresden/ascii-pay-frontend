import { Alert, Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetProductQuery,
} from "../redux/api/productApi";
import { usePageTitle } from "../components/usePageTitle";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { FormPage } from "../components/FormPage";
import { PageHeaderNavigation } from "../components/PageHeader";
import { ProductAvatar } from "../components/product/ProductAvatar";
import { TagChip } from "../components/product/TagChip";

export const DeleteProductPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const params = useParams();
  const productId = parseInt(params.productId ?? "");

  const {
    isLoading,
    isError,
    error,
    data: product,
  } = useGetProductQuery(productId);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  usePageTitle([
    t("layout.products"),
    product?.name ?? t("layout.loading"),
    t("product.action.deleteProduct"),
  ]);

  useEffect(() => {
    if (isError) {
      toast.error("Could not load product!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.products"),
      target: "/products",
    },
  ];
  if (product) {
    navigation.push({
      label: product.name,
      target: `/products/${productId}`,
    });
  }
  navigation.push({
    label: t("product.action.deleteProduct"),
    target: `/products/${productId}/delete`,
  });

  const backTo = `/products/${productId}`;

  if (isError) {
    return (
      <FormPage
        title={t("product.edit.deleteTitle")}
        navigation={navigation}
        backTo="/products"
      >
        <Alert severity="error">{t("product.edit.notFound")}</Alert>
      </FormPage>
    );
  }

  if (isLoading || !product) {
    return <FullScreenLoader />;
  }

  const handleSubmit = async () => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success(t("product.edit.deleteSuccess"));
      navigate("/products");
    } catch (e) {
      toast.error(t("product.edit.deleteError"));
      console.error(e);
    }
  };

  return (
    <FormPage
      title={t("product.edit.deleteTitle")}
      navigation={navigation}
      backTo={backTo}
      actions={
        <>
          <Button variant="outlined" onClick={() => navigate(backTo)}>
            {t("product.edit.cancel")}
          </Button>
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleSubmit}
            loading={isDeleting}
          >
            {t("product.edit.deleteAction")}
          </LoadingButton>
        </>
      }
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <ProductAvatar product={product} size={56} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {[product.nickname, product.category]
              .filter((s) => s && s.length > 0)
              .join(" · ")}
          </Typography>
          <Box sx={{ mt: 0.5 }}>
            {product.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </Box>
        </Box>
      </Box>
      <Alert severity="warning">
        <Trans
          i18nKey="product.edit.deleteContent"
          values={{ name: product.name }}
          components={{ bold: <b /> }}
        />
      </Alert>
    </FormPage>
  );
};
