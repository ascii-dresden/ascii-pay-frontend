import {
  AccountDto,
  AuthMethodDtoNfcBased,
  AuthMethodDtoPasswordBased,
} from "../../redux/api/contracts";
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

export const AccountAuthenticationDialog = (props: {
  account: AccountDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
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
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle component="div">
        <Typography variant="h5">Authentication methods</Typography>
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
          <Typography>Password authentication</Typography>
          <Typography variant="caption" color="grey">
            Unset
          </Typography>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              onClick={handleAction}
              loading={isLoading}
              variant="outlined"
            >
              Setup
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
          <Typography>Password authentication</Typography>
          <Link href={link}>
            <Typography variant="caption">{link}</Typography>
          </Link>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={handleAction}>Delete</Button>
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
          <Typography>Password authentication</Typography>
          <Typography variant="caption">{props.auth.username}</Typography>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              onClick={handleAction}
              loading={isLoading}
              variant="outlined"
            >
              Delete
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
          <Typography>Nfc card authentication</Typography>
          <Typography variant="caption">{props.auth.name}</Typography>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              onClick={handleAction}
              loading={isLoading}
              variant="outlined"
            >
              Delete
            </LoadingButton>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodPublicTab = (props: { account: AccountDto }) => {
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
          <Typography>Public tab</Typography>
          <Typography variant="caption">enabled</Typography>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              onClick={handleAction}
              loading={isLoading}
              variant="outlined"
            >
              Disable
            </LoadingButton>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodPublicTabDisabled = (props: { account: AccountDto }) => {
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
          <Typography>Public tab</Typography>
          <Typography variant="caption" color="grey">
            disabled
          </Typography>
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              onClick={handleAction}
              loading={isLoading}
              variant="outlined"
            >
              Enable
            </LoadingButton>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};
