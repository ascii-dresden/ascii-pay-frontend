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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateAccountMutation } from "../../redux/api/accountApi";
import { AccountDto, RoleDto, SaveAccountDto } from "../../../common/contracts";
import { Close } from "@mui/icons-material";
import { useDashboardSelector } from "../../redux/dashboardStore";
import { useTranslation } from "react-i18next";

export const UpdateAccountDialog = (props: {
  account: AccountDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const user = useDashboardSelector((state) => state.userState.user);
  const [updateAccount, { isLoading, isError, error, isSuccess }] =
    useUpdateAccountMutation();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<RoleDto>("Basic");
  const [enableMonthlyMailReport, setEnableMonthlyMailReport] =
    React.useState(false);
  const [enableAutomaticStampUsage, setEnableAutomaticStampUsage] =
    React.useState(true);

  React.useEffect(() => {
    setName(props.account.name);
    setEmail(props.account.email);
    setRole(props.account.role);
    setEnableMonthlyMailReport(props.account.enable_monthly_mail_report);
    setEnableAutomaticStampUsage(props.account.enable_automatic_stamp_usage);
  }, [props.account]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account updated successfully!");
      props.setOpen(false);
    } else if (isError) {
      toast.error("Account could not be updated!");
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
      status_id: null,
    };
    updateAccount({
      id: props.account.id,
      account: saveAccount,
    });
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle component="div">
        <Typography variant="h5">{t("account.edit.updateTitle")}</Typography>
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
            label={t("account.edit.name")}
            fullWidth
            sx={{ mb: "1rem" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label={t("account.edit.email")}
            fullWidth
            sx={{ mb: "1rem" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {user?.role === "Admin" ? (
            <TextField
              label={t("account.edit.role")}
              fullWidth
              select
              sx={{ mb: "1rem" }}
              value={role}
              onChange={(e) => setRole(e.target.value as RoleDto)}
            >
              <MenuItem value="Basic">{t("account.role.basic")}</MenuItem>
              <MenuItem value="Member">{t("account.role.member")}</MenuItem>
              <MenuItem value="Admin">{t("account.role.admin")}</MenuItem>
            </TextField>
          ) : null}

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={enableMonthlyMailReport}
                  onChange={(e) => setEnableMonthlyMailReport(e.target.checked)}
                />
              }
              label={t("account.edit.enableMonthlyMailReport")}
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
              label={t("account.edit.enableAutomaticStampUsage")}
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
          {t("account.edit.updateAction")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
