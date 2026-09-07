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
  SavePurchaseDto,
  SavePurchaseItemDto,
} from "../../../common/contracts";
import { useCreatePurchaseMutation } from "../../redux/api/purchaseApi";
import { useDashboardSelector } from "../../redux/dashboardStore";
import { usePageTitle } from "../../components/usePageTitle";
import { FormPage, useReturnTo } from "../../components/FormPage";
import { PurchaseItemsEdit } from "../../components/purchase/PurchaseItemsEdit";
import { usePurchaseMetadataHook } from "../../components/purchase/usePurchaseMetadataHook";
import { purchasesNavigation } from "../../components/purchase/usePurchasePage";
import { NO_MODAL_PICKER_QUERY } from "../../components/purchase/shop/CartItemForm";

/**
 * Legacy after-the-fact receipt entry: creates a purchase that is finalized
 * right away.
 */
export const CreatePurchasePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const returnTo = useReturnTo("/purchases");

  usePageTitle([t("layout.purchases"), t("purchase.edit.createTitle")]);

  const currentUser = useDashboardSelector((state) => state.userState.user);
  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();
  const { stores } = usePurchaseMetadataHook();

  const [store, setStore] = React.useState("");
  const [timestamp, setTimestamp] = React.useState<Date | null>(
    new Date(Date.now())
  );
  const [items, setItems] = React.useState<SavePurchaseItemDto[]>([]);

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }
    const savePurchase: SavePurchaseDto = {
      store,
      timestamp: (timestamp ?? new Date(Date.now())).toISOString(),
      // A receipt entered after the fact is finalized right away.
      state: "finalized",
      purchased_by_account_id: currentUser?.id ?? null,
      items,
    };
    try {
      const created = await createPurchase(savePurchase).unwrap();
      toast.success("Purchase created successfully!");
      navigate(`/purchases/${created.id}`, { replace: true });
    } catch (e) {
      toast.error("Purchase could not be created!");
      console.error(e);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <FormPage
        title={t("purchase.edit.createTitle")}
        navigation={purchasesNavigation(t)}
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
              {t("purchase.edit.createAction")}
            </LoadingButton>
          </>
        }
      >
        <Autocomplete
          value={store}
          onChange={(e, newValue) => setStore(newValue ?? "")}
          onInputChange={(e, newValue) => setStore(newValue ?? "")}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("purchase.store")}
              fullWidth
              autoFocus
              sx={{ mb: 2 }}
            />
          )}
          options={stores}
        />
        <DateTimePicker
          label={t("purchase.timestamp")}
          sx={{ width: "100%" }}
          value={timestamp}
          onChange={(v) => setTimestamp(v)}
          desktopModeMediaQuery={NO_MODAL_PICKER_QUERY}
        />
        <PurchaseItemsEdit items={items} setItems={setItems} />
      </FormPage>
    </LocalizationProvider>
  );
};
