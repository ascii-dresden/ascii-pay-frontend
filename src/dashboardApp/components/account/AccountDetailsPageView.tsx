import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RLink } from "react-router-dom";
import { FullScreenLoader } from "../FullScreenLoader";
import { TransactionListView } from "../transaction/TransactionListView";
import React, { useEffect } from "react";
import { useGetAccountQuery } from "../../redux/api/accountApi";
import { toast } from "react-toastify";
import { CoinAmountView } from "../transaction/CoinAmountView";
import { RoleChip } from "./RoleChip";
import { AccountDetailsActionButton } from "./AccountDetailsActionButton";

export const AccountDetailsPageView = (props: {
  accountId: number;
  isRoot?: boolean;
}) => {
  const {
    isLoading,
    isError,
    error,
    data: account,
  } = useGetAccountQuery(props.accountId);

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
                {props.isRoot && account.role !== "Admin" ? null : (
                  <RoleChip role={account.role} />
                )}
              </Typography>

              {props.isRoot ? (
                account.role !== "Admin" ? (
                  <RoleChip role={account.role} />
                ) : (
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link
                      underline="hover"
                      color="text.primary"
                      aria-current="page"
                      component={RLink}
                      to="/"
                    >
                      ascii-pay
                    </Link>
                  </Breadcrumbs>
                )
              ) : (
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    underline="hover"
                    color="inherit"
                    component={RLink}
                    to="/"
                  >
                    ascii-pay
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    component={RLink}
                    to="/accounts"
                  >
                    Accounts
                  </Link>
                  <Link
                    underline="hover"
                    color="text.primary"
                    aria-current="page"
                    component={RLink}
                    to={`/accounts/${props.accountId}/`}
                  >
                    {account.name}
                  </Link>
                </Breadcrumbs>
              )}
            </div>

            <AccountDetailsActionButton account={account} />
          </Toolbar>
        </Box>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: "100%", p: 2 }} elevation={4}>
            <Typography gutterBottom variant="h6" component="div">
              Balance
            </Typography>
            <CoinAmountView coins={account.balance} negativeIsError={true} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: "100%", p: 2 }} elevation={4}>
            <Typography gutterBottom variant="h6" component="div">
              Email
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
