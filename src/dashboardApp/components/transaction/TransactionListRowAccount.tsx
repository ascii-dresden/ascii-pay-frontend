import { useGetAccountQuery } from "../../redux/api/accountApi";
import { Avatar, Box, Typography } from "@mui/material";
import { stringAvatar } from "../../../common/stringAvatar";
import { RoleChip } from "../account/RoleChip";
import React from "react";

export const TransactionListRowAccount = (props: { accountId: number }) => {
  const { isLoading, data: account } = useGetAccountQuery(props.accountId);

  if (isLoading) {
    return <span>Loading...</span>;
  }
  if (!account) {
    return <span>Error...</span>;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar
        alt={account.name}
        {...stringAvatar(account.name)}
        sx={{ mr: 2 }}
      />
      <Typography sx={{ mr: 2 }}>{account.name}</Typography>
      <RoleChip role={account.role} />
    </Box>
  );
};
