import { RoleDto } from "../../redux/api/contracts";
import { Chip } from "@mui/material";

export const RoleChip = (props: { role: RoleDto }) => {
  let color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" = "default";

  if (props.role === "Member") {
    color = "primary";
  }
  if (props.role === "Admin") {
    color = "error";
  }

  return (
    <Chip
      sx={{ mr: 2 }}
      size="small"
      label={props.role}
      variant="outlined"
      color={color}
    />
  );
};
