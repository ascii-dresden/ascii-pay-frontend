import { Chip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { InventoryCheckStateDto } from "../../../common/contracts";

export const InventoryCheckStateChip = (props: {
  state: InventoryCheckStateDto;
}) => {
  const { t } = useTranslation();
  return (
    <Chip
      size="small"
      color={props.state === "completed" ? "success" : "info"}
      variant={props.state === "completed" ? "filled" : "outlined"}
      label={t(`inventory.state.${props.state}`)}
    />
  );
};
