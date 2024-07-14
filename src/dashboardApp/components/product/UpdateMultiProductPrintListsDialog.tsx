import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateProductMutation } from "../../redux/api/productApi";
import { ProductDto, SaveProductDto } from "../../../common/contracts";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useProductMetadataHook } from "./useProductMetadataHook";

type PrintListState = {
  name: string;
  state: "SET" | "UNSET" | "PARTIAL";
};

function mapPrintListStates(
  availablePrintLists: string[],
  products: ProductDto[]
): PrintListState[] {
  const result: PrintListState[] = [];

  for (let list of availablePrintLists) {
    let count = 0;
    for (let product of products) {
      if (product.print_lists.includes(list)) {
        count += 1;
      }
    }

    result.push({
      name: list,
      state:
        count === 0 ? "UNSET" : count === products.length ? "SET" : "PARTIAL",
    });
  }

  return result;
}

export const UpdateMultiProductPrintListsDialog = (props: {
  products: ProductDto[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { printLists: availablePrintLists } = useProductMetadataHook();

  const [updateProduct, { isLoading, isError, error, isSuccess }] =
    useUpdateProductMutation();

  const [printLists, setPrintLists] = React.useState(
    mapPrintListStates(availablePrintLists, props.products)
  );
  React.useEffect(() => {
    setPrintLists(mapPrintListStates(availablePrintLists, props.products));
  }, [props.products, availablePrintLists]);

  const toggleList = React.useCallback(
    (name: string) => {
      setPrintLists((oldLists) => {
        let newList: PrintListState[] = [];

        for (let list of oldLists) {
          if (list.name === name) {
            newList.push({
              name: list.name,
              state: list.state === "SET" ? "UNSET" : "SET",
            });
          } else {
            newList.push(list);
          }
        }

        return newList;
      });
    },
    [setPrintLists]
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product updated successfully!");
      props.setOpen(false);
    } else if (isError) {
      toast.error("Product could not be updated!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = async () => {
    let setPrintLists = printLists
      .filter((l) => l.state === "SET")
      .map((l) => l.name);
    let unsetPrintLists = printLists
      .filter((l) => l.state === "UNSET")
      .map((l) => l.name);

    for (const product of props.products) {
      let newPrintLists: string[] = [...setPrintLists];

      for (let name of product.print_lists) {
        if (!setPrintLists.includes(name) && !unsetPrintLists.includes(name)) {
          newPrintLists.push(name);
        }
      }

      let saveProduct: SaveProductDto = {
        name: product.name,
        nickname: product.nickname,
        barcode: product.barcode,
        price: product.price,
        bonus: product.bonus,
        category: product.category,
        tags: product.tags,
        print_lists: newPrintLists,
        purchase_tax: product.purchase_tax,
        status_prices: product.status_prices.map((sp) => ({
          status_id: sp.status.id,
          price: sp.price,
          bonus: sp.bonus,
        })),
      };
      await updateProduct({
        id: product.id,
        product: saveProduct,
      });
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle component="div">
        <Typography variant="h5">{t("product.edit.updateTitle")}</Typography>
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
          {printLists.map((list) => (
            <div key={list.name}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={list.state === "SET"}
                    indeterminate={list.state === "PARTIAL"}
                    onChange={(e) => toggleList(list.name)}
                  />
                }
                label={list.name}
              />
            </div>
          ))}
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
          {t("product.edit.updateAction")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
