import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateProductMutation } from "../../redux/api/productApi";
import {
  CoinAmountDto,
  ProductDto,
  SaveProductDto,
} from "../../redux/api/contracts";
import { CoinAmountEdit } from "../CoinAmountEdit";
import { Close } from "@mui/icons-material";
import { CategoryInput } from "./categoryInput";
import { TagsInput } from "./tagsInput";

export const UpdateProductDialog = (props: {
  product: ProductDto;
  open: boolean;
  setOpen: (open: boolean) => void;
  categories: string[];
  tags: string[];
}) => {
  const [updateProduct, { isLoading, isError, error, isSuccess }] =
    useUpdateProductMutation();

  const [name, setName] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [price, setPrice] = React.useState<CoinAmountDto>({});
  const [bonus, setBonus] = React.useState<CoinAmountDto>({});

  React.useEffect(() => {
    setName(props.product.name);
    setNickname(props.product.nickname ?? "");
    setCategory(props.product.category);
    setBarcode(props.product.barcode ?? "");
    setTags(props.product.tags);
    setPrice(props.product.price);
    setBonus(props.product.bonus);
  }, [props.product]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product created successfully");
      props.setOpen(false);
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) => toast.error(el.message));
      } else {
        toast.error((error as any).data.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = () => {
    let saveProduct: SaveProductDto = {
      name,
      price,
      bonus,
      category,
      tags,
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

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle component="div">
        <Typography variant="h5">Edit product</Typography>
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
            label="Product name"
            fullWidth
            sx={{ mb: "1rem" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Nickname"
            fullWidth
            sx={{ mb: "1rem" }}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <CategoryInput
            value={category}
            setValue={setCategory}
            possibleValues={props.categories}
          />
          <TextField
            label="Barcode"
            fullWidth
            sx={{ mb: "1rem" }}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
          <TagsInput
            values={tags}
            setValues={setTags}
            possibleValues={props.tags}
          />
          <CoinAmountEdit label="Price" coins={price} onChange={setPrice} />
          <CoinAmountEdit label="Bonus" coins={bonus} onChange={setBonus} />
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="outlined"
          fullWidth
          sx={{ mx: 2, py: 1.5 }}
          onClick={handleSubmit}
          loading={isLoading}
        >
          Save changes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
