import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
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
  useTheme,
} from "@mui/material";
import { productApi, useGetAllProductsQuery } from "../redux/api/productApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Add,
  EuroSymbolOutlined,
  PrintOutlined,
  StarsOutlined,
} from "@mui/icons-material";
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
import { useDashboardDispatch } from "../redux/dashboardStore";
import { PullToRefreshWrapper } from "../components/PullToRefresh";
import styled from "@emotion/styled";
import clsx from "clsx";
import { UpdateMultiProductPriceDialog } from "../components/product/UpdateMultiProductPriceDialog";
import { AccountStatusChip } from "../components/accountStatus/AccountStatusChip";

const ProductStatusPricesPopoverStyled = styled.div`
  position: absolute;
  visibility: hidden;
  opacity: 0;
  z-index: 1;
  top: calc(100% + 0.4em);
  right: -2em;
  white-space: nowrap;
  transition: opacity 0.2s ease, visibility 0.2s ease;
`;

const ProductStatusPricesIndicatorStyled = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4em;
  cursor: default;

  & > span {
    padding-top: 0.1em;
  }

  &:hover > div {
    visibility: visible;
    opacity: 1;
  }
`;

const StyledCheckableAvatar = styled.div`
  width: 40px;
  height: 40px;

  & > div:first-child {
    display: block;
  }

  & > div:last-child {
    display: none;
  }

  &:hover,
  &.active {
    & > div:first-child {
      display: none;
    }

    & > div:last-child {
      display: block;
    }
  }
`;

export const ProductListPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [selected, setSelected] = React.useState<readonly number[]>([]);

  const [openUpdatePriceModal, setOpenUpdatePriceModal] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: products,
  } = useGetAllProductsQuery();
  const dispatch = useDashboardDispatch();

  const handleRefresh = () => {
    dispatch(productApi.util?.invalidateTags(["Products"]));
  };

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

  const toggleSelectAll = () => {
    setSelected((prevState) => {
      if (prevState.length < filteredProducts.length) {
        return filteredProducts.map((a) => a.id);
      }

      return [];
    });
  };

  const toggleSelected = (product: ProductDto) => {
    setSelected((prevState) => {
      let index = prevState.indexOf(product.id);
      let newState = [...prevState];
      if (index > -1) {
        newState.splice(index, 1);
      } else {
        newState.push(product.id);
      }
      return newState;
    });
  };

  const isSelected = (product: ProductDto) => {
    return selected.indexOf(product.id) > -1;
  };

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

  const selectedHeaderColor =
    theme.palette.mode === "light"
      ? theme.palette.grey["200"]
      : theme.palette.grey["800"];

  const selectedProducts = filteredProducts.filter(isSelected);

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
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
                setSelected([]);
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
                  <TableCell
                    padding="checkbox"
                    width={72}
                    align="center"
                    style={{
                      backgroundColor:
                        selected.length === 0
                          ? "transparent"
                          : selectedHeaderColor,
                    }}
                  >
                    <Checkbox
                      color="primary"
                      checked={
                        selected.length > 0 &&
                        filteredProducts.length === selected.length
                      }
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < filteredProducts.length
                      }
                      onClick={toggleSelectAll}
                    />
                  </TableCell>
                  {selected.length > 0 ? (
                    <TableCell
                      colSpan={5}
                      padding="none"
                      height={56.5}
                      style={{
                        backgroundColor: selectedHeaderColor,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0 16px",
                        }}
                      >
                        <Typography>
                          {t("product.action.multiSelectMessage", {
                            count: selected.length,
                          })}
                        </Typography>
                        <div>
                          <ButtonGroup variant="outlined" size="small">
                            <Button
                              startIcon={<EuroSymbolOutlined />}
                              variant="outlined"
                              size="small"
                              onClick={() => setOpenUpdatePriceModal(true)}
                            >
                              {t("product.action.multiSelectSetPrice")}
                            </Button>
                          </ButtonGroup>
                        </div>
                      </div>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell>{t("product.name")}</TableCell>
                      <TableCell width={250}>{t("product.price")}</TableCell>
                      <TableCell width={250}>{t("product.bonus")}</TableCell>
                      <TableCell width={80}></TableCell>
                      <TableCell width={128}></TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {slicedProducts.map((product) => (
                  <ProductListRow
                    key={product.id}
                    product={product}
                    selected={isSelected(product)}
                    toggleSelected={toggleSelected}
                    selectionMode={selected.length > 0}
                  />
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 78 * emptyRows }}>
                    <TableCell colSpan={6} />
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

        <UpdateMultiProductPriceDialog
          products={selectedProducts}
          open={openUpdatePriceModal}
          setOpen={setOpenUpdatePriceModal}
        />
      </Container>
    </PullToRefreshWrapper>
  );
};

const ProductListRow = (props: {
  product: ProductDto;
  selected: boolean;
  toggleSelected: (product: ProductDto) => void;
  selectionMode: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <TableRow style={{ height: 78 }}>
        <TableCell>
          <StyledCheckableAvatar
            className={clsx({ active: props.selectionMode })}
          >
            <div>
              <Avatar
                alt={props.product.name}
                src={`${BASE_URL}/product/${props.product.id}/image`}
                variant="rounded"
                {...stringWithoutColorAvatar(props.product.name)}
              />
            </div>
            <div>
              <Checkbox
                color="primary"
                checked={props.selected}
                onClick={() => props.toggleSelected(props.product)}
              />
            </div>
          </StyledCheckableAvatar>
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
        <TableCell width={250} align="right">
          <CoinAmountView coins={props.product.price} />
        </TableCell>
        <TableCell width={250} align="right">
          <CoinAmountView coins={props.product.bonus} />
        </TableCell>
        <TableCell width={80}>
          {props.product.status_prices.length <= 0 ? (
            <ProductStatusPricesIndicatorStyled>
              <StarsOutlined fontSize="small" opacity={0.2} />
            </ProductStatusPricesIndicatorStyled>
          ) : (
            <ProductStatusPricesIndicatorStyled>
              <span>{props.product.status_prices.length}</span>
              <span>×</span>
              <StarsOutlined fontSize="small" opacity={0.8} />
              <ProductStatusPricesPopoverStyled>
                <Paper elevation={4}>
                  <Table aria-label="Price table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("layout.accountStatus")}</TableCell>
                        <TableCell>{t("product.price")}</TableCell>
                        <TableCell>{t("product.bonus")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.product.status_prices.map((p) => (
                        <TableRow key={p.status.id}>
                          <TableCell>
                            <AccountStatusChip status={p.status} />
                          </TableCell>
                          <TableCell>
                            <CoinAmountView coins={p.price} />
                          </TableCell>
                          <TableCell>
                            <CoinAmountView coins={p.bonus} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </ProductStatusPricesPopoverStyled>
            </ProductStatusPricesIndicatorStyled>
          )}
        </TableCell>
        <TableCell width={128}>
          <ProductActionButton product={props.product} showNavigationOption />
        </TableCell>
      </TableRow>
    </>
  );
};
