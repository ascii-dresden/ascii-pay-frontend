import { RoleDto } from "../../../common/contracts";
import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

type Colors =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

export const RoleChip = (props: { role: RoleDto }) => {
  const { t } = useTranslation();

  let label: string;
  let color: Colors;
  switch (props.role) {
    case "Basic":
      label = t("account.role.basic");
      color = "default";
      break;
    case "Member":
      label = t("account.role.member");
      color = "primary";
      break;
    case "Purchaser":
      label = t("account.role.purchaser");
      color = "secondary";
      break;
    case "Admin":
      label = t("account.role.admin");
      color = "error";
      break;
  }

  return (
    <Chip
      sx={{ mr: 1 }}
      size="small"
      label={label}
      variant="outlined"
      color={color}
    />
  );
};
