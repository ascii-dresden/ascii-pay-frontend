import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Chip,
  Container,
  Link,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { useGetAllProductsQuery } from "../redux/api/productApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Add } from "@mui/icons-material";
import { CreateProductDialog } from "../components/product/CreateProductDialog";
import { BASE_URL } from "../redux/api/customFetchBase";
import { stringAvatar } from "../components/stringAvatar";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { UpdateProductDialog } from "../components/product/UpdateProductDialog";
import { ProductDto } from "../redux/api/contracts";
import { useNavigate } from "react-router-dom";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { DeleteProductDialog } from "../components/product/DeleteProductDialog";

export const ProductListPage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const {
    isLoading,
    isError,
    error,
    data: products,
  } = useGetAllProductsQuery();

  useEffect(() => {
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

  const header = (
    <Paper elevation={0}>
      <Box sx={{ px: 1, py: 2, mb: 3 }}>
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
              Products
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
                color="text.primary"
                aria-current="page"
                onClick={() => navigate("/products")}
              >
                Products
              </Link>
            </Breadcrumbs>
          </div>

          <Button
            variant="outlined"
            size="large"
            startIcon={<Add />}
            sx={{ whiteSpace: "nowrap", width: "13rem" }}
            onClick={() => setOpenModal(true)}
          >
            New Product
          </Button>
        </Toolbar>
      </Box>
    </Paper>
  );

  if (isLoading || products === undefined) {
    return <PaperScreenLoader>{header}</PaperScreenLoader>;
  }

  let categories = products
    .map((p) => p.category)
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  categories.sort();

  let tags = products
    .flatMap((p) => p.tags)
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  tags.sort();

  let filteredProducts: ProductDto[] = products;
  if (tabIndex < categories.length) {
    let category = categories[tabIndex];
    filteredProducts = products.filter((p) => p.category === category);
  }

  filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container maxWidth="lg">
      {header}
      <TableContainer component={Paper} elevation={4}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs value={tabIndex} onChange={(_, i) => setTabIndex(i)}>
            {categories.map((c) => (
              <Tab key={c} label={c.length > 0 ? c : "Uncategorized"} />
            ))}
          </Tabs>
        </Box>
        <Table aria-label="Products table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Bonus</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <ProductListRow
                key={product.id}
                product={product}
                categories={categories}
                tags={tags}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateProductDialog
        open={openModal}
        setOpen={setOpenModal}
        categories={categories}
        tags={tags}
      />
    </Container>
  );
};

const ProductListRow = (props: {
  product: ProductDto;
  categories: string[];
  tags: string[];
}) => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <Avatar
            alt={props.product.name}
            src={`${BASE_URL}/product/${props.product.id}/image`}
            {...stringAvatar(props.product.name)}
          />
        </TableCell>
        <TableCell>
          <Typography>{props.product.name}</Typography>
          <Typography variant="caption">{props.product.nickname}</Typography>

          {props.product.tags.map((tag) => (
            <Chip key={tag} size="small" label={tag} sx={{ mr: 1 }} />
          ))}
        </TableCell>
        <TableCell align="right">
          <CoinAmountView coins={props.product.price} />
        </TableCell>
        <TableCell align="right">
          <CoinAmountView coins={props.product.bonus} />
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => setOpenUpdateModal(true)}>Edit</Button>
            <Button onClick={() => setOpenDeleteModal(true)}>Delete</Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
      <UpdateProductDialog
        product={props.product}
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
        categories={props.categories}
        tags={props.tags}
      />
      <DeleteProductDialog
        product={props.product}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
};
