import React from "react";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  AddShoppingCartOutlined,
  PlaylistRemoveOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  ProductBarcodeDto,
  ProductDto,
  PurchaseDto,
} from "../../../../common/contracts";
import {
  useAddPurchaseItemMutation,
  useUpdatePurchaseItemMutation,
} from "../../../redux/api/purchaseApi";
import { FullScreenLoader } from "../../FullScreenLoader";
import { usePurchaseHistory } from "../usePurchaseHistory";
import {
  canSubmitCartItemForm,
  CartItemForm,
  cartItemFormFromItem,
  CartItemFormState,
  cartItemFormToSave,
  CartItemHeader,
} from "./CartItemForm";
import { ShopFormPage, ShopLocationState } from "./ShopFormPage";
import { useIncrementCartItem, useRemoveCartItem } from "./useCartItemActions";
import { useShoppingListWish } from "../../shoppingList/useShoppingListWish";

/** The scanned variant decides the container size, over anything from history. */
const withVariantSize = (
  form: CartItemFormState,
  variantSize: number | null
): CartItemFormState =>
  variantSize === null ? form : { ...form, size: variantSize };

/**
 * Add-to-cart page body for a registered product. Merge rules:
 * - a planned row for the product exists: the form collects that row (PUT).
 *   Planned rows match on the product alone — they mean "we need N units of
 *   this article", so any variant collects them and overwrites size and price;
 * - otherwise a collected row **of the same container size** exists: its count
 *   is incremented right away (with undo toast) and the user is sent back to
 *   the cart. Sizes are kept apart so scanning the crate does not increment the
 *   single-bottle row;
 * - otherwise a new row is created (POST).
 *
 * Either way the article is ticked off the shared shopping list afterwards.
 */
export const AddProductToCart = (props: {
  purchase: PurchaseDto;
  product: ProductDto;
  barcode: string | null;
  /** The scanned variant, when the code is one of the product's barcodes. */
  variant?: ProductBarcodeDto | null;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { purchase, product, barcode, variant } = props;
  const shopPath = `/purchases/${purchase.id}/shop`;
  const cartState: ShopLocationState = { tab: "cart" };

  const { getLastPurchase } = usePurchaseHistory();
  // Price and size come from the last purchase of *this* variant when we know
  // which one was scanned.
  const last = getLastPurchase(product.id, {
    code: barcode ?? variant?.code ?? null,
    size: variant?.container_size ?? null,
  });
  const variantSize = variant?.container_size ?? null;
  // Opened from a shopping list entry (`?wish=`): prefill its quantity. Once
  // the article is in the cart, that entry and every other open entry for the
  // same product are ticked off the shared shopping list.
  const { wish, completeWish } = useShoppingListWish();
  const checkedOffArticle = { productId: product.id, name: product.name };

  const plannedItem =
    purchase.items.find((i) => i.product?.id === product.id && !i.collected) ??
    null;
  const existing =
    purchase.items.find(
      (i) =>
        i.product?.id === product.id &&
        i.collected &&
        (variantSize === null || i.container_size === variantSize)
    ) ?? null;
  const incrementExisting = !plannedItem && !!existing;

  const incrementItem = useIncrementCartItem(purchase.id);
  const removeItem = useRemoveCartItem(purchase.id);
  const [removing, setRemoving] = React.useState(false);
  const [addItem, addState] = useAddPurchaseItemMutation();
  const [updateItem, updateState] = useUpdatePurchaseItemMutation();
  const busy = addState.isLoading || updateState.isLoading || removing;

  // Planned row exists but the store does not have the article: drop it
  // from the shopping list (undo toast re-adds it).
  const handleRemoveFromList = async () => {
    if (!plannedItem || busy) {
      return;
    }
    setRemoving(true);
    const removed = await removeItem(plannedItem);
    if (removed) {
      navigate(shopPath, { replace: true, state: { tab: "list" } });
    } else {
      setRemoving(false);
    }
  };

  const [form, setForm] = React.useState<CartItemFormState>(() =>
    withVariantSize(
      cartItemFormFromItem(plannedItem, last, product.name),
      variantSize
    )
  );
  const dirtyRef = React.useRef(false);
  const handleChange = (value: CartItemFormState) => {
    dirtyRef.current = true;
    setForm(value);
  };

  // The purchase history may arrive after the first render; refresh the
  // prefilled price and size as long as the user has not typed anything.
  const lastKey = last ? `${last.purchaseId}` : "";
  React.useEffect(() => {
    if (!dirtyRef.current) {
      const next = withVariantSize(
        cartItemFormFromItem(plannedItem, last, product.name),
        variantSize
      );
      if (!plannedItem && wish && wish.quantity > 0) {
        next.count = wish.quantity;
      }
      setForm(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastKey, plannedItem?.id, product.id, wish?.id, variantSize]);

  // Set as soon as the form is submitted: once we have written the row
  // ourselves, the refreshed cart contains a matching collected row and the
  // auto-increment below would count the same article a second time.
  const submittedRef = React.useRef(false);
  const incrementedRef = React.useRef(false);
  React.useEffect(() => {
    if (
      incrementExisting &&
      existing &&
      !incrementedRef.current &&
      !submittedRef.current
    ) {
      incrementedRef.current = true;
      incrementItem(existing)
        .then((ok) => {
          if (ok) {
            completeWish(purchase.id, checkedOffArticle);
          }
        })
        .finally(() => navigate(shopPath, { replace: true, state: cartState }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incrementExisting, existing?.id]);

  const handleSubmit = async () => {
    if (busy || !canSubmitCartItemForm(form, false)) {
      return;
    }
    submittedRef.current = true;
    const values = cartItemFormToSave(form, {
      productId: product.id,
      barcode: barcode ?? variant?.code ?? plannedItem?.barcode ?? null,
      collected: true,
      fallbackName: product.name,
    });
    try {
      if (plannedItem) {
        await updateItem({
          id: purchase.id,
          itemId: plannedItem.id,
          item: values,
        }).unwrap();
      } else {
        await addItem({ id: purchase.id, item: values }).unwrap();
      }
      toast.success(t("purchase.shop.added", { name: values.name }), {
        autoClose: 1500,
      });
      completeWish(purchase.id, checkedOffArticle);
      navigate(shopPath, { replace: true, state: cartState });
    } catch (e) {
      toast.error(t("purchase.shop.error"));
      console.error(e);
    }
  };

  if (incrementExisting) {
    return <FullScreenLoader />;
  }

  return (
    <ShopFormPage
      purchase={purchase}
      title={t("purchase.shop.addToCart")}
      actions={
        <>
          {plannedItem ? (
            <Button
              color="error"
              variant="outlined"
              onClick={handleRemoveFromList}
              disabled={busy}
              startIcon={<PlaylistRemoveOutlined />}
            >
              {t("purchase.shop.removeFromList")}
            </Button>
          ) : null}
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={addState.isLoading || updateState.isLoading}
            disabled={!canSubmitCartItemForm(form, false) || removing}
            startIcon={<AddShoppingCartOutlined />}
          >
            {t("purchase.shop.addToCart")}
          </LoadingButton>
        </>
      }
    >
      <CartItemHeader
        product={product}
        title={product.name}
        lastPurchase={last}
        variant={variant ?? null}
        plannedCount={plannedItem?.container_count ?? 0}
      />
      <CartItemForm
        value={form}
        onChange={handleChange}
        showName={false}
        disabled={busy}
        onSubmit={handleSubmit}
      />
    </ShopFormPage>
  );
};
