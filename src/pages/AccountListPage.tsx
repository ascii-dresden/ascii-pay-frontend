import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Container,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { useGetAllAccountsQuery } from "../redux/api/accountApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Add } from "@mui/icons-material";
import { CreateAccountDialog } from "../components/account/CreateAccountDialog";
import { useNavigate } from "react-router-dom";
import { stringAvatar } from "../components/stringAvatar";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { UpdateAccountDialog } from "../components/account/UpdateAccountDialog";
import { AccountDto } from "../redux/api/contracts";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { DeleteAccountDialog } from "../components/account/DeleteAccountDialog";
import { RoleChip } from "../components/account/RoleChip";

export const AccountListPage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: accounts,
  } = useGetAllAccountsQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Could not load accounts!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const header = (
    <Paper elevation={0}>
      <Box sx={{ px: 1, py: 2, mb: 3 }}>
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
              Accounts
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate("/")}
              >
                ascii-pay
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                aria-current="page"
                onClick={() => navigate("/accounts")}
              >
                Accounts
              </Link>
            </Breadcrumbs>
          </div>

          <Button
            variant="outlined"
            size="large"
            startIcon={<Add />}
            sx={{ whiteSpace: "nowrap", width: "13rem" }}
            onClick={() => setOpenModal(true)}
          >
            New account
          </Button>
        </Toolbar>
      </Box>
    </Paper>
  );

  if (isLoading || accounts === undefined) {
    return <PaperScreenLoader>{header}</PaperScreenLoader>;
  }

  return (
    <Container maxWidth="lg">
      {header}
      <TableContainer component={Paper} elevation={4}>
        <Table aria-label="Account table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.map((account) => (
              <AccountListRow key={account.id} account={account} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateAccountDialog open={openModal} setOpen={setOpenModal} />
    </Container>
  );
};

const AccountListRow = (props: { account: AccountDto }) => {
  const navigate = useNavigate();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <Avatar
            alt={props.account.name}
            {...stringAvatar(props.account.name)}
          />
        </TableCell>
        <TableCell>
          <Typography>{props.account.name}</Typography>
          <RoleChip role={props.account.role} />
        </TableCell>
        <TableCell>{props.account.email}</TableCell>
        <TableCell>
          <CoinAmountView coins={props.account.balance} />
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => navigate(`/accounts/${props.account.id}`)}>
              Profile
            </Button>
            <Button onClick={() => setOpenUpdateModal(true)}>Edit</Button>
            <Button onClick={() => setOpenDeleteModal(true)}>Delete</Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
      <UpdateAccountDialog
        account={props.account}
        open={openUpdateModal}
        setOpen={setOpenUpdateModal}
      />
      <DeleteAccountDialog
        account={props.account}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
};
