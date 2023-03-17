import { useGetAccountQuery } from "../../redux/api/accountApi";
import { Avatar, Box, Typography } from "@mui/material";
import { stringAvatar } from "../../../common/stringAvatar";
import { RoleChip } from "../account/RoleChip";
import React from "react";
import { AuthMethodTypeDto } from "../../../common/contracts";
import { CreditCardOutlined, List, VpnKey } from "@mui/icons-material";

export const TransactionListRowAuthorization = (props: {
  accountId: number;
  auth_method: AuthMethodTypeDto | null;
}) => {
  const { isLoading, data: account } = useGetAccountQuery(props.accountId);

  if (isLoading) {
    return <span>Loading...</span>;
  }
  if (!account) {
    return <span>Error...</span>;
  }

  let method = null;
  switch (props.auth_method) {
    case "PasswordBased":
      method = (
        <>
          <VpnKey sx={{ mr: 1, opacity: 0.6 }} />
          <Typography>PasswordBased</Typography>
        </>
      );
      break;
    case "NfcBased":
      method = (
        <>
          <CreditCardOutlined sx={{ mr: 1, opacity: 0.6 }} />
          <Typography>NfcBased</Typography>
        </>
      );
      break;
    case "PublicTab":
      method = (
        <>
          <List sx={{ mr: 1, opacity: 0.6 }} />
          <Typography>PublicTab</Typography>
        </>
      );
      break;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography>Authorization:</Typography>
      <Avatar
        alt={account.name}
        {...stringAvatar(account.name)}
        sx={{ mx: 2 }}
      />
      <Typography sx={{ mr: 2 }}>{account.name}</Typography>
      <RoleChip role={account.role} />
      {method}
    </Box>
  );
};
