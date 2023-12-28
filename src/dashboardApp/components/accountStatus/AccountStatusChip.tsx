import { AccountStatusDto } from "../../../common/contracts";
import { Chip, useTheme } from "@mui/material";
import { getStatusColor } from "../../../common/statusColors";

export const AccountStatusChip = (props: {
  status: AccountStatusDto | null;
}) => {
  const theme = useTheme();

  if (!props.status) {
    return null;
  }

  const color = getStatusColor(props.status.color, theme.palette.mode);

  return (
    <Chip
      sx={{ mr: 1 }}
      size="small"
      label={props.status.name}
      style={{ borderColor: color, backgroundColor: color }}
    />
  );
};
