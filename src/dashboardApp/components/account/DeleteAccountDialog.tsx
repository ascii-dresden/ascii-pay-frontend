import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDeleteAccountMutation } from "../../redux/api/accountApi";
import { AccountDto } from "../../../common/contracts";
import { Close } from "@mui/icons-material";

export const DeleteAccountDialog = (props: {
  account: AccountDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [deleteAccount, { isLoading, isError, error, isSuccess }] =
    useDeleteAccountMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account deleted successfully!");
      props.setOpen(false);
    } else if (isError) {
      toast.error("Account could not be deleted!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = () => {
    deleteAccount(props.account.id);
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle component="div">
        <Typography variant="h5">Delete account?</Typography>
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
          Do you want to permanently delete the account{" "}
          <b>{props.account.name}</b>? This will anonymize all transactions of
          this account. This action cannot be undone!
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          fullWidth
          sx={{ mx: 2, py: 1.5 }}
          onClick={handleSubmit}
          loading={isLoading}
          color="error"
        >
          Delete Account
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
