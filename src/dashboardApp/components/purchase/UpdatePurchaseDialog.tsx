import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdatePurchaseMutation } from "../../redux/api/purchaseApi";
import {
  PurchaseDto,
  SavePurchaseDto,
  SavePurchaseItemDto,
} from "../../../common/contracts";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PurchaseItemsEdit } from "./PurchaseItemsEdit";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB";
import { usePurchaseMetadataHook } from "./usePurchaseMetadataHook";
import Autocomplete from "@mui/material/Autocomplete";

export const UpdatePurchaseDialog = (props: {
  purchase: PurchaseDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [updatePurchase, { isLoading, isError, error, isSuccess }] =
    useUpdatePurchaseMutation();

  const { stores } = usePurchaseMetadataHook();

  const [store, setStore] = React.useState("");
  const [timestamp, setTimestamp] = React.useState<Date | null>(
    new Date(Date.now())
  );
  const [purchaserId, setPurchaserId] = React.useState<number | null>(null);
  const [items, setItems] = React.useState<SavePurchaseItemDto[]>([]);

  React.useEffect(() => {
    setStore(props.purchase.store);
    setTimestamp(new Date(props.purchase.timestamp));
    setPurchaserId(props.purchase.purchased_by_account_id);
    setItems(
      props.purchase.items.map((p) => ({
        name: p.name,
        container_size: p.container_size,
        container_count: p.container_count,
        container_cents: p.container_cents,
        product_id: p.product?.id ?? null,
      }))
    );
  }, [props.purchase]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Purchase updated successfully!");
      props.setOpen(false);
    } else if (isError) {
      toast.error("Purchase could not be updated!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = () => {
    let savePurchase: SavePurchaseDto = {
      store,
      timestamp: (timestamp ?? new Date(Date.now()))?.toISOString(),
      purchased_by_account_id: purchaserId,
      items,
    };
    updatePurchase({
      id: props.purchase.id,
      purchase: savePurchase,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        fullScreen={fullScreen}
      >
        <DialogTitle component="div">
          <Typography variant="h5">{t("purchase.edit.updateTitle")}</Typography>
          <IconButton
            aria-label="close"
            onClick={() => props.setOpen(false)}
            sx={{
              position: "absolute",
              right: 16,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={true}>
          <Box pt={1}>
            <Autocomplete
              value={store}
              onChange={(e, newValue) => setStore(newValue ?? "")}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("purchase.store")}
                  fullWidth
                  sx={{ mb: "1rem" }}
                />
              )}
              options={stores}
            />
            <DateTimePicker
              label={t("purchase.timestamp")}
              sx={{ width: "100%" }}
              value={timestamp}
              onChange={(v) => setTimestamp(v)}
            />
            <PurchaseItemsEdit items={items} setItems={setItems} />
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            variant="contained"
            fullWidth
            sx={{ mx: 2, py: 1.5 }}
            onClick={handleSubmit}
            loading={isLoading}
          >
            {t("purchase.edit.updateAction")}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
