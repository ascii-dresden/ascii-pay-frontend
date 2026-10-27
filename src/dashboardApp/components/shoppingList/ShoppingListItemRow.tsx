import React from "react";
import {
  Avatar,
  Box,
  Checkbox,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { DeleteOutline, RestoreOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProductDto, ShoppingListItemDto } from "../../../common/contracts";
import { stringAvatar } from "../../../common/stringAvatar";
import { ProductAvatar } from "../product/ProductAvatar";
import { shoppingListItemName } from "./shoppingListUtils";
import { findSubProduct } from "../product/subProductUtils";
import { moneyToString } from "../../../terminalApp/components/Money";

export const ShoppingListItemAvatar = (props: {
  item: ShoppingListItemDto;
  size?: number;
}) => {
  const size = props.size ?? 40;
  if (props.item.product) {
    return <ProductAvatar product={props.item.product} size={size} />;
  }
  const name = shoppingListItemName(props.item);
  const avatar = stringAvatar(name);
  return (
    <Avatar
      alt={name}
      variant="rounded"
      {...avatar}
      sx={{ ...avatar.sx, width: size, height: size }}
    />
  );
};

/**
 * List row for a shopping list entry. The row body links to `to` (or calls
 * `onClick`); the optional actions are a done checkbox, a reopen icon and a
 * trash icon. Shared by the shopping list page and shopping mode.
 */
export const ShoppingListItemRow = (props: {
  item: ShoppingListItemDto;
  secondary: string;
  to?: string;
  onClick?: () => void;
  onDone?: () => void;
  onReopen?: () => void;
  onDelete?: () => void;
  busy?: boolean;
  /** Render the name struck through (bought entries). */
  done?: boolean;
  /**
   * Entry below a product heading: indented, without avatar, named after its
   * sub product.
   */
  nested?: boolean;
  /** Unit price of the last purchase, shown in front of the secondary line. */
  unitCents?: number | null;
}) => {
  const { t } = useTranslation();
  const { item } = props;
  const subProduct = findSubProduct(item.product, item.sub_product_id);
  const name = props.nested
    ? subProduct?.name ?? t("shoppingList.anySubProduct")
    : shoppingListItemName(item);
  const actionCount = [props.onDone, props.onReopen, props.onDelete].filter(
    Boolean
  ).length;
  const pr = actionCount === 0 ? 2 : actionCount === 1 ? 7 : 12;
  const secondary = [
    props.unitCents != null ? moneyToString(props.unitCents) : null,
    props.secondary || null,
  ]
    .filter(Boolean)
    .join(" · ");

  const content = (
    <>
      {props.nested ? (
        <Typography color="text.secondary" sx={{ width: 24, flexShrink: 0 }}>
          •
        </Typography>
      ) : (
        <ListItemAvatar>
          <ShoppingListItemAvatar item={item} />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={name}
        secondary={secondary || undefined}
        primaryTypographyProps={{
          noWrap: true,
          sx: props.done
            ? { textDecoration: "line-through", color: "text.secondary" }
            : undefined,
        }}
        secondaryTypographyProps={{ noWrap: true }}
      />
    </>
  );

  const clickable = !!props.to || !!props.onClick;
  const pl = props.nested ? { xs: 5, sm: 9 } : 2;

  return (
    <ListItem
      disablePadding
      secondaryAction={
        actionCount > 0 ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {props.onDone ? (
              <Checkbox
                checked={false}
                disabled={props.busy}
                onChange={props.onDone}
                inputProps={{
                  "aria-label": t("shoppingList.markDone") ?? "",
                }}
              />
            ) : null}
            {props.onReopen ? (
              <IconButton
                edge={props.onDelete ? false : "end"}
                aria-label={t("shoppingList.reopen") ?? "reopen"}
                title={t("shoppingList.reopen") ?? undefined}
                onClick={props.onReopen}
                disabled={props.busy}
              >
                <RestoreOutlined />
              </IconButton>
            ) : null}
            {props.onDelete ? (
              <IconButton
                edge="end"
                aria-label={t("shoppingList.remove") ?? "remove"}
                title={t("shoppingList.remove") ?? undefined}
                onClick={props.onDelete}
                disabled={props.busy}
              >
                <DeleteOutline />
              </IconButton>
            ) : null}
          </Box>
        ) : undefined
      }
    >
      {clickable ? (
        props.to ? (
          <ListItemButton component={Link} to={props.to} sx={{ pr, pl }}>
            {content}
          </ListItemButton>
        ) : (
          <ListItemButton onClick={props.onClick} sx={{ pr, pl }}>
            {content}
          </ListItemButton>
        )
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            py: 1,
            pl,
            pr,
          }}
        >
          {content}
        </Box>
      )}
    </ListItem>
  );
};

/**
 * Heading of a product with sub products on the shopping list: the product is
 * only a category, its entries (one per wanted sub product) follow as nested
 * rows.
 */
export const ShoppingListGroupHeading = (props: { product: ProductDto }) => (
  <ListItem sx={{ pt: 1.5, pb: 0 }}>
    <ListItemAvatar>
      <ProductAvatar product={props.product} size={40} />
    </ListItemAvatar>
    <ListItemText
      primary={props.product.name}
      primaryTypographyProps={{ noWrap: true, fontWeight: 500 }}
    />
  </ListItem>
);
