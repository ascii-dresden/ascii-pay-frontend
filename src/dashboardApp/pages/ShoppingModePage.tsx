import React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import {
  ArrowBack,
  DeleteOutline,
  LockOutlined,
  OpenInNewOutlined,
  Search,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  ProductDto,
  PurchaseItemDto,
  ShoppingListItemDto,
} from "../../common/contracts";
import { BASE_URL } from "../../const";
import { stringAvatar } from "../../common/stringAvatar";
import { moneyToString } from "../../terminalApp/components/Money";
import {
  useGetPurchaseQuery,
  useUpdatePurchaseItemMutation,
} from "../redux/api/purchaseApi";
import { useGetAllProductsQuery } from "../redux/api/productApi";
import { useGetShoppingListQuery } from "../redux/api/shoppingListApi";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { usePageTitle } from "../components/usePageTitle";
import { useKeyboardWedge } from "../components/scanner/useKeyboardWedge";
import { PurchaseStateChip } from "../components/purchase/PurchaseStateChip";
import { usePurchaseHistory } from "../components/purchase/usePurchaseHistory";
import { useRemoveCartItem } from "../components/purchase/shop/useCartItemActions";
import { ShopLocationState } from "../components/purchase/shop/ShopFormPage";
import {
  ShoppingListGroupHeading,
  ShoppingListItemRow,
} from "../components/shoppingList/ShoppingListItemRow";
import {
  shoppingListItemName,
  shoppingListSecondary,
  groupShoppingList,
  shoppingListLastUnitCents,
} from "../components/shoppingList/shoppingListUtils";
import { useRemoveShoppingListItem } from "../components/shoppingList/useShoppingListActions";
import { useShoppingListCheckoff } from "../components/shoppingList/useShoppingListWish";
import {
  unitPriceCents,
  collectedItems,
  formatBestBefore,
  plannedItems,
  purchaseItemToSave,
  purchaseLabel,
  purchaseTotal,
} from "../components/purchase/purchaseUtils";
import {
  barcodeSearchText,
  barcodeSummary,
} from "../components/product/productBarcodeUtils";
import { purchaseItemDisplayName } from "../components/product/subProductUtils";

const BarcodeScanner = React.lazy(
  () => import("../components/scanner/BarcodeScanner")
);

type ShopTab = "scan" | "cart" | "list";

const productFilter = createFilterOptions<ProductDto>({
  stringify: (option) =>
    [option.name, option.nickname ?? "", barcodeSearchText(option)].join(" "),
});

/**
 * Shopping mode: scan tab (camera, manual code, product search), cart tab
 * and shopping list tab. Every interaction that needs a form navigates to a
 * dedicated sub-page below `/purchases/:id/shop/...`.
 */
