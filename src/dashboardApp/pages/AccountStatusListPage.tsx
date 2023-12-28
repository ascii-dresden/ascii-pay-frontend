import {
  Avatar,
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
import {
  accountStatusApi,
  useGetAllAccountStatusQuery,
} from "../redux/api/accountStatusApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Add } from "@mui/icons-material";
import { CreateAccountStatusDialog } from "../components/accountStatus/CreateAccountStatusDialog";
import { stringWithoutColorAvatar } from "../../common/stringAvatar";
import { AccountStatusDto } from "../../common/contracts";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { usePageTitle } from "../components/usePageTitle";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { ActionButtonAction } from "../components/ActionButton";
import { AccountStatusActionButton } from "../components/accountStatus/AccountStatusActionButton";
import { DefaultTablePagination } from "../components/DefaultTablePagination";
import { useDashboardDispatch } from "../redux/dashboardStore";
import { PullToRefreshWrapper } from "../components/PullToRefresh";
import { getStatusColor } from "../../common/statusColors";

export const AccountStatusListPage = () => {
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const {
    isLoading,
    isError,
    error,
    data: accountStatus,
  } = useGetAllAccountStatusQuery();
  const dispatch = useDashboardDispatch();

  const handleRefresh = () => {
    dispatch(accountStatusApi.util?.invalidateTags(["AccountStatus"]));
  };

  usePageTitle(t("layout.accountStatus"));

  useEffect(() => {
    if (isError) {
      toast.error("Could not load accountStatus!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.accountStatus"),
      target: "/accountStatus",
    },
  ];

  const actions: ActionButtonAction[] = [
    {
      label: t("accountStatus.action.createAccountStatus"),
      icon: <Add />,
      action: () => setOpenModal(true),
    },
  ];

  if (isLoading || accountStatus === undefined) {
    return (
      <PaperScreenLoader>
        <PageHeader navigation={navigation} actions={actions}>
          <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
            {t("layout.accountStatus")}
          </Typography>
        </PageHeader>
      </PaperScreenLoader>
    );
  }

  let sortedAccountStatus: AccountStatusDto[] = [...accountStatus];
  sortedAccountStatus.sort((a, b) => {
    let priorityDiff = a.priority - b.priority;
    if (priorityDiff != 0) {
      return priorityDiff;
    }
    return a.name.localeCompare(b.name);
  });

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - sortedAccountStatus.length)
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

  const slicedAccountStatus =
    rowsPerPage > 0
      ? sortedAccountStatus.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : sortedAccountStatus;

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
      <Container maxWidth="lg">
        <PageHeader navigation={navigation} actions={actions}>
          <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
            {t("layout.accountStatus")}
          </Typography>
        </PageHeader>

        <Paper elevation={4}>
          <TableContainer>
            <Table aria-label="AccountStatus table">
              <TableHead>
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    width={72}
                    align="center"
                  ></TableCell>
                  <TableCell>{t("accountStatus.name")}</TableCell>
                  <TableCell width={128}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slicedAccountStatus.map((accountStatus) => (
                  <AccountStatusListRow
                    key={accountStatus.id}
                    accountStatus={accountStatus}
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
            count={sortedAccountStatus.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <CreateAccountStatusDialog open={openModal} setOpen={setOpenModal} />
      </Container>
    </PullToRefreshWrapper>
  );
};

const AccountStatusListRow = (props: { accountStatus: AccountStatusDto }) => {
  const theme = useTheme();
  return (
    <>
      <TableRow style={{ height: 78 }}>
        <TableCell>
          <Avatar
            alt={props.accountStatus.priority.toString()}
            variant="rounded"
            sx={{
              bgcolor: getStatusColor(
                props.accountStatus.color,
                theme.palette.mode
              ),
            }}
            {...stringWithoutColorAvatar(
              props.accountStatus.priority.toString()
            )}
          />
        </TableCell>
        <TableCell>
          <Typography>{props.accountStatus.name}</Typography>
        </TableCell>
        <TableCell width={128}>
          <AccountStatusActionButton
            accountStatus={props.accountStatus}
            showNavigationOption
          />
        </TableCell>
      </TableRow>
    </>
  );
};
