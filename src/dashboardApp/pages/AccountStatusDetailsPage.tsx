import {
  Avatar,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  accountStatusApi,
  useGetAccountStatusQuery,
} from "../redux/api/accountStatusApi";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { stringWithoutColorAvatar } from "../../common/stringAvatar";
import { AccountStatusActionButton } from "../components/accountStatus/AccountStatusActionButton";
import { usePageTitle } from "../components/usePageTitle";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { useDashboardDispatch } from "../redux/dashboardStore";
import { PullToRefreshWrapper } from "../components/PullToRefresh";
import { getStatusColor } from "../../common/statusColors";

export const AccountStatusDetailsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  let params = useParams();
  let accountStatusId = parseInt(params.accountStatusId ?? "");

  const {
    isLoading,
    isError,
    error,
    data: accountStatus,
  } = useGetAccountStatusQuery(accountStatusId);
  const dispatch = useDashboardDispatch();

  const handleRefresh = () => {
    dispatch(
      accountStatusApi.util?.invalidateTags([
        { type: "AccountStatus", id: accountStatusId },
      ])
    );
  };

  usePageTitle([
    t("layout.accountStatus"),
    accountStatus?.name ?? t("layout.loading"),
  ]);

  useEffect(() => {
    if (isError) {
      toast.error("Could not load accountStatus!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !accountStatus) {
    return <FullScreenLoader />;
  }

  let navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.accountStatus"),
      target: "/accountStatus",
    },
    {
      label: accountStatus.name,
      target: `/accountStatus/${accountStatusId}`,
    },
  ];

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
      <Container maxWidth="lg">
        <PageHeader
          navigation={navigation}
          actionButtonView={
            <AccountStatusActionButton accountStatus={accountStatus} />
          }
        >
          <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
            <span style={{ marginRight: "0.6rem" }}>{accountStatus.name}</span>
          </Typography>
        </PageHeader>

        <Box sx={{ mb: 4 }}>
          <Paper sx={{ display: { xs: "block", md: "flex" } }} elevation={4}>
            <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
              <Avatar
                alt={accountStatus.priority.toString()}
                variant="rounded"
                sx={{
                  width: 128,
                  height: 128,
                  border: `solid 1px ${theme.palette.divider}`,
                  bgcolor: getStatusColor(
                    accountStatus.color,
                    theme.palette.mode
                  ),
                }}
                {...stringWithoutColorAvatar(accountStatus.priority.toString())}
              />
            </Box>
            <Box sx={{ p: 2, flexGrow: 1 }}>
              <Table size="small">
                <TableBody>
                  <TableRow
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell
                      width={100}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      {t("accountStatus.name")}
                    </TableCell>
                    <TableCell>{accountStatus.name}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell
                      width={100}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      {t("accountStatus.priority")}
                    </TableCell>
                    <TableCell>{accountStatus.priority}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Box>
      </Container>
    </PullToRefreshWrapper>
  );
};