export const ShoppingModePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const purchaseId = parseInt(params.purchaseId ?? "");
  const shopPath = `/purchases/${purchaseId}/shop`;

  const {
    isLoading,
    isError,
    error,
    data: purchase,
  } = useGetPurchaseQuery(purchaseId);
  const { data: products } = useGetAllProductsQuery();
  const { getLastPurchase, getLastPurchasesBySubProduct } =
    usePurchaseHistory();

  const [updateItem, updateState] = useUpdatePurchaseItemMutation();
  const removeItem = useRemoveCartItem(purchaseId);
  const removeWish = useRemoveShoppingListItem();
  const checkOffWishes = useShoppingListCheckoff();
  const [removingId, setRemovingId] = React.useState<number | null>(null);
  const [removingWishId, setRemovingWishId] = React.useState<number | null>(
    null
  );
  const busy =
    updateState.isLoading || removingId !== null || removingWishId !== null;

  const initialTab = (location.state as ShopLocationState | null)?.tab;
  const [tab, setTab] = React.useState<ShopTab>(initialTab ?? "scan");
  const [manualCode, setManualCode] = React.useState("");

  usePageTitle([t("layout.purchases"), t("purchase.shop.title")]);

  React.useEffect(() => {
    if (isError) {
      toast.error(t("purchase.shop.loadError"));
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const finalized = purchase?.state === "finalized";
  // Open entries of the shared shopping list are shown below the planned
  // items in the list tab.
  const { data: wishes } = useGetShoppingListQuery(
    { state: "open" },
    { skip: finalized }
  );
  const openWishes = React.useMemo(() => wishes ?? [], [wishes]);
  const cart = React.useMemo(
    () => (purchase ? collectedItems(purchase) : []),
    [purchase]
  );
  const planned = React.useMemo(
    () => (purchase ? plannedItems(purchase) : []),
    [purchase]
  );

  // Fall back to the cart tab if the list tab disappears.
  const listCount = planned.length + openWishes.length;
  React.useEffect(() => {
    if (tab === "list" && listCount === 0 && purchase) {
      setTab("cart");
    }
  }, [tab, listCount, purchase]);

  const handleCode = React.useCallback(
    (raw: string) => {
      const code = raw.trim();
      if (!code || !purchase || purchase.state === "finalized") {
        return;
      }
      navigate(`${shopPath}/scan/${encodeURIComponent(code)}`);
    },
    [purchase, shopPath, navigate]
  );

  useKeyboardWedge(handleCode, !!purchase && !finalized);

  const handleDelete = async (item: PurchaseItemDto) => {
    setRemovingId(item.id);
    try {
      await removeItem(item);
    } finally {
      setRemovingId(null);
    }
  };

  const handleCollectPlanned = async (item: PurchaseItemDto) => {
    const last = getLastPurchase(item.product?.id, {
      code: item.barcode,
      size: item.container_size,
      subProductId: item.sub_product_id ?? null,
    });
    try {
      await updateItem({
        id: purchaseId,
        itemId: item.id,
        item: {
          ...purchaseItemToSave(item),
          collected: true,
          container_count: item.container_count || 1,
          container_cents: item.container_cents || last?.container_cents || 0,
          container_size: item.container_size || last?.container_size || 1,
        },
      }).unwrap();
      toast.success(
        t("purchase.shop.added", { name: purchaseItemDisplayName(item) }),
        { autoClose: 1500 }
      );
      // The article is in the basket, so nobody else needs to buy it.
      checkOffWishes(purchaseId, {
        productId: item.product?.id ?? null,
        subProductId: item.sub_product_id ?? null,
        name: item.product?.name ?? item.name,
      });
    } catch (e) {
      toast.error(t("purchase.shop.error"));
      console.error(e);
    }
  };

  const plannedTarget = (item: PurchaseItemDto) =>
    item.product
      ? `${shopPath}/product/${item.product.id}`
      : `${shopPath}/item/${item.id}`;

  // Ticking a shopping list entry opens the add-to-cart page with `?wish=`;
  // the entry is ticked off once the article is in the cart.
  const wishTarget = (item: ShoppingListItemDto) =>
    item.product
      ? `${shopPath}/product/${item.product.id}?wish=${item.id}`
      : `${shopPath}/free?wish=${item.id}&name=${encodeURIComponent(
          shoppingListItemName(item)
        )}`;

  const handleDeleteWish = async (item: ShoppingListItemDto) => {
    setRemovingWishId(item.id);
    try {
      await removeWish(item);
    } finally {
      setRemovingWishId(null);
    }
  };

  const sortedProducts = React.useMemo(() => {
    const list = [...(products ?? [])];
    list.sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    );
    return list;
  }, [products]);

  if (isLoading || !purchase) {
    return <FullScreenLoader />;
  }

  const total = purchaseTotal(purchase);

  const header = (
    <Paper
      elevation={2}
      square
      sx={{
        // Sit right below the fixed AppBar of the Layout (toolbar height).
        position: "sticky",
        top: { xs: 56, sm: 64 },
        zIndex: 3,
        px: 1,
        py: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          component={Link}
          to={`/purchases/${purchaseId}`}
          aria-label="back"
        >
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {purchase.store || purchaseLabel(purchase)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: 0,
            }}
          >
            <PurchaseStateChip state={purchase.state} />
            {purchase.name && purchase.store ? (
              <Typography variant="caption" color="text.secondary" noWrap>
                {purchase.name}
              </Typography>
            ) : null}
          </Box>
        </Box>
        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
          <Typography variant="h6" lineHeight={1.2}>
            {moneyToString(total)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("purchase.shop.items", { count: cart.length })}
          </Typography>
        </Box>
        {!finalized ? (
          <Button
            variant="contained"
            size="medium"
            component={Link}
            to={`/purchases/${purchaseId}/finalize?returnTo=${encodeURIComponent(
              shopPath
            )}`}
            startIcon={<LockOutlined />}
            sx={{ flexShrink: 0, ml: 0.5 }}
          >
            {t("purchase.shop.finish")}
          </Button>
        ) : null}
      </Box>
    </Paper>
  );

  const renderCartRow = (item: PurchaseItemDto) => {
    const name = purchaseItemDisplayName(item);
    const secondary = [
      `${item.container_count} × ${moneyToString(item.container_cents)}`,
      `${t("purchase.item.container_size")} ${item.container_size}`,
      item.container_size > 1
        ? t("purchase.item.unitPriceShort", {
            price: moneyToString(
              unitPriceCents(item.container_cents, item.container_size)
            ),
          })
        : null,
      item.best_before
        ? `${t("purchase.item.best_before")} ${formatBestBefore(
            item.best_before
          )}`
        : null,
    ]
      .filter(Boolean)
      .join(" · ");
    return (
      <ListItem
        key={item.id}
        disablePadding
        secondaryAction={
          !finalized ? (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(item)}
              disabled={busy}
            >
              <DeleteOutline />
            </IconButton>
          ) : undefined
        }
      >
        <ListItemButton
          component={Link}
          to={`${shopPath}/item/${item.id}`}
          disabled={finalized}
          sx={{ pr: finalized ? 2 : 7 }}
        >
          <ListItemAvatar>
            <Avatar
              alt={name}
              src={
                item.product
                  ? `${BASE_URL}/product/${item.product.id}/image`
                  : undefined
              }
              variant="rounded"
              {...stringAvatar(name)}
            />
          </ListItemAvatar>
          <ListItemText
            primary={name}
            secondary={secondary}
            primaryTypographyProps={{ noWrap: true }}
            secondaryTypographyProps={{ noWrap: true }}
          />
          <Typography sx={{ ml: 1, whiteSpace: "nowrap" }}>
            {moneyToString(item.container_count * item.container_cents)}
          </Typography>
        </ListItemButton>
      </ListItem>
    );
  };

  const renderPlannedRow = (item: PurchaseItemDto) => {
    const name = purchaseItemDisplayName(item);
    return (
      <ListItem
        key={item.id}
        disablePadding
        secondaryAction={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={false}
              disabled={busy}
              onChange={() => handleCollectPlanned(item)}
              inputProps={{
                "aria-label": t("purchase.item.collected") ?? "",
              }}
            />
            <IconButton
              edge="end"
              aria-label={t("purchase.shop.removeFromList") ?? "remove"}
              title={t("purchase.shop.removeFromList") ?? undefined}
              onClick={() => handleDelete(item)}
              disabled={busy}
            >
              <DeleteOutline />
            </IconButton>
          </Box>
        }
      >
        <ListItemButton
          component={Link}
          to={plannedTarget(item)}
          sx={{ pr: 12 }}
        >
          <ListItemAvatar>
            <Avatar
              alt={name}
              src={
                item.product
                  ? `${BASE_URL}/product/${item.product.id}/image`
                  : undefined
              }
              variant="rounded"
              {...stringAvatar(name)}
            />
          </ListItemAvatar>
          <ListItemText
            primary={name}
            secondary={`${item.container_count} × ${t(
              "purchase.item.container_size"
            )} ${item.container_size}${
              item.container_cents
                ? ` · ${moneyToString(item.container_cents)}`
                : ""
            }`}
            primaryTypographyProps={{ noWrap: true }}
            secondaryTypographyProps={{ noWrap: true }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const cartView = (
    <Paper elevation={1} sx={{ mt: 2 }}>
      {cart.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            {t("purchase.shop.cartEmpty")}
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {cart.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 ? <Divider component="li" /> : null}
              {renderCartRow(item)}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );

  const listView = (
    <Paper elevation={1} sx={{ mt: 2 }}>
      {listCount === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            {t("purchase.shop.listEmpty")}
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {planned.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 ? <Divider component="li" /> : null}
              {renderPlannedRow(item)}
            </React.Fragment>
          ))}
          {openWishes.length > 0 ? (
            <>
              {planned.length > 0 ? <Divider component="li" /> : null}
              <ListSubheader disableSticky>
                {t("shoppingList.shop.subheader")}
              </ListSubheader>
              {groupShoppingList(openWishes).map((row, index) => {
                const renderWish = (
                  item: ShoppingListItemDto,
                  nested: boolean
                ) => (
                  <ShoppingListItemRow
                    key={item.id}
                    item={item}
                    nested={nested}
                    secondary={shoppingListSecondary(t, item)}
                    unitCents={
                      nested
                        ? shoppingListLastUnitCents(
                            item,
                            getLastPurchasesBySubProduct
                          )
                        : undefined
                    }
                    to={wishTarget(item)}
                    onDone={() => navigate(wishTarget(item))}
                    onDelete={() => handleDeleteWish(item)}
                    busy={busy}
                  />
                );
                return (
                  <React.Fragment
                    key={
                      row.kind === "item"
                        ? `wish-${row.item.id}`
                        : `wish-group-${row.product.id}`
                    }
                  >
                    {index > 0 ? <Divider component="li" /> : null}
                    {row.kind === "item" ? (
                      renderWish(row.item, false)
                    ) : (
                      <>
                        <ShoppingListGroupHeading product={row.product} />
                        {row.items.map((item) => renderWish(item, true))}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </>
          ) : null}
        </List>
      )}
    </Paper>
  );

  const scanView = (
    <Box sx={{ mt: 2 }}>
      <React.Suspense
        fallback={
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        }
      >
        <BarcodeScanner
          onDetected={handleCode}
          active={tab === "scan" && !finalized}
        />
      </React.Suspense>
      <TextField
        label={t("purchase.shop.manualCode")}
        fullWidth
        sx={{ mt: 2 }}
        value={manualCode}
        autoComplete="off"
        onChange={(e) => setManualCode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const code = manualCode;
            setManualCode("");
            handleCode(code);
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label="lookup"
                disabled={manualCode.trim().length === 0}
                onClick={() => {
                  const code = manualCode;
                  setManualCode("");
                  handleCode(code);
                }}
              >
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <FormHelperText>{t("purchase.shop.manualCodeHelp")}</FormHelperText>
      <Autocomplete
        sx={{ mt: 2 }}
        options={sortedProducts}
        loading={!products}
        value={null}
        blurOnSelect
        clearOnBlur
        filterOptions={productFilter}
        getOptionLabel={(option) => option.name}
        groupBy={(option) => option.category}
        noOptionsText={t("product.noProducts")}
        onChange={(e, product) => {
          if (product) {
            navigate(`${shopPath}/product/${product.id}`);
          }
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
          />
        )}
      />
      {planned.length > 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: "center" }}
        >
          {t("purchase.shop.uncollectedHint", { count: planned.length })}
        </Typography>
      ) : null}
    </Box>
  );

  return (
    <>
      {header}
      <Container maxWidth="sm" sx={{ pb: 6, px: { xs: 1, sm: 2 } }}>
        {finalized ? (
          <>
            <Alert
              severity="info"
              icon={<LockOutlined />}
              sx={{ mt: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  component={Link}
                  to={`/purchases/${purchaseId}`}
                  endIcon={<OpenInNewOutlined />}
                >
                  {t("purchase.shop.toDetails")}
                </Button>
              }
            >
              {t("purchase.shop.finalizedNotice")}
            </Alert>
            {cartView}
          </>
        ) : (
          <>
            <Tabs
              value={tab}
              onChange={(e, v) => setTab(v as ShopTab)}
              variant="fullWidth"
              sx={{ mt: 1 }}
            >
              <Tab value="scan" label={t("purchase.shop.tabs.scan")} />
              <Tab
                value="cart"
                label={`${t("purchase.shop.tabs.cart")} (${cart.length})`}
              />
              {listCount > 0 ? (
                <Tab
                  value="list"
                  label={`${t("purchase.shop.tabs.list")} (${listCount})`}
                />
              ) : null}
            </Tabs>
            {tab === "scan" ? scanView : null}
            {tab === "cart" ? cartView : null}
            {tab === "list" ? listView : null}
          </>
        )}
      </Container>
    </>
  );
};
