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
import { useCreateProductMutation } from "../../redux/api/productApi";
import { CoinAmountDto, SaveProductDto } from "../../redux/api/contracts";
import { CoinAmountEdit } from "../transaction/CoinAmountEdit";
import { Close } from "@mui/icons-material";
import { CategoryInput } from "./CategoryInput";
import { TagsInput } from "./TagsInput";

export const CreateProductDialog = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  categories: string[];
  tags: string[];
}) => {
  const [createProduct, { isLoading, isError, error, isSuccess }] =
    useCreateProductMutation();

  const [name, setName] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [price, setPrice] = React.useState<CoinAmountDto>({});
  const [bonus, setBonus] = React.useState<CoinAmountDto>({});

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product created successfully!");
      props.setOpen(false);

      setName("");
      setNickname("");
      setCategory("");
      setBarcode("");
      setTags([]);
      setPrice({});
      setBonus({});
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
      tags,
    };
    if (nickname.length > 0) {
      saveProduct.nickname = nickname;
    }
    if (barcode.length > 0) {
      saveProduct.barcode = barcode;
    }
    createProduct(saveProduct);
  };

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle component="div">
        <Typography variant="h5">Create a new product</Typography>
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
          variant="contained"
          fullWidth
          sx={{ mx: 2, py: 1.5 }}
          onClick={handleSubmit}
          loading={isLoading}
        >
          Create Product
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
