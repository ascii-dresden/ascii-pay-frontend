import React from "react";
import { Alert, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  AddShoppingCartOutlined,
  DeleteOutline,
  SaveOutlined,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useUpdatePurchaseItemMutation } from "../../redux/api/purchaseApi";
import { usePageTitle } from "../../components/usePageTitle";
import { usePurchaseHistory } from "../../components/purchase/usePurchaseHistory";
import { findBarcode } from "../../components/product/productBarcodeUtils";
import {
  ShopFormPage,
  ShopLocationState,
  useShopPurchase,
} from "../../components/purchase/shop/ShopFormPage";
import {
  canSubmitCartItemForm,
  CartItemForm,
  cartItemFormFromItem,
  CartItemFormState,
  cartItemFormToSave,
  CartItemHeader,
} from "../../components/purchase/shop/CartItemForm";
import { useRemoveCartItem } from "../../components/purchase/shop/useCartItemActions";
import { useShoppingListCheckoff } from "../../components/shoppingList/useShoppingListWish";

/**
 * Edits an existing row of the purchase. Planned rows (shopping list) are
 * moved to the cart on save. Remove deletes right away with an undo toast.
 */
export const EditCartItemPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const itemId = parseInt(params.itemId ?? "");

  const title = t("purchase.shop.editItem");
  usePageTitle([t("layout.purchases"), t("purchase.shop.title"), title]);

  const { purchase, purchaseId, shopPath, fallback } = useShopPurchase(title);
  const item = purchase?.items.find((i) => i.id === itemId) ?? null;
  const product = item?.product ?? null;

  const { getLastPurchase } = usePurchaseHistory();
  const last = getLastPurchase(product?.id, {
    code: item?.barcode,
    size: item?.container_size,
  });

  const [updateItem, { isLoading }] = useUpdatePurchaseItemMutation();
  const removeItem = useRemoveCartItem(purchaseId);
  const checkOffWishes = useShoppingListCheckoff();
  const [removing, setRemoving] = React.useState(false);

  const [form, setForm] = React.useState<CartItemFormState | null>(null);
  React.useEffect(() => {
    if (item && form === null) {
      setForm(cartItemFormFromItem(item, last, product?.name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  if (fallback) {
    return fallback;
  }
  if (!purchase) {
    return null;
  }

  const cartState: ShopLocationState = { tab: "cart" };

  if (!item || form === null) {
    if (!item && !removing) {
      return (
        <ShopFormPage purchase={purchase} title={title}>
          <Alert severity="warning">{t("purchase.shop.itemNotFound")}</Alert>
        </ShopFormPage>
      );
    }
    return null;
  }

  const markCollected = !item.collected;
  const requireName = !product;
  const canSubmit = canSubmitCartItemForm(form, requireName);
  const busy = isLoading || removing;

  const handleSubmit = async () => {
    if (busy || !canSubmit) {
      return;
    }
    const values = cartItemFormToSave(form, {
      productId: product?.id ?? null,
      barcode: item.barcode,
      collected: markCollected ? true : item.collected,
      fallbackName: product?.name ?? item.name,
    });
    try {
      await updateItem({
        id: purchaseId,
        itemId: item.id,
        item: values,
      }).unwrap();
      toast.success(
        markCollected
          ? t("purchase.shop.added", { name: values.name })
          : t("purchase.shop.updated"),
        { autoClose: 1500 }
      );
      if (markCollected) {
        // Only the move into the cart ticks the list off, not a later edit.
        checkOffWishes(purchaseId, {
          productId: product?.id ?? null,
          name: values.name,
        });
      }
      navigate(shopPath, { replace: true, state: cartState });
    } catch (e) {
      toast.error(t("purchase.shop.error"));
      console.error(e);
    }
  };

  const handleRemove = async () => {
    if (busy) {
      return;
    }
    setRemoving(true);
    const removed = await removeItem(item);
    if (removed) {
      navigate(shopPath, {
        replace: true,
        state: { tab: item.collected ? "cart" : "list" } as ShopLocationState,
      });
    } else {
      setRemoving(false);
    }
  };

  return (
    <ShopFormPage
      purchase={purchase}
      title={title}
      actions={
        <>
          <Button
            color="error"
            variant="outlined"
            onClick={handleRemove}
            disabled={busy}
            startIcon={<DeleteOutline />}
          >
            {markCollected
              ? t("purchase.shop.removeFromList")
              : t("purchase.shop.removeItem")}
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!canSubmit || removing}
            startIcon={
              markCollected ? <AddShoppingCartOutlined /> : <SaveOutlined />
            }
          >
            {markCollected
              ? t("purchase.shop.addToCart")
              : t("purchase.shop.saveItem")}
          </LoadingButton>
        </>
      }
    >
      <CartItemHeader
        product={product}
        title={product?.name ?? item.name}
        barcode={product ? null : item.barcode}
        lastPurchase={last}
        variant={product ? findBarcode(product, item.barcode) : null}
        plannedCount={item.collected ? 0 : item.container_count}
      />
      <CartItemForm
        value={form}
        onChange={setForm}
        showName={requireName}
        disabled={busy}
        onSubmit={handleSubmit}
      />
    </ShopFormPage>
  );
};
