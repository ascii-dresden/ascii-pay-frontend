import React from "react";
import { Button, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { LoadingButton } from "@mui/lab";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  PurchaseDto,
  SavePurchaseDto,
  SavePurchaseItemDto,
} from "../../../common/contracts";
import { useUpdatePurchaseMutation } from "../../redux/api/purchaseApi";
import { usePageTitle } from "../../components/usePageTitle";
import { FormPage, useReturnTo } from "../../components/FormPage";
import { PurchaseItemsEdit } from "../../components/purchase/PurchaseItemsEdit";
import { usePurchaseMetadataHook } from "../../components/purchase/usePurchaseMetadataHook";
import {
  PurchaseNoticePage,
  purchasesNavigation,
  usePurchasePage,
  usePurchasePageFallback,
} from "../../components/purchase/usePurchasePage";
import { purchaseItemToSave } from "../../components/purchase/purchaseUtils";
import { NO_MODAL_PICKER_QUERY } from "../../components/purchase/shop/CartItemForm";

type HeaderState = {
  store: string;
  name: string;
  timestamp: Date | null;
  purchaserId: number | null;
  items: SavePurchaseItemDto[];
};

const fromPurchase = (purchase: PurchaseDto): HeaderState => ({
  store: purchase.store,
  name: purchase.name ?? "",
  timestamp: new Date(purchase.timestamp),
  purchaserId: purchase.purchased_by_account_id,
  // Round-trip best_before / barcode / collected unchanged.
  items: purchase.items.map(purchaseItemToSave),
});

/**
 * Edits header and items of a draft purchase. Finalized purchases show the
 * locked notice.
 */
export const UpdatePurchasePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const title = t("purchase.edit.updateTitle");

  const page = usePurchasePage();
  const { purchase, purchaseId, detailsPath } = page;
  const returnTo = useReturnTo(detailsPath);

  usePageTitle([
    t("layout.purchases"),
    purchase?.id?.toString() ?? t("layout.loading"),
    title,
  ]);

  const [updatePurchase, { isLoading }] = useUpdatePurchaseMutation();
  const { stores } = usePurchaseMetadataHook();

  const [form, setForm] = React.useState<HeaderState | null>(null);
  React.useEffect(() => {
    if (purchase && form === null) {
      setForm(fromPurchase(purchase));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchase?.id]);

  const fallback = usePurchasePageFallback(page, title);
  if (fallback) {
    return fallback;
  }
  if (!purchase) {
    return null;
  }

  const navigation = purchasesNavigation(t, purchaseId);

  if (purchase.state !== "draft") {
    return (
      <PurchaseNoticePage
        title={title}
        navigation={navigation}
        backTo={detailsPath}
        backLabel={t("purchase.shop.toDetails")}
        severity="info"
        message={t("purchase.details.editLocked")}
      />
    );
  }
  if (form === null) {
    return null;
  }

  const update = (patch: Partial<HeaderState>) =>
    setForm((f) => (f ? { ...f, ...patch } : f));

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }
    const savePurchase: SavePurchaseDto = {
      store: form.store,
      name: form.name,
      timestamp: (form.timestamp ?? new Date(Date.now())).toISOString(),
      purchased_by_account_id: form.purchaserId,
      items: form.items,
    };
    try {
      await updatePurchase({ id: purchaseId, purchase: savePurchase }).unwrap();
      toast.success("Purchase updated successfully!");
      navigate(returnTo, { replace: true });
    } catch (e) {
      toast.error("Purchase could not be updated!");
      console.error(e);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <FormPage
        title={title}
        navigation={navigation}
        backTo={returnTo}
        maxWidth="md"
        actions={
          <>
            <Button variant="outlined" component={Link} to={returnTo}>
              {t("purchase.action.cancel")}
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handleSubmit}
              loading={isLoading}
            >
              {t("purchase.edit.updateAction")}
            </LoadingButton>
          </>
        }
      >
        <Autocomplete
          value={form.store}
          onChange={(e, newValue) => update({ store: newValue ?? "" })}
          onInputChange={(e, newValue) => update({ store: newValue ?? "" })}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("purchase.store")}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
          options={stores}
        />
        <TextField
          label={t("purchase.newTrip.name")}
          fullWidth
          sx={{ mb: 2 }}
          value={form.name}
          onChange={(e) => update({ name: e.target.value })}
        />
        <DateTimePicker
          label={t("purchase.timestamp")}
          sx={{ width: "100%" }}
          value={form.timestamp}
          onChange={(v) => update({ timestamp: v })}
          desktopModeMediaQuery={NO_MODAL_PICKER_QUERY}
        />
        <PurchaseItemsEdit
          items={form.items}
          setItems={(items) => update({ items })}
        />
      </FormPage>
    </LocalizationProvider>
  );
};
