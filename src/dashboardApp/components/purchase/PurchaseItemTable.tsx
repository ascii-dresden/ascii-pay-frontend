import { PurchaseDto } from "../../../common/contracts";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { BASE_URL } from "../../../const";
import { stringAvatar } from "../../../common/stringAvatar";
import { moneyToString } from "../../../terminalApp/components/Money";
import { OpenInNewOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const PurchaseItemTable = (props: {
  purchase: PurchaseDto;
  size?: "small";
}) => {
  const { t } = useTranslation();

  return (
    <Table size={props.size} aria-label="purchase-items">
      <TableHead>
        <TableRow>
          <TableCell width={72}></TableCell>
          <TableCell>{t("purchase.item.name")}</TableCell>
          <TableCell>{t("purchase.item.container_count")}</TableCell>
          <TableCell>{t("purchase.item.container_cents")}</TableCell>
          <TableCell>{t("purchase.total")}</TableCell>
          <TableCell>{t("purchase.item.container_size")}</TableCell>
          <TableCell>{t("purchase.item.cents_per_item")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.purchase.items.map((item, index) => (
          <TableRow
            key={index}
            sx={{ "& > *": { borderBottom: "unset !important" } }}
          >
            <TableCell>
              {item.product ? (
                <Avatar
                  alt={item.product.name}
                  src={`${BASE_URL}/product/${item.product.id}/image`}
                  variant="rounded"
                  {...stringAvatar(item.product.name)}
                />
              ) : null}
            </TableCell>
            <TableCell>
              {item.product?.name ?? item.name}
              {item.product ? (
                <Link to={`/products/${item.product.id}`}>
                  <IconButton size="small">
                    <OpenInNewOutlined fontSize="small" />
                  </IconButton>
                </Link>
              ) : null}
            </TableCell>
            <TableCell>{item.container_count}</TableCell>
            <TableCell>{moneyToString(item.container_cents)}</TableCell>
            <TableCell>
              {moneyToString(item.container_cents * item.container_count)}
            </TableCell>
            <TableCell>{item.container_size}</TableCell>
            <TableCell>
              {moneyToString(item.container_cents / item.container_size)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
