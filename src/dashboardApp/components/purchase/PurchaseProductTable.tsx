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

type PurchaseWithProduct = {
  purchase: PurchaseDto;
  item: PurchaseItemDto;
};

function filterPurchases(
  purchases: PurchaseDto[],
  productId: number
): PurchaseWithProduct[] {
  const filtered: PurchaseWithProduct[] = [];

  for (let p of purchases) {
    let item = p.items.find((i) => i.product?.id === productId);

    if (item) {
      filtered.push({
        purchase: p,
        item,
      });
    }
  }

  return filtered;
}

const format = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
  timeStyle: "medium",
});

export const PurchaseItemTable = (props: { product: ProductDto }) => {
  const { t } = useTranslation();

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

  const filtered = filterPurchases(sortedPurchases, props.product.id);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <Table aria-label="product-purchases">
      <TableHead>
        <TableRow>
          <TableCell>{t("purchase.timestamp")}</TableCell>
          <TableCell>{t("purchase.store")}</TableCell>
          <TableCell>{t("purchase.item.container_count")}</TableCell>
          <TableCell>{t("purchase.item.container_cents")}</TableCell>
          <TableCell>{t("purchase.total")}</TableCell>
          <TableCell>{t("purchase.item.container_size")}</TableCell>
          <TableCell>{t("purchase.item.cents_per_item")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filtered.map((p, index) => (
          <TableRow
            key={index}
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
  );
};
