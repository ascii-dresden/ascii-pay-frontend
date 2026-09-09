import { Alert, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductQuery,
  useUpdateProductMutation,
} from "../redux/api/productApi";
import { usePageTitle } from "../components/usePageTitle";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { FormPage } from "../components/FormPage";
import { PageHeaderNavigation } from "../components/PageHeader";
import {
  ProductForm,
  ProductFormValue,
  productFormValueFromDto,
  productFormValueToSaveDto,
} from "../components/product/ProductForm";

export const UpdateProductPage = () => {
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
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();

  const [value, setValue] = React.useState<ProductFormValue | null>(null);

  usePageTitle([
    t("layout.products"),
    product?.name ?? t("layout.loading"),
    t("product.edit.updateTitle"),
  ]);

  useEffect(() => {
    if (isError) {
      toast.error("Could not load product!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (product) {
      setValue(productFormValueFromDto(product));
    }
  }, [product]);

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
    label: t("product.action.edit"),
    target: `/products/${productId}/edit`,
  });

  const backTo = `/products/${productId}`;

  if (isError) {
    return (
      <FormPage
        title={t("product.edit.updateTitle")}
        navigation={navigation}
        backTo="/products"
      >
        <Alert severity="error">{t("product.edit.notFound")}</Alert>
      </FormPage>
    );
  }

  if (isLoading || !product || value === null) {
    return <FullScreenLoader />;
  }

  const handleSubmit = async () => {
    try {
      await updateProduct({
        id: productId,
        product: productFormValueToSaveDto(value),
      }).unwrap();
      toast.success(t("product.edit.updateSuccess"));
      navigate(backTo);
    } catch (e) {
      toast.error(t("product.edit.updateError"));
      console.error(e);
    }
  };

  return (
    <FormPage
      title={t("product.edit.updateTitle")}
      subtitle={product.name}
      navigation={navigation}
      backTo={backTo}
      actions={
        <>
          <Button variant="outlined" onClick={() => navigate(backTo)}>
            {t("product.edit.cancel")}
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={isSaving}
            disabled={value.name.trim().length === 0}
          >
            {t("product.edit.updateAction")}
          </LoadingButton>
        </>
      }
    >
      <ProductForm
        value={value}
        onChange={(patch) => setValue((v) => (v ? { ...v, ...patch } : v))}
        productId={product.id}
      />
    </FormPage>
  );
};
