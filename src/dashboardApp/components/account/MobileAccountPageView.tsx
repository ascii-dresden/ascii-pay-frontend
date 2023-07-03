import {
  Box,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { FullScreenLoader } from "../FullScreenLoader";
import React, { useEffect } from "react";
import { useGetAccountQuery } from "../../redux/api/accountApi";
import { toast } from "react-toastify";
import { CoinAmountView } from "../transaction/CoinAmountView";
import { RoleChip } from "./RoleChip";
import { AccountDetailsActionButton } from "./AccountDetailsActionButton";
import { usePageTitle } from "../usePageTitle";
import { useTranslation } from "react-i18next";
import { TransactionListView } from "../transaction/TransactionListView";

export const MobileAccountPageView = (props: { accountId: number }) => {
  const { t } = useTranslation();
  const {
    isLoading,
    isError,
    error,
    data: account,
  } = useGetAccountQuery(props.accountId);

  usePageTitle([]);

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

  return (
    <Container maxWidth="lg">
      <Paper elevation={0}>
        <Box sx={{ px: 1, py: 2, mb: 2 }}>
          <Toolbar
            disableGutters={true}
            sx={{ justifyContent: "space-between" }}
          >
            <div>
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h5"
                component="div"
              >
                <span style={{ marginRight: "0.6rem" }}>{account.name}</span>
                <RoleChip role={account.role} />
              </Typography>
              <Typography component="div">{account.email}</Typography>
            </div>
            <AccountDetailsActionButton account={account} minimize={true} />
          </Toolbar>
        </Box>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: "100%", p: 2 }} elevation={4}>
            <Typography gutterBottom variant="h6" component="div">
              {t("account.balance")}
            </Typography>
            <CoinAmountView coins={account.balance} negativeIsError={true} />
          </Paper>
        </Grid>
      </Grid>

      <TransactionListView account={account} />
    </Container>
  );
};
