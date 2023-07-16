import {
  Avatar,
  Box,
  Container,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useGetAllProductsQuery } from "../redux/api/productApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Add, PrintOutlined } from "@mui/icons-material";
import { CreateProductDialog } from "../components/product/CreateProductDialog";
import { stringWithoutColorAvatar } from "../../common/stringAvatar";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { ProductDto } from "../../common/contracts";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { TagChip } from "../components/product/TagChip";
import { usePageTitle } from "../components/usePageTitle";
import { BASE_URL } from "../../const";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { ActionButtonAction } from "../components/ActionButton";
import { ProductActionButton } from "../components/product/ProductActionButton";
import { DefaultTablePagination } from "../components/DefaultTablePagination";

export const ProductListPage = () => {
  const { t } = useTranslation();

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

  usePageTitle(t("layout.products"));

  useEffect(() => {
    if (isError) {
      toast.error("Could not load products!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.products"),
      target: "/products",
    },
  ];

  const actions: ActionButtonAction[] = [
    {
      label: t("product.action.createProduct"),
      icon: <Add />,
      action: () => setOpenModal(true),
    },
    {
      label: t("product.action.printSnacks"),
      icon: <PrintOutlined />,
      href: "/printSnacks",
    },
  ];

  if (isLoading || products === undefined) {
    return (
      <PaperScreenLoader>
        <PageHeader navigation={navigation} actions={actions}>
          <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
            {t("layout.products")}
          </Typography>
        </PageHeader>
      </PaperScreenLoader>
    );
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
      <PageHeader navigation={navigation} actions={actions}>
        <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
          {t("layout.products")}
        </Typography>
      </PageHeader>

      <Paper elevation={4}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
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
        <TableContainer>
          <Table aria-label="Products table">
            <TableHead>
              <TableRow>
                <TableCell width={72}></TableCell>
                <TableCell>{t("product.name")}</TableCell>
                <TableCell width={250}>{t("product.price")}</TableCell>
                <TableCell width={250}>{t("product.bonus")}</TableCell>
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
          </Table>
        </TableContainer>
        <DefaultTablePagination
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
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
          <ProductActionButton product={props.product} showNavigationOption />
        </TableCell>
      </TableRow>
    </>
  );
};
