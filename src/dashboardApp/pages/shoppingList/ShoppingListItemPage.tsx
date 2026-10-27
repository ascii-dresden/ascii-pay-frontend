import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { LoadingButton } from "@mui/lab";
import {
  DeleteOutline,
  LinkOutlined,
  PlaylistAddOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  ProductDto,
  SaveShoppingListItemDto,
  ShoppingListItemDto,
  SubProductDto,
} from "../../../common/contracts";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import {
  useCreateShoppingListItemMutation,
  useGetShoppingListItemQuery,
  useUpdateShoppingListItemMutation,
} from "../../redux/api/shoppingListApi";
import { useDashboardSelector } from "../../redux/dashboardStore";
import { usePageTitle } from "../../components/usePageTitle";
import { FullScreenLoader } from "../../components/FullScreenLoader";
import { FormPage, useReturnTo } from "../../components/FormPage";
import { PageHeaderNavigation } from "../../components/PageHeader";
import { ProductAvatar } from "../../components/product/ProductAvatar";
import { NumberStepper } from "../../components/purchase/shop/CartItemForm";
import {
  canEditShoppingListItem,
  shoppingListItemName,
} from "../../components/shoppingList/shoppingListUtils";
import { useRemoveShoppingListItem } from "../../components/shoppingList/useShoppingListActions";
import { shoppingListNavigation } from "./ShoppingListPage";
import {
  findSubProduct,
  productDisplayName,
  selectableSubProducts,
} from "../../components/product/subProductUtils";
import {
  barcodeSearchText,
  barcodeSummary,
} from "../../components/product/productBarcodeUtils";

/**
 * What can be put on the list: a product, or one of its sub products. A
 * product with active sub products is only a category and is not offered on
 * its own.
 */
type ArticleOption = {
  key: string;
  product: ProductDto;
  sub: SubProductDto | null;
};

const articleOptions = (products: ProductDto[]): ArticleOption[] =>
  products.flatMap((product): ArticleOption[] => {
    const subs = selectableSubProducts(product);
    return subs.length === 0
      ? [{ key: `p${product.id}`, product, sub: null }]
      : subs.map((sub) => ({ key: `s${sub.id}`, product, sub }));
  });

const articleLabel = (option: ArticleOption): string =>
  option.sub
    ? `${option.product.name} › ${option.sub.name}`
    : option.product.name;

const articleFilter = createFilterOptions<ArticleOption>({
  stringify: (option) =>
    [
      option.product.name,
      option.sub?.name ?? "",
      option.product.nickname ?? "",
      option.sub
        ? option.product.barcodes
            .filter((b) => b.sub_product_id === option.sub?.id)
            .map((b) => b.code)
            .join(" ")
        : barcodeSearchText(option.product),
    ].join(" "),
});

type FormState = {
  product: ProductDto | null;
  /** Specific sub product of `product`; null = any of them. */
  subProductId: number | null;
  name: string;
  quantity: number;
  note: string;
};

const emptyForm: FormState = {
  product: null,
  subProductId: null,
  name: "",
  quantity: 1,
  note: "",
};

const formFromItem = (item: ShoppingListItemDto): FormState => ({
  product: item.product,
  subProductId: item.sub_product_id ?? null,
  name: item.name,
  quantity: Math.max(1, item.quantity),
  note: item.note,
});

const formToSave = (form: FormState): SaveShoppingListItemDto => ({
  // Linked entries are named after the product; the sub product is its own field.
  name: form.product ? form.product.name : form.name.trim(),
  quantity: Math.max(1, form.quantity),
  note: form.note.trim(),
  product_id: form.product?.id ?? null,
  sub_product_id: form.product ? form.subProductId : null,
});

const canSubmit = (form: FormState): boolean =>
  form.quantity >= 1 && (form.name.trim().length > 0 || form.product !== null);

/**
 * Create (`/shopping-list/new`) and edit (`/shopping-list/:itemId/edit`)
 * page for a shopping list entry. The product picker links a product from
 * the assortment; free text creates an entry without a product.
 */
