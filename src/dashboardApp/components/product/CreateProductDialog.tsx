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
import { useCreateProductMutation } from "../../redux/api/productApi";
import {
  CoinAmountDto,
  SaveProductDto,
  SaveProductStatusPriceDto,
} from "../../../common/contracts";
import { CoinAmountEdit } from "../transaction/CoinAmountEdit";
import { Close, GridOn } from "@mui/icons-material";
import { CategoryInput } from "./CategoryInput";
import { TagsInput } from "./TagsInput";
import { useProductMetadataHook } from "./useProductMetadataHook";
import { useTranslation } from "react-i18next";
import { ProductStatusPricesEdit } from "./ProductStatusPricesEdit";
import { QuickAccessGridNamePicker } from "./QuickAccessGridNamePicker";
import { QuickAccessGridNameIcon } from "./QuickAccessGridNameIcon";

export const CreateProductDialog = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [createProduct, { isLoading, isError, error, isSuccess }] =
    useCreateProductMutation();

  const { tags, categories } = useProductMetadataHook();

  const [name, setName] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [pTags, setPTags] = React.useState<string[]>([]);
  const [price, setPrice] = React.useState<CoinAmountDto>({});
  const [bonus, setBonus] = React.useState<CoinAmountDto>({});
  const [statusPrices, setStatusPrices] = React.useState<
    SaveProductStatusPriceDto[]
  >([]);

  const [gridPickerAnchorEl, setGridPickerAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product created successfully!");
      props.setOpen(false);

      setName("");
      setNickname("");
      setCategory("");
      setBarcode("");
      setPTags([]);
      setPrice({});
      setBonus({});
      setStatusPrices([]);
    } else if (isError) {
      toast.error("Product could not be created!");
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
      status_prices: statusPrices,
    };
    if (nickname.length > 0) {
      saveProduct.nickname = nickname;
    }
    if (barcode.length > 0) {
      saveProduct.barcode = barcode;
    }
    createProduct(saveProduct);
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
        <Typography variant="h5">{t("product.edit.createTitle")}</Typography>
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
          {t("product.edit.createAction")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
