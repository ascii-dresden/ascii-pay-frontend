import React from "react";
import { LoadingButton } from "@mui/lab";
import { AddShoppingCartOutlined } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAddPurchaseItemMutation } from "../../redux/api/purchaseApi";
import { usePageTitle } from "../../components/usePageTitle";
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
import { useShoppingListWish } from "../../components/shoppingList/useShoppingListWish";

/** Adds a cart row without a linked product (`product_id: null`). */
export const FreeItemPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const barcode = (searchParams.get("barcode") ?? "").trim() || null;
  // Opened from a shopping list entry (`?wish=&name=`): prefill name and
  // quantity. After the article has been added, that entry and every open
  // entry of the same name are ticked off the shared shopping list.
  const presetName = (searchParams.get("name") ?? "").trim();
  const { wish, completeWish } = useShoppingListWish();

  const title = t("purchase.shop.addFreeItem");
  usePageTitle([t("layout.purchases"), t("purchase.shop.title"), title]);

  const { purchase, shopPath, fallback } = useShopPurchase(title);
  const [addItem, { isLoading }] = useAddPurchaseItemMutation();
  const [form, setForm] = React.useState<CartItemFormState>(() =>
    cartItemFormFromItem(null, null, presetName)
  );
  const dirtyRef = React.useRef(false);
  const handleChange = (value: CartItemFormState) => {
    dirtyRef.current = true;
    setForm(value);
  };

  React.useEffect(() => {
    if (wish && !dirtyRef.current) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || wish.name,
        count: wish.quantity > 0 ? wish.quantity : prev.count,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wish?.id]);

  if (fallback) {
    return fallback;
  }
  if (!purchase) {
    return null;
  }

  const canSubmit = canSubmitCartItemForm(form, true);

  const handleSubmit = async () => {
    if (isLoading || !canSubmit) {
      return;
    }
    const values = cartItemFormToSave(form, {
      productId: null,
      barcode,
      collected: true,
    });
    try {
      await addItem({ id: purchase.id, item: values }).unwrap();
      toast.success(t("purchase.shop.added", { name: values.name }), {
        autoClose: 1500,
      });
      completeWish(purchase.id, { name: values.name });
      const state: ShopLocationState = { tab: "cart" };
      navigate(shopPath, { replace: true, state });
    } catch (e) {
      toast.error(t("purchase.shop.error"));
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
          disabled={!canSubmit}
          startIcon={<AddShoppingCartOutlined />}
        >
          {t("purchase.shop.addToCart")}
        </LoadingButton>
      }
    >
      <CartItemHeader
        product={null}
        title={form.name.trim() || t("purchase.shop.addFreeItem")}
        barcode={barcode}
        lastPurchase={null}
      />
      <CartItemForm
        value={form}
        onChange={handleChange}
        showName
        autoFocusName
        disabled={isLoading}
        onSubmit={handleSubmit}
      />
    </ShopFormPage>
  );
};
