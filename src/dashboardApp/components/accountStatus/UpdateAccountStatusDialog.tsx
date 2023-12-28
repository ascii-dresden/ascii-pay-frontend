import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateAccountStatusMutation } from "../../redux/api/accountStatusApi";
import {
  AccountStatusDto,
  SaveAccountStatusDto,
} from "../../../common/contracts";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getStatusColors } from "../../../common/statusColors";

export const UpdateAccountStatusDialog = (props: {
  accountStatus: AccountStatusDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [updateAccountStatus, { isLoading, isError, error, isSuccess }] =
    useUpdateAccountStatusMutation();

  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("");
  const [priority, setPriority] = React.useState(0);

  React.useEffect(() => {
    setName(props.accountStatus.name);
    setColor(props.accountStatus.color);
    setPriority(props.accountStatus.priority);
  }, [props.accountStatus]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("AccountStatus updated successfully!");
      props.setOpen(false);
    } else if (isError) {
      toast.error("AccountStatus could not be updated!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = () => {
    let saveAccountStatus: SaveAccountStatusDto = {
      name,
      priority,
      color,
    };
    updateAccountStatus({
      id: props.accountStatus.id,
      accountStatus: saveAccountStatus,
    });
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle component="div">
        <Typography variant="h5">
          {t("accountStatus.edit.updateTitle")}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={() => props.setOpen(false)}
          sx={{
            position: "absolute",
            right: 16,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box pt={1}>
          <TextField
            label={t("accountStatus.name")}
            fullWidth
            sx={{ mb: "1rem" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label={t("accountStatus.priority")}
            fullWidth
            sx={{ mb: "1rem" }}
            value={priority}
            type="number"
            onChange={(e) =>
              setPriority(
                isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
              )
            }
          />
          <TextField
            label={t("accountStatus.color")}
            fullWidth
            select
            sx={{ mb: "1rem" }}
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            {getStatusColors().map((c) => (
              <MenuItem value={c}>{c}</MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          fullWidth
          sx={{ mx: 2, py: 1.5 }}
          onClick={handleSubmit}
          loading={isLoading}
        >
          {t("accountStatus.edit.updateAction")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
