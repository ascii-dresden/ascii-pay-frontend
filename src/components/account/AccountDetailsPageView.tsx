import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { FullScreenLoader } from "../FullScreenLoader";
import { TransactionListView } from "../transaction/TransactionListView";
import React, { useEffect } from "react";
import { useGetAccountQuery } from "../../redux/api/accountApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CoinAmountView } from "../transaction/CoinAmountView";
import { RoleChip } from "./RoleChip";
import { AccountDetailsActionButton } from "./AccountDetailsActionButton";

export const AccountDetailsPageView = (props: {
  accountId: number;
  isRoot?: boolean;
}) => {
  const navigate = useNavigate();
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
        <Box sx={{ px: 1, py: 2, mb: 3 }}>
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

              {props.isRoot ? (
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    underline="hover"
                    color="text.primary"
                    aria-current="page"
                    onClick={() => navigate("/")}
                  >
                    ascii-pay
                  </Link>
                </Breadcrumbs>
              ) : (
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
                    color="inherit"
                    onClick={() => navigate("/accounts")}
                  >
                    Accounts
                  </Link>
                  <Link
                    underline="hover"
                    color="text.primary"
                    aria-current="page"
                    onClick={() => navigate(`/accounts/${props.accountId}/`)}
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

      <Box sx={{ display: "flex", mb: 4 }}>
        <Paper sx={{ mr: 4, flex: "1 1 100%" }} elevation={4}>
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="h6" component="div">
              Balance
            </Typography>
            <CoinAmountView coins={account.balance} negativeIsError={true} />
          </Box>
        </Paper>
        <Paper sx={{ flex: "1 1 100%" }} elevation={4}>
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="h6" component="div">
              Email
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {account.email}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <TransactionListView account={account} />
    </Container>
  );
};
