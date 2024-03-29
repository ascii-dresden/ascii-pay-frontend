import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDeleteProductMutation } from "../../redux/api/productApi";
import { ProductDto } from "../../../common/contracts";
import { Close } from "@mui/icons-material";
import { Trans, useTranslation } from "react-i18next";

export const DeleteProductDialog = (props: {
  product: ProductDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [deleteProduct, { isLoading, isError, error, isSuccess }] =
    useDeleteProductMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product deleted successfully!");
      props.setOpen(false);
    } else if (isError) {
      toast.error("Product could not be deleted!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = () => {
    deleteProduct(props.product.id);
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle component="div">
        <Typography variant="h5">{t("product.edit.deleteTitle")}</Typography>
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
          <Trans
            i18nKey="product.edit.deleteContent"
            values={{ name: props.product.name }}
            components={{ bold: <b /> }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          fullWidth
          sx={{ mx: 2, py: 1.5 }}
          onClick={handleSubmit}
          loading={isLoading}
          color="error"
        >
          {t("product.edit.deleteAction")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
