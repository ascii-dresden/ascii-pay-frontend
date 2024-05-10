import {
  Avatar,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { productApi, useGetProductQuery } from "../redux/api/productApi";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { TagChip } from "../components/product/TagChip";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { stringWithoutColorAvatar } from "../../common/stringAvatar";
import { BarcodeView } from "../components/product/Barcode";
import { ProductActionButton } from "../components/product/ProductActionButton";
import { usePageTitle } from "../components/usePageTitle";
import { BASE_URL } from "../../const";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { useDashboardDispatch } from "../redux/dashboardStore";
import { PullToRefreshWrapper } from "../components/PullToRefresh";
import { QuickAccessGridNameIcon } from "../components/product/QuickAccessGridNameIcon";
import { PurchaseItemTable } from "../components/purchase/PurchaseProductTable";
import { PurchaseItemOverview } from "../components/purchase/PurchaseProductOverview";

export const ProductDetailsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  let params = useParams();
  let productId = parseInt(params.productId ?? "");

  const {
    isLoading,
    isError,
    error,
    data: product,
  } = useGetProductQuery(productId);
  const dispatch = useDashboardDispatch();

  const handleRefresh = () => {
    dispatch(
      productApi.util?.invalidateTags([{ type: "Products", id: productId }])
    );
  };

  usePageTitle([t("layout.products"), product?.name ?? t("layout.loading")]);

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

  let navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.products"),
      target: "/products",
    },
    {
      label: product.name,
      target: `/products/${productId}`,
    },
  ];

  const avatar =
    product.category === "QuickAccess" ? (
      <Avatar
        alt={product.name}
        variant="rounded"
        sx={{
          width: 128,
          height: 128,
          bgcolor: "transparent",
        }}
      >
        <QuickAccessGridNameIcon name={product.name} size="extralarge" />
      </Avatar>
    ) : (
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
    );

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
      <Container maxWidth="lg">
        <PageHeader
          navigation={navigation}
          actionButtonView={<ProductActionButton product={product} />}
        >
          <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
            <span style={{ marginRight: "0.6rem" }}>{product.name}</span>
            {product.tags.map((t) => (
              <TagChip key={t} tag={t} />
            ))}
          </Typography>
        </PageHeader>

        <Box sx={{ mb: 4 }}>
          <Paper sx={{ display: { xs: "block", md: "flex" } }} elevation={4}>
            <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
              {avatar}
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
                      {t("product.name")}
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
                      {t("product.nickname")}
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
                      {t("product.category")}
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
                      {t("product.tags")}
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
                      {t("product.barcode")}
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

          <Paper
            sx={{ display: { xs: "block", md: "flex" }, mt: { xs: 2, sm: 4 } }}
            elevation={4}
          >
            <TableContainer>
              <Table aria-label="Price table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("layout.accountStatus")}</TableCell>
                    <TableCell>{t("product.price")}</TableCell>
                    <TableCell>{t("product.bonus")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <CoinAmountView coins={product.price} />
                    </TableCell>
                    <TableCell>
                      <CoinAmountView coins={product.bonus} />
                    </TableCell>
                  </TableRow>

                  {product.status_prices.map((p) => (
                    <TableRow key={p.status.id}>
                      <TableCell>{p.status.name}</TableCell>
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
            </TableContainer>
          </Paper>
          <Paper
            sx={{ display: { xs: "block", md: "flex" }, mt: { xs: 2, sm: 4 } }}
            elevation={4}
          >
            <PurchaseItemOverview product={product} />
          </Paper>
          <Paper
            sx={{ display: { xs: "block", md: "flex" }, mt: { xs: 2, sm: 4 } }}
            elevation={4}
          >
            <TableContainer>
              <PurchaseItemTable product={product} />
            </TableContainer>
          </Paper>
        </Box>
      </Container>
    </PullToRefreshWrapper>
  );
};
