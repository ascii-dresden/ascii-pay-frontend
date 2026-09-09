import React from "react";
import {
  Alert,
  Autocomplete,
  Box,
  createFilterOptions,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { QrCode2Outlined, StraightenOutlined } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ProductDto } from "../../../common/contracts";
import {
  useAddProductBarcodeMutation,
  useGetAllProductsQuery,
} from "../../redux/api/productApi";
import { usePageTitle } from "../../components/usePageTitle";
import {
  ShopFormPage,
  useShopPurchase,
} from "../../components/purchase/shop/ShopFormPage";
import {
  barcodeSearchText,
  barcodeSummary,
} from "../../components/product/productBarcodeUtils";

const productFilter = createFilterOptions<ProductDto>({
  stringify: (option) =>
    [option.name, option.nickname ?? "", barcodeSearchText(option)].join(" "),
});

/**
 * Attaches a scanned but unknown code to a product we already have — the crate
 * of an article whose single bottle is registered, or a second EAN of the same
 * article. After saving, the scan page resolves the code and the purchaser
 * continues straight into add-to-cart.
 */
export const AssignBarcodePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const code = (params.code ?? "").trim();

  const title = t("purchase.shop.assignToProduct");
  usePageTitle([t("layout.purchases"), t("purchase.shop.title"), title]);

  const { purchase, shopPath, fallback } = useShopPurchase(title);
  const { data: products } = useGetAllProductsQuery();
  const [addBarcode, { isLoading }] = useAddProductBarcodeMutation();

  const [product, setProduct] = React.useState<ProductDto | null>(null);
  const [containerSize, setContainerSize] = React.useState(1);
  const [label, setLabel] = React.useState("");

  const sortedProducts = React.useMemo(() => {
    const sorted = [...(products ?? [])];
    sorted.sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    );
    return sorted;
  }, [products]);

  if (fallback) {
    return fallback;
  }
  if (!purchase) {
    return null;
  }

  const handleSubmit = async () => {
    if (!product || isLoading || code.length === 0) {
      return;
    }
    try {
      await addBarcode({
        id: product.id,
        barcode: {
          code,
          container_size: Math.max(1, containerSize),
          label: label.trim(),
        },
      }).unwrap();
      toast.success(t("purchase.shop.assignSuccess", { name: product.name }), {
        autoClose: 1500,
      });
      navigate(`${shopPath}/scan/${encodeURIComponent(code)}`, {
        replace: true,
      });
    } catch (e) {
      toast.error(t("purchase.shop.assignError"));
      console.error(e);
    }
  };

  return (
    <ShopFormPage
      purchase={purchase}
      title={title}
      actions={
        <LoadingButton
          variant="contained"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!product}
          startIcon={<QrCode2Outlined />}
        >
          {t("purchase.shop.assignAction")}
        </LoadingButton>
      }
    >
      <Alert severity="info" sx={{ mb: 2 }}>
        {t("purchase.shop.assignHint", { code })}
      </Alert>
      <Autocomplete
        options={sortedProducts}
        loading={!products}
        value={product}
        filterOptions={productFilter}
        getOptionLabel={(option) => option.name}
        groupBy={(option) => option.category}
        noOptionsText={t("product.noProducts")}
        onChange={(e, value) => setProduct(value)}
        renderOption={(optionProps, option) => (
          <li {...optionProps} key={option.id}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                gap: 1,
              }}
            >
              <span>{option.name}</span>
              {barcodeSummary(option) ? (
                <Typography variant="caption" color="text.secondary">
                  {barcodeSummary(option)}
                </Typography>
              ) : null}
            </Box>
          </li>
        )}
        renderInput={(inputParams) => (
          <TextField
            {...inputParams}
            label={t("purchase.shop.searchProduct")}
            fullWidth
            autoFocus
          />
        )}
      />
      <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
        <TextField
          label={t("product.barcodeContainerSizeShort")}
          type="number"
          inputProps={{ min: 1, inputMode: "numeric" }}
          value={containerSize}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            setContainerSize(Number.isNaN(parsed) ? 1 : Math.max(1, parsed));
          }}
          onFocus={(e) => e.target.select()}
          sx={{ flex: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <StraightenOutlined />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label={t("product.barcodeLabel")}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t("product.barcodeLabelPlaceholder") ?? ""}
          sx={{ flex: 2 }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {t("product.barcodeContainerSizeHelp")}
      </Typography>
    </ShopFormPage>
  );
};
