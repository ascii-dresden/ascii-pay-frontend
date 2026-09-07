import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { LoadingButton } from "@mui/lab";
import {
  PlaylistAddCheckOutlined,
  ShoppingCartCheckoutOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { SavePurchaseDto } from "../../../common/contracts";
import { useCreatePurchaseMutation } from "../../redux/api/purchaseApi";
import { useGetShoppingListQuery } from "../../redux/api/shoppingListApi";
import { useDashboardSelector } from "../../redux/dashboardStore";
import { usePageTitle } from "../../components/usePageTitle";
import { FormPage, useReturnTo } from "../../components/FormPage";
import { usePurchaseMetadataHook } from "../../components/purchase/usePurchaseMetadataHook";
import { purchasesNavigation } from "../../components/purchase/usePurchasePage";

/**
 * Creates an empty draft purchase and continues in shopping mode.
 */
export const NewShoppingTripPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const returnTo = useReturnTo("/purchases");

  usePageTitle([t("layout.purchases"), t("purchase.newTrip.title")]);

  const currentUser = useDashboardSelector((state) => state.userState.user);
  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();
  const { stores } = usePurchaseMetadataHook();
  const { data: openWishes } = useGetShoppingListQuery({ state: "open" });
  const wishCount = openWishes?.length ?? 0;

  const [store, setStore] = React.useState("");
  const [name, setName] = React.useState("");

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }
    const savePurchase: SavePurchaseDto = {
      store,
      name,
      timestamp: new Date().toISOString(),
      state: "draft",
      purchased_by_account_id: currentUser?.id ?? null,
      items: [],
    };
    try {
      const created = await createPurchase(savePurchase).unwrap();
      toast.success(t("purchase.newTrip.success"));
      navigate(`/purchases/${created.id}/shop`, { replace: true });
    } catch (e) {
      toast.error(t("purchase.newTrip.error"));
      console.error(e);
    }
  };

  return (
    <FormPage
      title={t("purchase.newTrip.title")}
      navigation={purchasesNavigation(t)}
      backTo={returnTo}
      actions={
        <>
          <Button variant="outlined" component={Link} to={returnTo}>
            {t("purchase.action.cancel")}
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={isLoading}
            startIcon={<ShoppingCartCheckoutOutlined />}
          >
            {t("purchase.newTrip.action")}
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
      <TextField
        label={t("purchase.newTrip.name")}
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      {wishCount > 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 2,
            color: "text.secondary",
          }}
        >
          <PlaylistAddCheckOutlined fontSize="small" />
          <Typography variant="body2">
            {t("shoppingList.shop.tripHint", { count: wishCount })}
          </Typography>
        </Box>
      ) : null}
    </FormPage>
  );
};
