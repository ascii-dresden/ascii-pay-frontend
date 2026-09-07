import { Avatar } from "@mui/material";
import React from "react";
import { ProductDto } from "../../../common/contracts";
import { BASE_URL } from "../../../const";
import { stringWithoutColorAvatar } from "../../../common/stringAvatar";
import { QuickAccessGridNameIcon } from "./QuickAccessGridNameIcon";

export const ProductAvatar = (props: {
  product: ProductDto;
  size?: number;
}) => {
  const size = props.size ?? 40;
  if (props.product.category === "QuickAccess") {
    return (
      <Avatar
        alt={props.product.name}
        variant="rounded"
        sx={{ bgcolor: "transparent", width: size, height: size }}
      >
        <QuickAccessGridNameIcon name={props.product.name} size="large" />
      </Avatar>
    );
  }
  return (
    <Avatar
      alt={props.product.name}
      src={`${BASE_URL}/product/${props.product.id}/image`}
      variant="rounded"
      {...stringWithoutColorAvatar(props.product.name)}
      sx={{ width: size, height: size }}
    />
  );
};
