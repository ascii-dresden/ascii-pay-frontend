import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { FullScreenLoader } from "../FullScreenLoader";
import { TransactionListView } from "../transaction/TransactionListView";
import React, { useEffect, useState } from "react";
import { useGetAccountQuery } from "../../redux/api/accountApi";
import { toast } from "react-toastify";
import { Edit, LockOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { UpdateAccountDialog } from "./UpdateAccountDialog";
import { CoinAmountView } from "../transaction/CoinAmountView";
import { CreatePaymentDialog } from "../transaction/CreatePaymentDialog";
import { RoleChip } from "./RoleChip";
import { AccountAuthenticationDialog } from "./AccountAuthenticationDialog";

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

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);

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

            <div>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ShoppingCartOutlined />}
                sx={{ whiteSpace: "nowrap", width: "9rem" }}
                onClick={() => setOpenPaymentModal(true)}
              >
                Payment
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<LockOutlined />}
                sx={{ whiteSpace: "nowrap", width: "11rem", ml: 2 }}
                onClick={() => setOpenAuthModal(true)}
              >
                Authentication
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Edit />}
                sx={{ whiteSpace: "nowrap", width: "7rem", ml: 2 }}
                onClick={() => setOpenEditModal(true)}
              >
                Edit
              </Button>
            </div>
          </Toolbar>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", mb: 4 }}>
        <Paper sx={{ mr: 4, flex: "1 1 100%" }} elevation={4}>
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="h6" component="div">
              Balance
            </Typography>
            <CoinAmountView coins={account.balance} />
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

      <UpdateAccountDialog
        account={account}
        open={openEditModal}
        setOpen={setOpenEditModal}
      />

      <CreatePaymentDialog
        accountId={props.accountId}
        open={openPaymentModal}
        setOpen={setOpenPaymentModal}
      />

      <AccountAuthenticationDialog
        account={account}
        open={openAuthModal}
        setOpen={setOpenAuthModal}
      />
    </Container>
  );
};
