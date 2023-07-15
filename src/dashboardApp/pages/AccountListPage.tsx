import {
  Avatar,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
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
import { usePageTitle } from "../components/usePageTitle";
import { useTranslation } from "react-i18next";
import { HiddenField } from "../components/HiddenField";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { ActionButtonAction } from "../components/ActionButton";
import { AccountActionButton } from "../components/account/AccountActionButton";

export const AccountListPage = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const {
    isLoading,
    isError,
    error,
    data: accounts,
  } = useGetAllAccountsQuery();

  usePageTitle(t("layout.accounts"));

  useEffect(() => {
    if (isError) {
      toast.error("Could not load accounts!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.accounts"),
      target: "/accounts",
    },
  ];

  const actions: ActionButtonAction[] = [
    {
      label: t("account.action.createAccount"),
      icon: <Add />,
      action: () => setOpenModal(true),
    },
  ];

  if (isLoading || accounts === undefined) {
    return (
      <PaperScreenLoader>
        <PageHeader navigation={navigation} actions={actions}>
          <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
            {t("layout.accounts")}
          </Typography>
        </PageHeader>
      </PaperScreenLoader>
    );
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
      <PageHeader navigation={navigation} actions={actions}>
        <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
          {t("layout.accounts")}
        </Typography>
      </PageHeader>

      <TableContainer component={Paper} elevation={4}>
        <Table aria-label="Account table">
          <TableHead>
            <TableRow>
              <TableCell width={72}></TableCell>
              <TableCell>{t("account.name")}</TableCell>
              <TableCell>{t("account.email")}</TableCell>
              <TableCell width={250}>{t("account.balance")}</TableCell>
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
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  { label: t("layout.rowsPerPageAll"), value: -1 },
                ]}
                labelRowsPerPage={t("layout.rowsPerPage")}
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
        <TableCell>
          <HiddenField>{props.account.email}</HiddenField>
        </TableCell>
        <TableCell>
          <HiddenField>
            <CoinAmountView
              coins={props.account.balance}
              negativeIsError={true}
            />
          </HiddenField>
        </TableCell>
        <TableCell>
          <AccountActionButton account={props.account} showNavigationOption />
        </TableCell>
      </TableRow>
    </>
  );
};
