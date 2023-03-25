import {
  AccountDto,
  AuthMethodDtoNfcBased,
  AuthMethodDtoPasswordBased,
} from "../../../common/contracts";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { Close, CreditCardOutlined, List, VpnKey } from "@mui/icons-material";
import {
  useCreateAccountPasswordResetTokenMutation,
  useDeleteAccountNfcAuthenticationMutation,
  useDeleteAccountPasswordAuthenticationMutation,
  useDeleteAccountPublicTabAuthenticationMutation,
  useUpdateAccountPublicTabAuthenticationMutation,
} from "../../redux/api/accountApi";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";

export const AccountAuthenticationDialog = (props: {
  account: AccountDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [resetToken, setResetToken] = React.useState<string | null>(null);
  const tableRows: React.ReactNode[] = [];

  const authPassword = props.account.auth_methods.find(
    (a) => a.type === "PasswordBased"
  );
  if (authPassword?.type === "PasswordBased") {
    tableRows.push(
      <AuthMethodRowPasswordBased
        key="PasswordBased"
        auth={authPassword}
        account={props.account}
      />
    );
  } else if (resetToken !== null) {
    tableRows.push(
      <AuthMethodRowPasswordBasedResetToken
        key="PasswordBased"
        resetToken={resetToken}
        account={props.account}
        setResetToken={setResetToken}
      />
    );
  } else {
    tableRows.push(
      <AuthMethodRowPasswordBasedMissing
        key="PasswordBased"
        account={props.account}
        setResetToken={setResetToken}
      />
    );
  }

  const authPublicTab = props.account.auth_methods.find(
    (a) => a.type === "PublicTab"
  );
  if (authPublicTab?.type === "PublicTab") {
    tableRows.push(
      <AuthMethodPublicTab key="PublicTab" account={props.account} />
    );
  } else {
    tableRows.push(
      <AuthMethodPublicTabDisabled key="PublicTab" account={props.account} />
    );
  }

  const authNfc = props.account.auth_methods.filter(
    (a) => a.type === "NfcBased"
  );
  for (const authNfcElement of authNfc) {
    if (authNfcElement.type === "NfcBased") {
      tableRows.push(
        <AuthMethodRowNfcBased
          key={"NfcBased-" + authNfcElement.card_id}
          account={props.account}
          auth={authNfcElement}
        />
      );
    }
  }

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle component="div">
        <Typography variant="h5">
          {t("account.action.authenticationMethods")}
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
      <DialogContent dividers={true} sx={{ p: 0 }}>
        <Box minWidth={480}>
          <TableContainer>
            <Table aria-label="Authentication method table">
              <TableBody>{tableRows}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const AuthMethodRowPasswordBasedMissing = (props: {
  account: AccountDto;
  setResetToken: (token: string | null) => void;
}) => {
  const { t } = useTranslation();
  const [createResetToken, { isLoading, isError, error, isSuccess, data }] =
    useCreateAccountPasswordResetTokenMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password reset token created successfully!");
      if (data) {
        props.setResetToken(data.token);
      }
    } else if (isError) {
      toast.error("Password reset token could not be created!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleAction = () => {
    createResetToken(props.account.id);
  };

  return (
    <>
      <TableRow>
        <TableCell width={72}>
          <Avatar>
            <VpnKey />
          </Avatar>
        </TableCell>
        <TableCell>
          <Typography>
            {t("account.authentication.passwordAuthentication")}
          </Typography>
          <Typography variant="caption" color="grey">
            {t("account.authentication.passwordUnset")}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              onClick={handleAction}
              loading={isLoading}
              variant="outlined"
            >
              {t("account.authentication.passwordSetup")}
            </LoadingButton>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodRowPasswordBasedResetToken = (props: {
  account: AccountDto;
  resetToken: string;
  setResetToken: (token: string | null) => void;
}) => {
  const { t } = useTranslation();
  const handleAction = () => {
    props.setResetToken(null);
  };

  const link = `${window.location.origin}/reset-password?token=${props.resetToken}`;

  return (
    <>
      <TableRow>
        <TableCell width={72}>
          <Avatar>
            <VpnKey />
          </Avatar>
        </TableCell>
        <TableCell>
          <Typography>
            {t("account.authentication.passwordAuthentication")}
          </Typography>
          <Link href={link}>
            <Typography variant="caption">{link}</Typography>
          </Link>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={handleAction}>
              {t("account.authentication.passwordRevoke")}
            </Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodRowPasswordBased = (props: {
  account: AccountDto;
  auth: AuthMethodDtoPasswordBased;
}) => {
  const { t } = useTranslation();
  const [deletePassword, { isLoading, isError, error, isSuccess }] =
    useDeleteAccountPasswordAuthenticationMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password deleted successfully!");
    } else if (isError) {
      toast.error("Password could not be deleted!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleAction = () => {
    deletePassword(props.account.id);
  };

  return (
    <>
      <TableRow>
        <TableCell width={72}>
          <Avatar>
            <VpnKey />
          </Avatar>
        </TableCell>
        <TableCell>
          <Typography>
            {t("account.authentication.passwordAuthentication")}
          </Typography>
          <Typography variant="caption">{props.auth.username}</Typography>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              onClick={handleAction}
              loading={isLoading}
              variant="outlined"
            >
              {t("account.authentication.passwordRevoke")}
            </LoadingButton>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodRowNfcBased = (props: {
  account: AccountDto;
  auth: AuthMethodDtoNfcBased;
}) => {
  const { t } = useTranslation();
  const [deleteNfc, { isLoading, isError, error, isSuccess }] =
    useDeleteAccountNfcAuthenticationMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Nfc card deleted successfully!");
    } else if (isError) {
      toast.error("Nfc card could not be deleted!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleAction = () => {
    deleteNfc({
      id: props.account.id,
      auth: {
        card_id: props.auth.card_id,
      },
    });
  };

  return (
    <>
      <TableRow>
        <TableCell width={72}>
          <Avatar>
            <CreditCardOutlined />
          </Avatar>
        </TableCell>
        <TableCell>
          <Typography>
            {t("account.authentication.nfcAuthentication")}
          </Typography>
          <Typography variant="caption">{props.auth.name}</Typography>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              onClick={handleAction}
              loading={isLoading}
              variant="outlined"
            >
              {t("account.authentication.nfcDelete")}
            </LoadingButton>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodPublicTab = (props: { account: AccountDto }) => {
  const { t } = useTranslation();
  const [deletePublicTab, { isLoading, isError, error, isSuccess }] =
    useDeleteAccountPublicTabAuthenticationMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Public tab disabled successfully!");
    } else if (isError) {
      toast.error("Public could not be disabled!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleAction = () => {
    deletePublicTab(props.account.id);
  };

  return (
    <>
      <TableRow>
        <TableCell width={72}>
          <Avatar>
            <List />
          </Avatar>
        </TableCell>
        <TableCell>
          <Typography>
            {t("account.authentication.publicTabAuthentication")}
          </Typography>
          <Typography variant="caption">
            {t("account.authentication.publicTabEnabled")}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              onClick={handleAction}
              loading={isLoading}
              variant="outlined"
            >
              {t("account.authentication.publicTabDisable")}
            </LoadingButton>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodPublicTabDisabled = (props: { account: AccountDto }) => {
  const { t } = useTranslation();
  const [updatePublicTab, { isLoading, isError, error, isSuccess }] =
    useUpdateAccountPublicTabAuthenticationMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Public tab enabled successfully!");
    } else if (isError) {
      toast.error("Public tab could not be enabled!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleAction = () => {
    updatePublicTab(props.account.id);
  };

  return (
    <>
      <TableRow>
        <TableCell width={72}>
          <Avatar>
            <List />
          </Avatar>
        </TableCell>
        <TableCell>
          <Typography>
            {t("account.authentication.publicTabAuthentication")}
          </Typography>
          <Typography variant="caption" color="grey">
            {t("account.authentication.publicTabDisabled")}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              onClick={handleAction}
              loading={isLoading}
              variant="outlined"
            >
              {t("account.authentication.publicTabEnable")}
            </LoadingButton>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};