export const ShoppingListItemPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const isNew = params.itemId === undefined;
  const itemId = parseInt(params.itemId ?? "");
  const returnTo = useReturnTo("/shopping-list");

  const user = useDashboardSelector((state) => state.userState.user);

  const {
    data: item,
    isLoading,
    isError,
    error,
  } = useGetShoppingListItemQuery(itemId, { skip: isNew });
  const { data: products } = useGetAllProductsQuery();
  const [createItem, createState] = useCreateShoppingListItemMutation();
  const [updateItem, updateState] = useUpdateShoppingListItemMutation();
  const removeItem = useRemoveShoppingListItem();
  const [removing, setRemoving] = React.useState(false);
  const saving = createState.isLoading || updateState.isLoading;
  const busy = saving || removing;

  const [form, setForm] = React.useState<FormState>(emptyForm);
  const dirtyRef = React.useRef(false);
  const update = (patch: Partial<FormState>) => {
    dirtyRef.current = true;
    setForm((prev) => ({ ...prev, ...patch }));
  };

  // Prefill once the entry has loaded (as long as nothing was typed yet).
  React.useEffect(() => {
    if (item && !dirtyRef.current) {
      setForm(formFromItem(item));
    }
  }, [item]);

  React.useEffect(() => {
    if (isError) {
      toast.error(t("shoppingList.loadError"));
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const title = isNew
    ? t("shoppingList.form.newTitle")
    : t("shoppingList.form.editTitle");
  usePageTitle([t("shoppingList.title"), title]);

  const navigation: PageHeaderNavigation[] = [
    ...shoppingListNavigation(t),
    {
      label: isNew ? title : item ? shoppingListItemName(item) : title,
      target: isNew ? "/shopping-list/new" : `/shopping-list/${itemId}/edit`,
    },
  ];

  const sortedOptions = React.useMemo(() => {
    const list = [...(products ?? [])];
    list.sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    );
    return articleOptions(list);
  }, [products]);
  // The current choice as an option (also for an entry whose sub product was
  // deactivated or that names the product of an older entry).
  const selectedOption: ArticleOption | null = form.product
    ? sortedOptions.find(
        (o) =>
          o.product.id === form.product?.id &&
          (o.sub?.id ?? null) === form.subProductId
      ) ?? {
        key: `current-${form.product.id}-${form.subProductId ?? "p"}`,
        product: form.product,
        sub: findSubProduct(form.product, form.subProductId),
      }
    : null;

  if (!isNew && (isLoading || (!item && !isError))) {
    return <FullScreenLoader />;
  }

  if (!isNew && (isError || !item)) {
    return (
      <FormPage title={title} navigation={navigation} backTo={returnTo}>
        <Alert severity="error">{t("shoppingList.form.notFound")}</Alert>
      </FormPage>
    );
  }

  const editable =
    isNew || (item ? canEditShoppingListItem(user, item) : false);
  const alreadyDone = !isNew && !!item?.done_at;

  const handleSubmit = async () => {
    if (busy || !canSubmit(form) || !editable || alreadyDone) {
      return;
    }
    const body = formToSave(form);
    try {
      if (isNew) {
        await createItem(body).unwrap();
        toast.success(t("shoppingList.form.created", { name: body.name }), {
          autoClose: 2000,
        });
      } else {
        await updateItem({ id: itemId, body }).unwrap();
        toast.success(t("shoppingList.form.updated"), { autoClose: 2000 });
      }
      navigate(returnTo, { replace: true });
    } catch (e) {
      toast.error(t("shoppingList.form.saveError"));
      console.error(e);
    }
  };

  const handleRemove = async () => {
    if (!item || busy) {
      return;
    }
    setRemoving(true);
    const removed = await removeItem(item);
    if (removed) {
      navigate(returnTo, { replace: true });
    } else {
      setRemoving(false);
    }
  };

  const linkStatus = form.product ? (
    <Chip
      color="primary"
      variant="outlined"
      avatar={
        <Box sx={{ display: "flex", ml: 0.5 }}>
          <ProductAvatar product={form.product} size={24} />
        </Box>
      }
      label={t("shoppingList.form.linkedProduct", {
        name: productDisplayName(form.product, form.subProductId),
      })}
      onDelete={
        busy ? undefined : () => update({ product: null, subProductId: null })
      }
      sx={{ maxWidth: "100%" }}
    />
  ) : form.name.trim().length > 0 ? (
    <Chip
      variant="outlined"
      icon={<LinkOutlined />}
      label={t("shoppingList.form.freeText")}
      sx={{ maxWidth: "100%" }}
    />
  ) : null;

  return (
    <FormPage
      title={title}
      navigation={navigation}
      backTo={returnTo}
      actions={
        <>
          <Button variant="outlined" component={Link} to={returnTo}>
            {t("shoppingList.form.cancel")}
          </Button>
          {!isNew && editable ? (
            <Button
              variant="outlined"
              color="error"
              onClick={handleRemove}
              disabled={busy}
              startIcon={<DeleteOutline />}
            >
              {t("shoppingList.form.remove")}
            </Button>
          ) : null}
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={saving}
            disabled={!canSubmit(form) || removing || !editable || alreadyDone}
            startIcon={isNew ? <PlaylistAddOutlined /> : <SaveOutlined />}
          >
            {isNew ? t("shoppingList.form.add") : t("shoppingList.form.save")}
          </LoadingButton>
        </>
      }
    >
      <Stack spacing={2}>
        {!editable ? (
          <Alert severity="info">{t("shoppingList.form.forbidden")}</Alert>
        ) : null}
        {alreadyDone ? (
          <Alert severity="info">{t("shoppingList.form.alreadyDone")}</Alert>
        ) : null}
        <Box>
          <Autocomplete<ArticleOption, false, false, true>
            freeSolo
            options={sortedOptions}
            loading={!products}
            disabled={busy || !editable || alreadyDone}
            value={selectedOption}
            inputValue={form.name}
            filterOptions={articleFilter}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : articleLabel(option)
            }
            isOptionEqualToValue={(option, value) => option.key === value.key}
            groupBy={(option) => option.product.category}
            noOptionsText={t("product.noProducts")}
            onChange={(e, value) => {
              if (value === null) {
                update({ product: null, subProductId: null, name: "" });
              } else if (typeof value === "string") {
                update({ product: null, subProductId: null, name: value });
              } else {
                update({
                  product: value.product,
                  subProductId: value.sub?.id ?? null,
                  name: articleLabel(value),
                });
              }
            }}
            onInputChange={(e, value, reason) => {
              if (reason === "input") {
                // Typing detaches the product; the text becomes the name.
                update({ name: value, product: null, subProductId: null });
              } else if (reason === "clear") {
                update({ name: "", product: null, subProductId: null });
              }
            }}
            renderOption={(optionProps, option) => (
              <li {...optionProps} key={option.key}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  <ProductAvatar product={option.product} size={32} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap>
                      {option.sub ? (
                        <>
                          <Typography component="span" color="text.secondary">
                            {option.product.name} ›{" "}
                          </Typography>
                          {option.sub.name}
                        </>
                      ) : (
                        option.product.name
                      )}
                    </Typography>
                    {option.product.nickname ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        component="div"
                      >
                        {option.product.nickname}
                      </Typography>
                    ) : null}
                  </Box>
                  {!option.sub && barcodeSummary(option.product) ? (
                    <Typography variant="caption" color="text.secondary">
                      {barcodeSummary(option.product)}
                    </Typography>
                  ) : null}
                </Box>
              </li>
            )}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                label={t("shoppingList.form.product")}
                helperText={t("shoppingList.form.productHelp")}
                fullWidth
                autoFocus={isNew}
              />
            )}
          />
          {linkStatus ? <Box sx={{ mt: 1 }}>{linkStatus}</Box> : null}
        </Box>
        <NumberStepper
          label={t("shoppingList.form.quantity")}
          value={form.quantity}
          min={1}
          disabled={busy || !editable || alreadyDone}
          onChange={(quantity) => update({ quantity })}
        />
        <TextField
          label={t("shoppingList.form.note")}
          fullWidth
          multiline
          minRows={2}
          disabled={busy || !editable || alreadyDone}
          value={form.note}
          onChange={(e) => update({ note: e.target.value })}
        />
      </Stack>
    </FormPage>
  );
};
