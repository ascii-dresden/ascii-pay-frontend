import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Container,
  Grow,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { useGetAllProductsQuery } from "../redux/api/productApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Add,
  DeleteOutline,
  Edit,
  ImageOutlined,
  MoreVert,
} from "@mui/icons-material";
import { CreateProductDialog } from "../components/product/CreateProductDialog";
import { BASE_URL } from "../redux/api/customFetchBase";
import { stringWithoutColorAvatar } from "../components/stringAvatar";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { UpdateProductDialog } from "../components/product/UpdateProductDialog";
import { ProductDto } from "../redux/api/contracts";
import { useNavigate } from "react-router-dom";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { DeleteProductDialog } from "../components/product/DeleteProductDialog";
import { TagChip } from "../components/product/TagChip";
import { UpdateProductImageDialog } from "../components/product/UpdateProductImageDialog";
import { ProductListRowActionButton } from "../components/product/ProductListRowActionButton";

export const ProductListPage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const {
    isLoading,
    isError,
    error,
    data: products,
  } = useGetAllProductsQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Could not load products!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const header = (
    <Paper elevation={0}>
      <Box sx={{ px: 1, py: 2, mb: 2 }}>
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
            New product
          </Button>
        </Toolbar>
      </Box>
    </Paper>
  );

  if (isLoading || products === undefined) {
    return <PaperScreenLoader>{header}</PaperScreenLoader>;
  }

  let categories =
    products
      ?.map((p) => p.category)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      }) ?? [];
  categories.sort();

  let filteredProducts: ProductDto[] = products;
  if (tabIndex < categories.length) {
    let category = categories[tabIndex];
    filteredProducts = products.filter((p) => p.category === category);
  }

  filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredProducts.length)
      : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedProducts =
    rowsPerPage > 0
      ? filteredProducts.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : filteredProducts;

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
          <Tabs
            value={tabIndex}
            onChange={(_, i) => {
              setTabIndex(i);
              setPage(0);
            }}
          >
            {categories.map((c) => (
              <Tab key={c} label={c.length > 0 ? c : "Uncategorized"} />
            ))}
          </Tabs>
        </Box>
        <Table aria-label="Products table">
          <TableHead>
            <TableRow>
              <TableCell width={72}></TableCell>
              <TableCell>Name</TableCell>
              <TableCell width={250}>Price</TableCell>
              <TableCell width={250}>Bonus</TableCell>
              <TableCell width={128}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedProducts.map((product) => (
              <ProductListRow key={product.id} product={product} />
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 78 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={5}
                count={filteredProducts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <CreateProductDialog open={openModal} setOpen={setOpenModal} />
    </Container>
  );
};

const ProductListRow = (props: { product: ProductDto }) => {
  return (
    <>
      <TableRow style={{ height: 78 }}>
        <TableCell>
          <Avatar
            alt={props.product.name}
            src={`${BASE_URL}/product/${props.product.id}/image`}
            variant="rounded"
            {...stringWithoutColorAvatar(props.product.name)}
          />
        </TableCell>
        <TableCell>
          <Typography>{props.product.name}</Typography>
          <Typography variant="caption">{props.product.nickname}</Typography>

          <div style={{ marginBottom: -3 }}>
            {props.product.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        </TableCell>
        <TableCell align="right">
          <CoinAmountView coins={props.product.price} />
        </TableCell>
        <TableCell align="right">
          <CoinAmountView coins={props.product.bonus} />
        </TableCell>
        <TableCell>
          <ProductListRowActionButton product={props.product} />
        </TableCell>
      </TableRow>
    </>
  );
};
