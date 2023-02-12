import {
  Avatar,
  Button,
  ButtonGroup,
  TableCell,
  TableRow,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDeleteProductMutation } from "../../redux/api/productApi";
import { toast } from "react-toastify";
import UpdateProduct from "./update-product";
import { ProductDto } from "../../redux/api/contracts";
import { BASE_URL } from "../../redux/api/customFetchBase";
import { CoinAmountView } from "../CoinAmountView";
import {stringAvatar} from "../stringAvatar";

interface IProductItemProps {
  product: ProductDto;
}

const ProductItem: FC<IProductItemProps> = ({ product }) => {
  const [openModal, setOpenModal] = useState(false);
  const [deleteProduct, { isLoading, error, isSuccess, isError }] =
    useDeleteProductMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product deleted successfully");
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onDeleteHandler = (id: number) => {
    if (window.confirm("Are you sure")) {
      deleteProduct(id);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Avatar
            alt={product.name}
            src={`${BASE_URL}/product/${product.id}/image`}
            {...stringAvatar(product.name)}
          />
        </TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell align="right">
          <CoinAmountView coins={product.price} />
        </TableCell>
        <TableCell align="right">
          <CoinAmountView coins={product.bonus} />
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => setOpenModal(true)}>Edit</Button>
            <Button onClick={() => onDeleteHandler(product.id)}>Delete</Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
      <UpdateProduct
        product={product}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
};

export default ProductItem;
