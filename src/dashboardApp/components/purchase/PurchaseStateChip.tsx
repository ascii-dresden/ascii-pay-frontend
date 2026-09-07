import React from "react";
import { Chip } from "@mui/material";
import { EditOutlined, LockOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PurchaseStateDto } from "../../../common/contracts";

export const PurchaseStateChip = (props: {
  state: PurchaseStateDto;
  size?: "small" | "medium";
}) => {
  const { t } = useTranslation();

  if (props.state === "draft") {
    return (
      <Chip
        size={props.size ?? "small"}
        color="warning"
        variant="outlined"
        icon={<EditOutlined />}
        label={t("purchase.state.draft")}
      />
    );
  }
  return (
    <Chip
      size={props.size ?? "small"}
      color="success"
      variant="outlined"
      icon={<LockOutlined />}
      label={t("purchase.state.finalized")}
    />
  );
};
