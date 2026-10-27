import {
  ProductDto,
  PurchaseDto,
  PurchaseItemDto,
} from "../../../common/contracts";
import React, { useEffect } from "react";
import { useGetAllPurchasesQuery } from "../../redux/api/purchaseApi";
import { toast } from "react-toastify";
import { PaperScreenLoader } from "../PaperScreenLoader";
import {
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { moneyToString } from "../../../terminalApp/components/Money";
import { useTranslation } from "react-i18next";
import { OpenInNewOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { findSubProduct } from "../product/subProductUtils";

type PurchaseWithProduct = {
  purchase: PurchaseDto;
  item: PurchaseItemDto;
};

/** Every item of the product, one row each: a purchase can hold several sub products. */
function filterPurchases(
  purchases: PurchaseDto[],
  productId: number
): PurchaseWithProduct[] {
  return purchases.flatMap((purchase) =>
    purchase.items
      .filter((item) => item.product?.id === productId)
      .map((item) => ({ purchase, item }))
  );
}

/** Filter value: all items, items without a sub product, or one sub product. */
type SubProductFilter = "all" | "none" | number;

const format = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
  timeStyle: "medium",
});

export const PurchaseItemTable = (props: { product: ProductDto }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = React.useState<SubProductFilter>("all");

  const {
    isLoading,
    isError,
    error,
    data: purchases,
  } = useGetAllPurchasesQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Could not load purchases!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || purchases === undefined) {
    return <PaperScreenLoader />;
  }

  let sortedPurchases = [...purchases];
  sortedPurchases.reverse();

  const all = filterPurchases(sortedPurchases, props.product.id);

  if (all.length === 0) {
    return null;
  }

  // Sub products that actually appear in the history, in product order.
  const showSubProducts = all.some((p) => p.item.sub_product_id != null);
  const usedSubProducts = props.product.sub_products.filter((sub) =>
    all.some((p) => p.item.sub_product_id === sub.id)
  );
  const hasUnassigned = all.some((p) => p.item.sub_product_id == null);

  const filtered = all.filter(
    (p) =>
      filter === "all" ||
      (filter === "none"
        ? p.item.sub_product_id == null
        : p.item.sub_product_id === filter)
  );

  const filterChip = (value: SubProductFilter, label: string) => (
    <Chip
      key={String(value)}
      size="small"
      label={label}
      color={filter === value ? "primary" : "default"}
      variant={filter === value ? "filled" : "outlined"}
      onClick={() => setFilter(value)}
    />
  );

  return (
    <>
      {showSubProducts ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, px: 2, pt: 2 }}>
          {filterChip("all", t("purchase.productHistory.all"))}
          {usedSubProducts.map((sub) => filterChip(sub.id, sub.name))}
          {hasUnassigned
            ? filterChip(
                "none",
                t("purchase.productHistory.unassigned", {
                  name: props.product.name,
                })
              )
            : null}
        </Box>
      ) : null}
      <Table aria-label="product-purchases">
        <TableHead>
          <TableRow>
            <TableCell>{t("purchase.timestamp")}</TableCell>
            <TableCell>{t("purchase.store")}</TableCell>
            {showSubProducts ? (
              <TableCell>{t("product.subProduct")}</TableCell>
            ) : null}
            <TableCell>{t("purchase.item.container_count")}</TableCell>
            <TableCell>{t("purchase.item.container_cents")}</TableCell>
            <TableCell>{t("purchase.total")}</TableCell>
            <TableCell>{t("purchase.item.container_size")}</TableCell>
            <TableCell>{t("purchase.item.cents_per_item")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((p) => (
            <TableRow
              key={p.item.id}
              sx={{ "& > *": { borderBottom: "unset !important" } }}
            >
              <TableCell>
                {format.format(new Date(p.purchase.timestamp))}
                <Link to={`/purchases/${p.purchase.id}`}>
                  <IconButton size="small">
                    <OpenInNewOutlined fontSize="small" />
                  </IconButton>
                </Link>
              </TableCell>
              <TableCell>{p.purchase.store}</TableCell>
              {showSubProducts ? (
                <TableCell>
                  {findSubProduct(props.product, p.item.sub_product_id)?.name ??
                    "–"}
                </TableCell>
              ) : null}
              <TableCell>{p.item.container_count}</TableCell>
              <TableCell>{moneyToString(p.item.container_cents)}</TableCell>
              <TableCell>
                {moneyToString(p.item.container_cents * p.item.container_count)}
              </TableCell>
              <TableCell>{p.item.container_size}</TableCell>
              <TableCell>
                {moneyToString(p.item.container_cents / p.item.container_size)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
