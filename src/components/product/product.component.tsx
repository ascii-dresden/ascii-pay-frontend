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

interface IProductItemProps {
  product: ProductDto;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  console.log(color);
  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
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
        <TableCell align="right">{JSON.stringify(product.price)}</TableCell>
        <TableCell align="right">{JSON.stringify(product.bonus)}</TableCell>
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
