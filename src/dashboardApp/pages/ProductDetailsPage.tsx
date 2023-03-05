import {
  Avatar,
  Box,
  Breadcrumbs,
  Container,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductQuery } from "../redux/api/productApi";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { TagChip } from "../components/product/TagChip";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { BASE_URL } from "../redux/api/customFetchBase";
import { stringWithoutColorAvatar } from "../../common/stringAvatar";
import { BarcodeView } from "../components/product/Barcode";
import { ProductDetailsActionButton } from "../components/product/ProductDetailsActionButton";

export const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  let params = useParams();
  let productId = parseInt(params.productId ?? "");

  const {
    isLoading,
    isError,
    error,
    data: product,
  } = useGetProductQuery(productId);

  useEffect(() => {
    if (isError) {
      toast.error("Could not load product!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !product) {
    return <FullScreenLoader />;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={0}>
        <Box sx={{ px: 1, py: 2, mb: 2 }}>
          <Toolbar
            disableGutters={true}
            sx={{ justifyContent: "space-between" }}
          >
            <div>
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h5"
                component="div"
              >
                <span style={{ marginRight: "0.6rem" }}>{product.name}</span>
                {product.tags.map((t) => (
                  <TagChip key={t} tag={t} />
                ))}
              </Typography>

              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => navigate("/")}
                >
                  ascii-pay
                </Link>
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => navigate("/products")}
                >
                  Products
                </Link>
                <Link
                  underline="hover"
                  color="text.primary"
                  aria-current="page"
                  onClick={() => navigate(`/products/${productId}/`)}
                >
                  {product.name}
                </Link>
              </Breadcrumbs>
            </div>

            <ProductDetailsActionButton product={product} />
          </Toolbar>
        </Box>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Paper sx={{ display: "flex" }} elevation={4}>
          <Box sx={{ p: 2 }}>
            <Avatar
              alt={product.name}
              src={`${BASE_URL}/product/${product.id}/image`}
              variant="rounded"
              sx={{
                width: 128,
                height: 128,
                border: `solid 1px ${theme.palette.divider}`,
              }}
              {...stringWithoutColorAvatar(product.name)}
            />
          </Box>
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <Table size="small">
              <TableBody>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Name
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Nickname
                  </TableCell>
                  <TableCell>{product.nickname}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Category
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Tags
                  </TableCell>
                  <TableCell>
                    {product.tags.map((t) => (
                      <TagChip key={t} tag={t} />
                    ))}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Price
                  </TableCell>
                  <TableCell>
                    <CoinAmountView coins={product.price} />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Bonus
                  </TableCell>
                  <TableCell>
                    <CoinAmountView coins={product.bonus} />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Barcode
                  </TableCell>
                  <TableCell>
                    {product.barcode ? (
                      <BarcodeView value={product.barcode} />
                    ) : null}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
