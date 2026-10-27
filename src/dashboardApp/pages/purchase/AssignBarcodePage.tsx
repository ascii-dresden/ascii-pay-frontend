import React from "react";
import {
  Alert,
  Autocomplete,
  Box,
  createFilterOptions,
  InputAdornment,
  MenuItem,
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
  useAddSubProductMutation,
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
import { selectableSubProducts } from "../../components/product/subProductUtils";

const NEW_SUB_PRODUCT = "new";

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
  const [addBarcode, { isLoading: addingBarcode }] =
    useAddProductBarcodeMutation();
  const [addSubProduct, { isLoading: addingSubProduct }] =
    useAddSubProductMutation();
  const isLoading = addingBarcode || addingSubProduct;

  const [product, setProduct] = React.useState<ProductDto | null>(null);
  const [containerSize, setContainerSize] = React.useState(1);
  const [label, setLabel] = React.useState("");
  // Which sub product the code belongs to: none (the product itself), an
  // existing one, or a new one created together with the code.
  const [subProductChoice, setSubProductChoice] = React.useState<
    number | typeof NEW_SUB_PRODUCT | null
  >(null);
  const [newSubProductName, setNewSubProductName] = React.useState("");
  const subProductOptions = selectableSubProducts(product);
  const needsNewName =
    subProductChoice === NEW_SUB_PRODUCT &&
    newSubProductName.trim().length === 0;

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
    if (!product || isLoading || code.length === 0 || needsNewName) {
      return;
    }
    try {
      let subProductId: number | null =
        subProductChoice === NEW_SUB_PRODUCT ? null : subProductChoice;
      if (subProductChoice === NEW_SUB_PRODUCT) {
        const created = await addSubProduct({
          id: product.id,
          subProduct: { name: newSubProductName.trim() },
        }).unwrap();
        subProductId = created.id;
      }
      await addBarcode({
        id: product.id,
        barcode: {
          code,
          container_size: Math.max(1, containerSize),
          label: label.trim(),
          sub_product_id: subProductId,
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
          disabled={!product || needsNewName}
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
        onChange={(e, value) => {
          setProduct(value);
          setSubProductChoice(null);
        }}
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
      {product ? (
        <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
          <TextField
            select
            label={t("product.barcodeSubProduct")}
            value={subProductChoice ?? ""}
            onChange={(e) => {
              const raw = e.target.value as unknown as
                | number
                | typeof NEW_SUB_PRODUCT
                | "";
              setSubProductChoice(
                raw === "" ? null : raw === NEW_SUB_PRODUCT ? raw : Number(raw)
              );
            }}
            sx={{ flex: "1 1 12rem" }}
          >
            <MenuItem value="">
              <em>
                {t("product.barcodeSubProductNone", { name: product.name })}
              </em>
            </MenuItem>
            {subProductOptions.map((sub) => (
              <MenuItem key={sub.id} value={sub.id}>
                {sub.name}
              </MenuItem>
            ))}
            <MenuItem value={NEW_SUB_PRODUCT}>
              {t("purchase.shop.assignNewSubProduct")}
            </MenuItem>
          </TextField>
          {subProductChoice === NEW_SUB_PRODUCT ? (
            <TextField
              label={t("product.subProductName")}
              value={newSubProductName}
              onChange={(e) => setNewSubProductName(e.target.value)}
              autoFocus
              required
              sx={{ flex: "1 1 12rem" }}
            />
          ) : null}
        </Box>
      ) : null}
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
