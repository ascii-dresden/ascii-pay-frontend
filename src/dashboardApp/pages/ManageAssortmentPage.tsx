import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  ListSubheader,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AddCircleOutline, RemoveCircleOutline, Search } from "@mui/icons-material";
import { useGetAllProductsQuery } from "../redux/api/productApi";
import { useUpdateInventoryProductsMutation } from "../redux/api/inventoryApi";
import { ProductDto, UpdateInventoryProductDto } from "../../common/contracts";
import { usePageTitle } from "../components/usePageTitle";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { FormPage } from "../components/FormPage";
import { PageHeaderNavigation } from "../components/PageHeader";
import { ProductAvatar } from "../components/product/ProductAvatar";
import { QuantityField } from "../components/inventory/QuantityField";
import { barcodeSearchText } from "../components/product/productBarcodeUtils";

type AssortmentState = { stocked: boolean; target_quantity: number };

const addFilterOptions = createFilterOptions<ProductDto>({
  stringify: (option) =>
    [option.name, option.nickname ?? "", barcodeSearchText(option)].join(" "),
});

const byName = (a: ProductDto, b: ProductDto) => a.name.localeCompare(b.name);
const byCategoryAndName = (a: ProductDto, b: ProductDto) =>
  a.category.localeCompare(b.category) || byName(a, b);

/**
 * Assortment management: lists the stocked products grouped by category
 * with their target quantity and lets the user add products via a search
 * box. Every change is saved immediately.
 */
