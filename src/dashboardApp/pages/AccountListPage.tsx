import {
  Avatar,
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { accountApi, useGetAllAccountsQuery } from "../redux/api/accountApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Add,
  AdminPanelSettingsOutlined,
  ManageAccountsOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
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
import { DefaultTablePagination } from "../components/DefaultTablePagination";
import { useDashboardDispatch } from "../redux/dashboardStore";
import { PullToRefreshWrapper } from "../components/PullToRefresh";
import styled from "@emotion/styled";
import clsx from "clsx";
import { CreateMultiPaymentDialog } from "../components/transaction/CreateMultiPaymentDialog";
import { UpdateMultiAccountRoleDialog } from "../components/account/UpdateMultiAccountRoleDialog";
import { AccountStatusChip } from "../components/accountStatus/AccountStatusChip";
import { UpdateMultiAccountStatusDialog } from "../components/account/UpdateMultiAccountStatusDialog";

export const AccountListPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [selected, setSelected] = React.useState<readonly number[]>([]);

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openAccountRoleModal, setOpenAccountRoleModal] = useState(false);
  const [openAccountStatusModal, setOpenAccountStatusModal] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: accounts,
  } = useGetAllAccountsQuery();
  const dispatch = useDashboardDispatch();

  const handleRefresh = () => {
    dispatch(accountApi.util?.invalidateTags(["Accounts"]));
  };

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

  const toggleSelectAll = () => {
    setSelected((prevState) => {
      if (prevState.length < accounts.length) {
        return accounts.map((a) => a.id);
      }

      return [];
    });
  };

  const toggleSelected = (account: AccountDto) => {
    setSelected((prevState) => {
      let index = prevState.indexOf(account.id);
      let newState = [...prevState];
      if (index > -1) {
        newState.splice(index, 1);
      } else {
        newState.push(account.id);
      }
      return newState;
    });
  };

  const isSelected = (account: AccountDto) => {
    return selected.indexOf(account.id) > -1;
  };

  const sortedAccounts = [...accounts];
  sortedAccounts.sort((a, b) => a.name.localeCompare(b.name));

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - sortedAccounts.length)
      : 0;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
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

  const selectedHeaderColor =
    theme.palette.mode === "light"
      ? theme.palette.grey["200"]
      : theme.palette.grey["800"];

  const selectedAccounts = sortedAccounts.filter(isSelected);

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
      <Container maxWidth="lg">
        <PageHeader navigation={navigation} actions={actions}>
          <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
            {t("layout.accounts")}
          </Typography>
        </PageHeader>

        <Paper sx={{ overflow: "hidden" }} elevation={4}>
          <TableContainer>
            <Table aria-label="Account table">
              <TableHead>
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    width={72}
                    align="center"
                    style={{
                      backgroundColor:
                        selected.length === 0
                          ? "transparent"
                          : selectedHeaderColor,
                    }}
                  >
                    <Checkbox
                      color="primary"
                      checked={
                        selected.length > 0 &&
                        accounts.length === selected.length
                      }
                      indeterminate={
                        selected.length > 0 && selected.length < accounts.length
                      }
                      onClick={toggleSelectAll}
                    />
                  </TableCell>
                  {selected.length > 0 ? (
                    <TableCell
                      colSpan={4}
                      padding="none"
                      height={56.5}
                      style={{
                        backgroundColor: selectedHeaderColor,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0 16px",
                        }}
                      >
                        <Typography>
                          {t("account.action.multiSelectMessage", {
                            count: selected.length,
                          })}
                        </Typography>
                        <div>
                          <ButtonGroup variant="outlined" size="small">
                            <Button
                              startIcon={<ShoppingCartOutlined />}
                              variant="outlined"
                              size="small"
                              onClick={() => setOpenPaymentModal(true)}
                            >
                              {t("account.action.multiSelectPayment")}
                            </Button>
                            <Button
                              startIcon={<AdminPanelSettingsOutlined />}
                              variant="outlined"
                              size="small"
                              onClick={() => setOpenAccountRoleModal(true)}
                            >
                              {t("account.action.multiSelectSetRole")}
                            </Button>
                            <Button
                              startIcon={<ManageAccountsOutlined />}
                              variant="outlined"
                              size="small"
                              onClick={() => setOpenAccountStatusModal(true)}
                            >
                              {t("account.action.multiSelectSetStatus")}
                            </Button>
                          </ButtonGroup>
                        </div>
                      </div>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell>{t("account.name")}</TableCell>
                      <TableCell>{t("account.email")}</TableCell>
                      <TableCell width={250}>{t("account.balance")}</TableCell>
                      <TableCell width={150}></TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {slicedAccounts.map((account) => (
                  <AccountListRow
                    key={account.id}
                    account={account}
                    selected={isSelected(account)}
                    toggleSelected={toggleSelected}
                    selectionMode={selected.length > 0}
                  />
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 78 * emptyRows }}>
                    <TableCell colSpan={5} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <DefaultTablePagination
            count={accounts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <CreateAccountDialog open={openModal} setOpen={setOpenModal} />

        <CreateMultiPaymentDialog
          accounts={selectedAccounts}
          open={openPaymentModal}
          setOpen={setOpenPaymentModal}
        />
        <UpdateMultiAccountRoleDialog
          accounts={selectedAccounts}
          open={openAccountRoleModal}
          setOpen={setOpenAccountRoleModal}
        />
        <UpdateMultiAccountStatusDialog
          accounts={selectedAccounts}
          open={openAccountStatusModal}
          setOpen={setOpenAccountStatusModal}
        />
      </Container>
    </PullToRefreshWrapper>
  );
};

const StyledCheckableAvatar = styled.div`
  width: 40px;
  height: 40px;

  & > div:first-child {
    display: block;
  }

  & > div:last-child {
    display: none;
  }

  &:hover,
  &.active {
    & > div:first-child {
      display: none;
    }

    & > div:last-child {
      display: block;
    }
  }
`;

const AccountListRow = (props: {
  account: AccountDto;
  selected: boolean;
  toggleSelected: (account: AccountDto) => void;
  selectionMode: boolean;
}) => {
  return (
    <>
      <TableRow style={{ height: 78 }}>
        <TableCell>
          <StyledCheckableAvatar
            className={clsx({ active: props.selectionMode })}
          >
            <div>
              <Avatar
                alt={props.account.name}
                {...stringAvatar(props.account.name)}
              />
            </div>
            <div>
              <Checkbox
                color="primary"
                checked={props.selected}
                onClick={() => props.toggleSelected(props.account)}
              />
            </div>
          </StyledCheckableAvatar>
        </TableCell>
        <TableCell>
          <Typography>{props.account.name}</Typography>
          <RoleChip role={props.account.role} />
          <AccountStatusChip status={props.account.status} />
        </TableCell>
        <TableCell>
          <HiddenField>{props.account.email}</HiddenField>
        </TableCell>
        <TableCell width={250}>
          <HiddenField>
            <CoinAmountView
              coins={props.account.balance}
              negativeIsError={true}
            />
          </HiddenField>
        </TableCell>
        <TableCell width={150}>
          <AccountActionButton account={props.account} showNavigationOption />
        </TableCell>
      </TableRow>
    </>
  );
};
