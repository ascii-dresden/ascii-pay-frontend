import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RLink } from "react-router-dom";
import { useGetAllAccountsQuery } from "../redux/api/accountApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Add } from "@mui/icons-material";
import { CreateAccountDialog } from "../components/account/CreateAccountDialog";
import { stringAvatar } from "../../common/stringAvatar";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { AccountDto } from "../../common/contracts";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { RoleChip } from "../components/account/RoleChip";
import { AccountListRowActionButton } from "../components/account/AccountListRowActionButton";

export const AccountListPage = () => {
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
      <Box sx={{ px: 1, py: 2, mb: 2 }}>
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
              Accounts
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" component={RLink} to="/">
                ascii-pay
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                aria-current="page"
                component={RLink}
                to="/accounts"
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

  const sortedAccounts = [...accounts];
  sortedAccounts.sort((a, b) => a.name.localeCompare(b.name));

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - sortedAccounts.length)
      : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedAccounts =
    rowsPerPage > 0
      ? sortedAccounts.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : sortedAccounts;
  return (
    <Container maxWidth="lg">
      {header}
      <TableContainer component={Paper} elevation={4}>
        <Table aria-label="Account table">
          <TableHead>
            <TableRow>
              <TableCell width={72}></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell width={250}>Balance</TableCell>
              <TableCell width={150}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedAccounts.map((account) => (
              <AccountListRow key={account.id} account={account} />
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 78 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={5}
                count={accounts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <CreateAccountDialog open={openModal} setOpen={setOpenModal} />
    </Container>
  );
};

const AccountListRow = (props: { account: AccountDto }) => {
  return (
    <>
      <TableRow style={{ height: 78 }}>
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
          <CoinAmountView
            coins={props.account.balance}
            negativeIsError={true}
          />
        </TableCell>
        <TableCell>
          <AccountListRowActionButton account={props.account} />
        </TableCell>
      </TableRow>
    </>
  );
};
