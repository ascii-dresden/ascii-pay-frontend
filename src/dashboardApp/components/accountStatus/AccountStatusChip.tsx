import { AccountStatusDto } from "../../../common/contracts";
import { Chip } from "@mui/material";

export const AccountStatusChip = (props: {
  status: AccountStatusDto | null;
}) => {
  if (!props.status) {
    return null;
  }

  return (
    <Chip
      sx={{ mr: 1 }}
      size="small"
      label={props.status.name}
      variant="outlined"
      color="info"
    />
  );
};
