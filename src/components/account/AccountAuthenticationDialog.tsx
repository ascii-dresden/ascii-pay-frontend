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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { Close, CreditCardOutlined, List, VpnKey } from "@mui/icons-material";

export const AccountAuthenticationDialog = (props: {
  account: AccountDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const tableRows: React.ReactNode[] = [];

  const authPassword = props.account.auth_methods.find(
    (a) => a.type === "PasswordBased"
  );
  if (authPassword?.type === "PasswordBased") {
    tableRows.push(
      <AuthMethodRowPasswordBased key="PasswordBased" auth={authPassword} />
    );
  } else {
    tableRows.push(<AuthMethodRowPasswordBasedMissing key="PasswordBased" />);
  }

  const authPublicTab = props.account.auth_methods.find(
    (a) => a.type === "PublicTab"
  );
  if (authPublicTab?.type === "PublicTab") {
    tableRows.push(<AuthMethodPublicTab key="PublicTab" />);
  } else {
    tableRows.push(<AuthMethodPublicTabDisabled key="PublicTab" />);
  }

  const authNfc = props.account.auth_methods.filter(
    (a) => a.type === "NfcBased"
  );
  for (const authNfcElement of authNfc) {
    if (authNfcElement.type === "NfcBased") {
      tableRows.push(
        <AuthMethodRowNfcBased
          key={"NfcBased-" + authNfcElement.card_id}
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
            <Table aria-label="Nfc card table">
              <TableBody>{tableRows}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const AuthMethodRowPasswordBasedMissing = () => {
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
            <Button>Setup</Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodRowPasswordBased = (props: {
  auth: AuthMethodDtoPasswordBased;
}) => {
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
            <Button>Delete</Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodRowNfcBased = (props: { auth: AuthMethodDtoNfcBased }) => {
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
            <Button>Delete</Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodPublicTab = () => {
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
            <Button>Disable</Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuthMethodPublicTabDisabled = () => {
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
            <Button>Enable</Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    </>
  );
};
