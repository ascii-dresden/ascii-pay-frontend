import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateAccountMutation } from "../../redux/api/accountApi";
import { RoleDto, SaveAccountDto } from "../../../common/contracts";
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
  const [enableMonthlyMailReport, setEnableMonthlyMailReport] =
    React.useState(false);
  const [enableAutomaticStampUsage, setEnableAutomaticStampUsage] =
    React.useState(true);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account created successfully!");
      props.setOpen(false);

      setName("");
      setEmail("");
      setRole("Basic");
      setEnableMonthlyMailReport(false);
      setEnableAutomaticStampUsage(true);
    } else if (isError) {
      toast.error("Account could not be created!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = () => {
    let saveAccount: SaveAccountDto = {
      name,
      email,
      role,
      enable_monthly_mail_report: enableMonthlyMailReport,
      enable_automatic_stamp_usage: enableAutomaticStampUsage,
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

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={enableMonthlyMailReport}
                  onChange={(e) => setEnableMonthlyMailReport(e.target.checked)}
                />
              }
              label="Receive monthly reports by email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={enableAutomaticStampUsage}
                  onChange={(e) =>
                    setEnableAutomaticStampUsage(e.target.checked)
                  }
                />
              }
              label="Automatically use available stamps during payment"
            />
          </FormGroup>
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
          Create Account
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
