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
import { ProductDto, PurchaseDto } from "../../../../common/contracts";
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

/**
 * Add-to-cart page body for a registered product. Merge rules:
 * - a planned row for the product exists: the form collects that row (PUT);
 * - otherwise a collected row exists: its count is incremented right away
 *   (with undo toast) and the user is sent back to the cart;
 * - otherwise a new row is created (POST).
 */
export const AddProductToCart = (props: {
  purchase: PurchaseDto;
  product: ProductDto;
  barcode: string | null;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { purchase, product, barcode } = props;
  const shopPath = `/purchases/${purchase.id}/shop`;
  const cartState: ShopLocationState = { tab: "cart" };

  const { getLastPurchase } = usePurchaseHistory();
  const last = getLastPurchase(product.id);
  // Opened from a shopping list entry (`?wish=`): prefill its quantity and
  // tick it off after the article has been added.
  const { wish, completeWish } = useShoppingListWish();

  const plannedItem =
    purchase.items.find((i) => i.product?.id === product.id && !i.collected) ??
    null;
  const existing =
    purchase.items.find((i) => i.product?.id === product.id && i.collected) ??
    null;
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
    cartItemFormFromItem(plannedItem, last, product.name)
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
      const next = cartItemFormFromItem(plannedItem, last, product.name);
      if (!plannedItem && wish && wish.quantity > 0) {
        next.count = wish.quantity;
      }
      setForm(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastKey, plannedItem?.id, product.id, wish?.id]);

  const incrementedRef = React.useRef(false);
  React.useEffect(() => {
    if (incrementExisting && existing && !incrementedRef.current) {
      incrementedRef.current = true;
      incrementItem(existing)
        .then((ok) => {
          if (ok) {
            completeWish(purchase.id);
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
    const values = cartItemFormToSave(form, {
      productId: product.id,
      barcode: barcode ?? plannedItem?.barcode ?? product.barcode ?? null,
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
      completeWish(purchase.id);
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
