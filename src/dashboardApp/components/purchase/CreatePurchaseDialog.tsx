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
import { useCreatePurchaseMutation } from "../../redux/api/purchaseApi";
import {
  SavePurchaseDto,
  SavePurchaseItemDto,
} from "../../../common/contracts";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PurchaseItemsEdit } from "./PurchaseItemsEdit";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB";
import { useDashboardSelector } from "../../redux/dashboardStore";

export const CreatePurchaseDialog = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const currentUser = useDashboardSelector((state) => state.userState.user);
  const [createPurchase, { isLoading, isError, error, isSuccess }] =
    useCreatePurchaseMutation();

  const [store, setStore] = React.useState("");
  const [timestamp, setTimestamp] = React.useState<Date | null>(
    new Date(Date.now())
  );
  const [purchaserId, setPurchaserId] = React.useState<number | null>(null);
  const [items, setItems] = React.useState<SavePurchaseItemDto[]>([]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Purchase created successfully!");
      props.setOpen(false);

      setStore("");
      setTimestamp(new Date(Date.now()));
      setPurchaserId(currentUser?.id ?? null);
      setItems([]);
    } else if (isError) {
      toast.error("Purchase could not be created!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    setPurchaserId(currentUser?.id ?? null);
  }, [currentUser]);

  const handleSubmit = () => {
    let savePurchase: SavePurchaseDto = {
      store,
      timestamp: (timestamp ?? new Date(Date.now()))?.toISOString(),
      purchased_by_account_id: purchaserId,
      items,
    };
    createPurchase(savePurchase);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        fullScreen={fullScreen}
      >
        <DialogTitle component="div">
          <Typography variant="h5">{t("purchase.edit.createTitle")}</Typography>
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
            <TextField
              label={t("purchase.store")}
              fullWidth
              sx={{ mb: "1rem" }}
              value={store}
              onChange={(e) => setStore(e.target.value)}
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
            {t("purchase.edit.createAction")}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
