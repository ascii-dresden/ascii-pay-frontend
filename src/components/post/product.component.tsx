import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { FC, useEffect, useState } from "react";
import ProductModal from "../modals/post.modal";
import { useDeleteProductMutation } from "../../redux/api/productApi";
import { toast } from "react-toastify";
import UpdateProduct from "./update-product";
import "./post.styles.scss";
import { ProductDto } from "../../redux/api/contracts";
import { BASE_URL } from "../../redux/api/customFetchBase";

interface IProductItemProps {
  product: ProductDto;
}

const ProductItem: FC<IProductItemProps> = ({ product }) => {
  const [openProductModal, setOpenProductModal] = useState(false);
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
      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ maxWidth: 345, overflow: "visible" }}>
          <CardMedia
            component="img"
            height="250"
            image={`${BASE_URL}/product/${product.id}/image`}
            alt="green iguana"
            sx={{ p: "1rem 1rem 0" }}
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ color: "#4d4d4d", fontWeight: "bold", height: "64px" }}
            >
              {product.name.length > 50
                ? product.name.substring(0, 50) + "..."
                : product.name}
            </Typography>
            <Box display="flex" alignItems="center" sx={{ mt: "1rem" }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: "#dad8d8",
                  p: "0.1rem 0.4rem",
                  borderRadius: 1,
                  mr: "1rem",
                }}
              >
                {product.category}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              sx={{ px: "0.5rem" }}
            >
              <div className="post-settings">
                <li>
                  <MoreHorizOutlinedIcon />
                </li>
                <ul className="menu">
                  <li onClick={() => setOpenProductModal(true)}>
                    <ModeEditOutlineOutlinedIcon
                      fontSize="small"
                      sx={{ mr: "0.6rem" }}
                    />
                    Edit
                  </li>
                  <li onClick={() => onDeleteHandler(product.id)}>
                    <DeleteOutlinedIcon
                      fontSize="small"
                      sx={{ mr: "0.6rem" }}
                    />
                    Delete
                  </li>
                </ul>
              </div>
            </Box>
          </CardActions>
        </Card>
      </Grid>
      <ProductModal
        openPostModal={openProductModal}
        setOpenPostModal={setOpenProductModal}
      >
        <UpdateProduct
          setOpenPostModal={setOpenProductModal}
          product={product}
        />
      </ProductModal>
    </>
  );
};

export default ProductItem;
