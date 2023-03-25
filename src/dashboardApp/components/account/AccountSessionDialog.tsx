import { AccountDto, SessionDto } from "../../../common/contracts";
import {
  Avatar,
  Box,
  ButtonGroup,
  CircularProgress,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { Close, Token } from "@mui/icons-material";
import {
  useDeleteAccountSessionMutation,
  useLazyGetAllAccountSessionsQuery,
} from "../../redux/api/accountApi";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";

export const AccountSessionDialog = (props: {
  account: AccountDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [trigger, { isLoading, isError, error, data: sessions }] =
    useLazyGetAllAccountSessionsQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Could not load active sessions!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (props.open) {
      trigger(props.account.id);
    }
  }, [props.open]);

  if (isLoading || !sessions) {
    return (
      <Dialog open={props.open} onClose={() => props.setOpen(false)}>
        <DialogTitle component="div">
          <Typography variant="h5">
            {t("account.action.activeSessions")}
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
          <Box
            minWidth={480}
            minHeight={100}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const tableRows = sessions.map((session, index) => {
    return <SessionRow key={index} account={props.account} session={session} />;
  });

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle component="div">
        <Typography variant="h5" onClick={() => trigger(props.account.id)}>
          {t("account.action.activeSessions")}
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
            <Table aria-label="Active sessions table">
              <TableBody>{tableRows}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const SessionRow = (props: { account: AccountDto; session: SessionDto }) => {
  const { t, i18n } = useTranslation();
  const [deleteSession, { isLoading, isError, error, isSuccess }] =
    useDeleteAccountSessionMutation();

  const format = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    dateStyle: "full",
    timeStyle: "medium",
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Session deleted successfully!");
    } else if (isError) {
      toast.error("Session could not be deleted!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleAction = () => {
    deleteSession({
      id: props.account.id,
      session: props.session,
    });
  };

  let label: string;
  switch (props.session.auth_method) {
    case "PasswordBased":
      label = t("account.session.methodPasswordBased");
      break;
    case "NfcBased":
      label = t("account.session.methodNfcBased");
      break;
    case "PublicTab":
      label = t("account.session.methodPublicTab");
      break;
    case "PasswordResetToken":
      label = t("account.session.methodPasswordResetToken");
      break;
  }

  return (
    <TableRow>
      <TableCell width={72}>
        <Avatar>
          <Token />
        </Avatar>
      </TableCell>
      <TableCell>
        <Typography>{label}</Typography>
        <Typography variant="caption">
          {format.format(new Date(props.session.valid_until))}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <LoadingButton
            onClick={handleAction}
            loading={isLoading}
            variant="outlined"
          >
            {t("account.session.revoke")}
          </LoadingButton>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};
