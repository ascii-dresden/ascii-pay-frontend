import {
  Container,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FullScreenLoader } from "../FullScreenLoader";
import { TransactionListView } from "../transaction/TransactionListView";
import React, { useEffect } from "react";
import { useGetAccountQuery } from "../../redux/api/accountApi";
import { toast } from "react-toastify";
import { CoinAmountView } from "../transaction/CoinAmountView";
import { RoleChip } from "./RoleChip";
import { AccountActionButton } from "./AccountActionButton";
import { usePageTitle } from "../usePageTitle";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../PageHeader";

export const AccountDetailsPageView = (props: {
  accountId: number;
  isRoot?: boolean;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  const {
    isLoading,
    isError,
    error,
    data: account,
  } = useGetAccountQuery(props.accountId);

  usePageTitle(
    props.isRoot
      ? []
      : [t("layout.accounts"), account?.name ?? t("layout.loading")]
  );

  useEffect(() => {
    if (isError) {
      toast.error("Could not load account!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !account) {
    return <FullScreenLoader />;
  }

  let headerNavigation: PageHeaderNavigation[] | undefined;
  if (props.isRoot && !isMobile) {
    headerNavigation = [];
  } else if (!props.isRoot) {
    headerNavigation = [
      {
        label: t("layout.accounts"),
        target: "/accounts",
      },
      {
        label: account.name,
        target: `/accounts/${props.accountId}`,
      },
    ];
  }

  let headerTitle;
  if (isMobile) {
    headerTitle = (
      <>
        <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
          <span style={{ marginRight: "0.6rem" }}>{account.name}</span>
          <RoleChip role={account.role} />
        </Typography>
        <Typography component="div">{account.email}</Typography>
      </>
    );
  } else {
    headerTitle = (
      <>
        <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
          <span style={{ marginRight: "0.6rem" }}>{account.name}</span>
          {props.isRoot && account.role !== "Admin" ? null : (
            <RoleChip role={account.role} />
          )}
        </Typography>

        {props.isRoot ? (
          account.role !== "Admin" ? (
            <RoleChip role={account.role} />
          ) : null
        ) : null}
      </>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        navigation={headerNavigation}
        actionButtonView={
          <AccountActionButton
            account={account}
            showOptionsForOwnAccount={true}
          />
        }
      >
        {headerTitle}
      </PageHeader>

      <Grid container spacing={4} sx={{ mb: { xs: 2, sm: 4 } }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: "100%", p: 2 }} elevation={4}>
            <Typography gutterBottom variant="h6" component="div">
              {t("account.balance")}
            </Typography>
            <CoinAmountView coins={account.balance} negativeIsError={true} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
          <Paper sx={{ height: "100%", p: 2 }} elevation={4}>
            <Typography gutterBottom variant="h6" component="div">
              {t("account.email")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {account.email}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TransactionListView account={account} />
    </Container>
  );
};