export const ManageAssortmentPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useGetAllProductsQuery();
  const [updateInventoryProducts] = useUpdateInventoryProductsMutation();

  const [filter, setFilter] = React.useState("");
  // Optimistic overrides applied on top of the server data so that the list
  // reacts instantly; removed again when a save fails.
  const [overrides, setOverrides] = React.useState<
    Record<number, AssortmentState>
  >({});
  const [pending, setPending] = React.useState<Record<number, boolean>>({});
  const [highlightId, setHighlightId] = React.useState<number | null>(null);
  const rowRefs = React.useRef<Record<number, HTMLDivElement | null>>({});

  usePageTitle([t("layout.inventory"), t("inventory.assortment.title")]);

  useEffect(() => {
    if (isError) {
      toast.error("Could not load products!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Scroll a freshly added product into view once it is rendered.
  useEffect(() => {
    if (highlightId === null) {
      return;
    }
    const el = rowRefs.current[highlightId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const timer = window.setTimeout(() => setHighlightId(null), 2500);
    return () => window.clearTimeout(timer);
  }, [highlightId]);

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.inventory"),
      target: "/inventory",
    },
    {
      label: t("inventory.assortment.title"),
      target: "/inventory/assortment",
    },
  ];

  if (isLoading || products === undefined) {
    return <FullScreenLoader />;
  }

  const current = (product: ProductDto): AssortmentState =>
    overrides[product.id] ?? {
      stocked: product.stocked,
      target_quantity: product.target_quantity,
    };

  const save = async (
    product: ProductDto,
    next: AssortmentState,
    onSuccess?: () => void
  ) => {
    const previous = current(product);
    setOverrides((prev) => ({ ...prev, [product.id]: next }));
    setPending((prev) => ({ ...prev, [product.id]: true }));
    const dto: UpdateInventoryProductDto = { product_id: product.id, ...next };
    try {
      await updateInventoryProducts([dto]).unwrap();
      onSuccess?.();
    } catch (e) {
      setOverrides((prev) => ({ ...prev, [product.id]: previous }));
      toast.error(t("inventory.saveError"));
      console.error(e);
    } finally {
      setPending((prev) => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
    }
  };

  const handleAdd = (product: ProductDto) => {
    const target = product.target_quantity > 0 ? product.target_quantity : 0;
    setFilter("");
    save(product, { stocked: true, target_quantity: target }, () => {
      toast.success(
        t("inventory.assortment.addedToast", { name: product.name })
      );
    });
    setHighlightId(product.id);
  };

  const handleRemove = (product: ProductDto) => {
    const previous = current(product);
    save(product, { stocked: false, target_quantity: 0 }, () => {
      toast.info(
        ({ closeToast }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <span>
              {t("inventory.assortment.removedToast", { name: product.name })}
            </span>
            <Button
              size="small"
              color="inherit"
              sx={{ flexShrink: 0, fontWeight: "bold" }}
              onClick={() => {
                closeToast?.();
                save(product, previous, () => setHighlightId(product.id));
              }}
            >
              {t("inventory.assortment.undo")}
            </Button>
          </Box>
        ),
        { autoClose: 8000, closeOnClick: false }
      );
    });
  };

  const handleTargetChange = (product: ProductDto, target_quantity: number) => {
    const state = current(product);
    if (state.target_quantity === target_quantity) {
      return;
    }
    save(product, { ...state, target_quantity });
  };

  const stocked = products.filter((p) => current(p).stocked);
  const notStocked = products
    .filter((p) => !current(p).stocked)
    .sort(byCategoryAndName);

  const needle = filter.trim().toLowerCase();
  const filtered =
    needle.length === 0
      ? stocked
      : stocked.filter(
          (p) =>
            p.name.toLowerCase().includes(needle) ||
            (p.nickname ?? "").toLowerCase().includes(needle) ||
            barcodeSearchText(p).toLowerCase().includes(needle) ||
            p.category.toLowerCase().includes(needle)
        );

  const groups = new Map<string, ProductDto[]>();
  for (const p of filtered) {
    const list = groups.get(p.category) ?? [];
    list.push(p);
    groups.set(p.category, list);
  }
  const categories = Array.from(groups.keys()).sort((a, b) =>
    a.localeCompare(b)
  );
  for (const list of groups.values()) {
    list.sort(byName);
  }

  const categoryLabel = (category: string) =>
    category.length > 0 ? category : t("inventory.assortment.uncategorized");

  return (
    <FormPage
      title={t("inventory.assortment.title")}
      subtitle={t("inventory.assortment.stockedCount", {
        count: stocked.length,
      })}
      navigation={navigation}
      backTo="/inventory"
      disableContentPadding
      actions={
        <Button variant="contained" onClick={() => navigate("/inventory")}>
          {t("inventory.assortment.done")}
        </Button>
      }
    >
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Autocomplete<ProductDto, false, false, false>
          options={notStocked}
          value={null}
          onChange={(_, product) => {
            if (product) {
              handleAdd(product);
            }
          }}
          blurOnSelect
          clearOnBlur
          autoHighlight
          filterOptions={addFilterOptions}
          groupBy={(option) => categoryLabel(option.category)}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          noOptionsText={
            notStocked.length === 0
              ? t("inventory.assortment.allAdded")
              : t("inventory.assortment.noProducts")
          }
          renderOption={(optionProps, option) => (
            <li {...optionProps} key={option.id}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}
              >
                <ProductAvatar product={option} size={32} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap>{option.name}</Typography>
                  {option.nickname ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      display="block"
                    >
                      {option.nickname}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("inventory.assortment.addProduct")}
              placeholder={t("inventory.assortment.addProductHint") ?? ""}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start" sx={{ ml: 0.5 }}>
                      <AddCircleOutline color="primary" />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        {stocked.length > 0 && (
          <TextField
            size="small"
            fullWidth
            placeholder={t("inventory.assortment.search") ?? ""}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            inputProps={{ "aria-label": t("inventory.assortment.search") ?? "" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        )}
      </Box>
      {categories.length === 0 ? (
        <Typography sx={{ p: 3 }} color="text.secondary" align="center">
          {stocked.length === 0
            ? t("inventory.assortment.empty")
            : t("inventory.assortment.noProducts")}
        </Typography>
      ) : (
        categories.map((category) => (
          <Box key={category}>
            <ListSubheader sx={{ bgcolor: "background.paper" }}>
              {categoryLabel(category)}
            </ListSubheader>
            {(groups.get(category) ?? []).map((product) => {
              const state = current(product);
              const isPending = pending[product.id] === true;
              const isHighlighted = highlightId === product.id;
              return (
                <Box
                  key={product.id}
                  ref={(el: HTMLDivElement | null) => {
                    rowRefs.current[product.id] = el;
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pl: 2,
                    pr: 1,
                    py: 0.75,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    bgcolor: isHighlighted ? "action.selected" : undefined,
                    transition: theme.transitions.create("background-color", {
                      duration: theme.transitions.duration.standard,
                    }),
                  }}
                >
                  <ProductAvatar product={product} />
                  <Box sx={{ flexGrow: 1, minWidth: 0, ml: 0.5 }}>
                    <Typography noWrap>{product.name}</Typography>
                    {product.nickname ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        display="block"
                      >
                        {product.nickname}
                      </Typography>
                    ) : null}
                  </Box>
                  {isPending && <CircularProgress size={16} />}
                  <QuantityField
                    value={state.target_quantity}
                    onChange={(n) => handleTargetChange(product, n)}
                    width={84}
                    ariaLabel={t("product.targetQuantity") ?? ""}
                  />
                  <Tooltip title={t("inventory.assortment.remove")}>
                    <span>
                      <IconButton
                        aria-label={t("inventory.assortment.remove") ?? ""}
                        onClick={() => handleRemove(product)}
                        disabled={isPending}
                      >
                        <RemoveCircleOutline />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              );
            })}
          </Box>
        ))
      )}
    </FormPage>
  );
};
