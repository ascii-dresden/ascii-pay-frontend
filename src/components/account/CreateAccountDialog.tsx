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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateAccountMutation } from "../../redux/api/accountApi";
import { RoleDto, SaveAccountDto } from "../../redux/api/contracts";
import { Close } from "@mui/icons-material";

export const CreateAccountDialog = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [createAccount, { isLoading, isError, error, isSuccess }] =
    useCreateAccountMutation();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<RoleDto>("Basic");

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account created successfully");
      props.setOpen(false);
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) => toast.error(el.message));
      } else {
        toast.error((error as any).data.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = () => {
    let saveAccount: SaveAccountDto = {
      name,
      email,
      role,
    };
    createAccount(saveAccount);
  };

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle component="div">
        <Typography variant="h5">Create a new account</Typography>
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
            label="Name"
            fullWidth
            sx={{ mb: "1rem" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            sx={{ mb: "1rem" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Role"
            fullWidth
            select
            sx={{ mb: "1rem" }}
            value={role}
            onChange={(e) => setRole(e.target.value as RoleDto)}
          >
            <MenuItem value="Basic">Basic</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="outlined"
          fullWidth
          sx={{ mx: 2, py: 1.5 }}
          onClick={handleSubmit}
          loading={isLoading}
        >
          Create Account
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
