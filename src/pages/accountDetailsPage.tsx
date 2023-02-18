import { Box, Container, Paper, Typography } from "@mui/material";
import FullScreenLoader from "../components/FullScreenLoader";
import { TransactionList } from "../components/transaction/transactions.list";
import React, { useEffect } from "react";
import { useGetAccountQuery } from "../redux/api/accountApi";
import { toast } from "react-toastify";

export const AccountDetailsPage = (props: { accountId: number }) => {
  const {
    isLoading,
    isError,
    error,
    data: account,
  } = useGetAccountQuery(props.accountId);

  useEffect(() => {
    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !account) {
    return <FullScreenLoader />;
  }

  return (
    <Container maxWidth="lg">
      <Paper>
        <Box sx={{ p: 2, mb: 2 }}>
          <Typography gutterBottom>
            <strong>Id:</strong> {account.id}
          </Typography>
          <Typography gutterBottom>
            <strong>Full Name:</strong> {account.name}
          </Typography>
          <Typography gutterBottom>
            <strong>Email Address:</strong> {account.email}
          </Typography>
          <Typography gutterBottom>
            <strong>Role:</strong> {account.role}
          </Typography>
        </Box>
      </Paper>

      <TransactionList account={account} />
    </Container>
  );
};
