import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateProductMutation } from "../../redux/api/productApi";
import {
  CoinAmountDto,
  ProductDto,
  SaveProductDto,
  SaveProductStatusPriceDto,
} from "../../../common/contracts";
import { CoinAmountEdit } from "../transaction/CoinAmountEdit";
import { Close, PercentOutlined } from "@mui/icons-material";
import { CategoryInput } from "./CategoryInput";
import { TagsInput } from "./TagsInput";
import { useProductMetadataHook } from "./useProductMetadataHook";
import { useTranslation } from "react-i18next";
import { ProductStatusPricesEdit } from "./ProductStatusPricesEdit";
import { QuickAccessGridNamePicker } from "./QuickAccessGridNamePicker";
import { QuickAccessGridNameIcon } from "./QuickAccessGridNameIcon";
import { CoinInput } from "../transaction/CoinInput";

interface CustomProps {
  value: number;
  onChange: (value: number) => void;
}

const PercentInputRef = React.forwardRef<HTMLInputElement, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { value, onChange, ...other } = props;
    return (
      <CoinInput
        ref={ref}
        value={value}
        onChange={onChange}
        increment={1}
        {...other}
      />
    );
  }
);

export const UpdateProductDialog = (props: {
  product: ProductDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [updateProduct, { isLoading, isError, error, isSuccess }] =
    useUpdateProductMutation();

  const { tags, categories } = useProductMetadataHook();

  const [name, setName] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [pTags, setPTags] = React.useState<string[]>([]);
  const [price, setPrice] = React.useState<CoinAmountDto>({});
  const [bonus, setBonus] = React.useState<CoinAmountDto>({});
  const [purchaseTax, setPurchaseTax] = React.useState(19);
  const [statusPrices, setStatusPrices] = React.useState<
    SaveProductStatusPriceDto[]
  >([]);

  const toggleTax = React.useCallback(() => {
    setPurchaseTax((tax) => {
      if (tax === 19) {
        return 7;
      } else {
        return 19;
      }
    });
  }, [setPurchaseTax]);

  const [gridPickerAnchorEl, setGridPickerAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    setName(props.product.name);
    setNickname(props.product.nickname ?? "");
    setCategory(props.product.category);
    setBarcode(props.product.barcode ?? "");
    setPTags(props.product.tags);
    setPrice(props.product.price);
    setBonus(props.product.bonus);
    setPurchaseTax(props.product.purchase_tax);
    setStatusPrices(
      props.product.status_prices.map((p) => ({
        status_id: p.status.id,
        price: p.price,
        bonus: p.bonus,
      }))
    );
  }, [props.product]);

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

  const handleSubmit = () => {
    let saveProduct: SaveProductDto = {
      name,
      price,
      bonus,
      category,
      tags: pTags,
      purchase_tax: purchaseTax,
      status_prices: statusPrices,
    };
    if (nickname.length > 0) {
      saveProduct.nickname = nickname;
    }
    if (barcode.length > 0) {
      saveProduct.barcode = barcode;
    }
    updateProduct({
      id: props.product.id,
      product: saveProduct,
    });
  };

  const handleGridPickerChanged = (n: string) => {
    setName(n);
    setGridPickerAnchorEl(null);
  };

  let inputProps =
    category !== "QuickAccess"
      ? {}
      : {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={(e) => setGridPickerAnchorEl(e.currentTarget)}
              >
                <QuickAccessGridNameIcon name={name} />
              </IconButton>
            </InputAdornment>
          ),
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
          <TextField
            label={t("product.name")}
            fullWidth
            sx={{ mb: "1rem" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={inputProps}
          />
          <Popover
            open={gridPickerAnchorEl !== null}
            anchorEl={gridPickerAnchorEl}
            onClose={() => setGridPickerAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <QuickAccessGridNamePicker
              name={name}
              onChange={handleGridPickerChanged}
            />
          </Popover>
          <TextField
            label={t("product.nickname")}
            fullWidth
            sx={{ mb: "1rem" }}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <CategoryInput
            value={category}
            setValue={setCategory}
            possibleValues={categories}
          />
          <TextField
            label={t("product.barcode")}
            fullWidth
            sx={{ mb: "1rem" }}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
          <TagsInput
            values={pTags}
            setValues={setPTags}
            possibleValues={tags}
          />
          <TextField
            fullWidth
            sx={{ mb: "1rem" }}
            value={purchaseTax}
            onChange={setPurchaseTax as any}
            label={t("product.purchaseTax")}
            InputProps={{
              inputComponent: PercentInputRef as any,
              endAdornment: (
                <InputAdornment position="end" onClick={toggleTax}>
                  <PercentOutlined />
                </InputAdornment>
              ),
            }}
          />
          <CoinAmountEdit
            label={t("product.price")}
            coins={price}
            onChange={setPrice}
          />
          <CoinAmountEdit
            label={t("product.bonus")}
            coins={bonus}
            onChange={setBonus}
          />
          <ProductStatusPricesEdit
            statusPrices={statusPrices}
            setStatusPrices={setStatusPrices}
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
        >
          {t("product.edit.updateAction")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
