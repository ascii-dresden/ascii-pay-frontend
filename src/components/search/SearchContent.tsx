import React from "react";
import { useSearchHook } from "./useSearchHook";
import { AccountDto, ProductDto } from "../../redux/api/contracts";
import { styled } from "@mui/material/styles";
import { alpha, Avatar, Typography } from "@mui/material";
import { stringAvatar, stringWithoutColorAvatar } from "../stringAvatar";
import { BASE_URL } from "../../redux/api/customFetchBase";
import { TagChip } from "../product/TagChip";
import { CoinAmountView } from "../transaction/CoinAmountView";
import { RoleChip } from "../account/RoleChip";
import { useNavigate } from "react-router-dom";
import { AccountListRowActionButton } from "../../pages/AccountListPage";
import { ProductListRowActionButton } from "../../pages/ProductListPage";

const StyledRow = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `solid 1px ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
}));
const StyledRowIcon = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
}));
const StyledRowContent = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
}));
const StyledRowCoins = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
}));
const StyledRowActions = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const SearchContent = (props: {
  search: string;
  onClose: () => void;
}) => {
  const { isLoading, results } = useSearchHook(props.search, 20);

  const rows = results.map((r, i) => {
    switch (r.type) {
      case "account":
        return (
          <SearchAccountRow
            key={i}
            account={r.account}
            onClose={props.onClose}
          />
        );
      case "product":
        return (
          <SearchProductRow
            key={i}
            product={r.product}
            onClose={props.onClose}
          />
        );
    }
  });

  return <div>{rows}</div>;
};

const SearchAccountRow = (props: {
  account: AccountDto;
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    props.onClose();
    navigate(`/accounts/${props.account.id}`);
  };

  return (
    <StyledRow onClick={handleAction}>
      <StyledRowIcon>
        <Avatar
          alt={props.account.name}
          {...stringAvatar(props.account.name)}
        />
      </StyledRowIcon>
      <StyledRowContent>
        <Typography>{props.account.name}</Typography>
        <RoleChip role={props.account.role} />
      </StyledRowContent>
      <StyledRowCoins>
        <CoinAmountView coins={props.account.balance} negativeIsError={true} />
      </StyledRowCoins>
      <StyledRowActions onClick={(e) => e.stopPropagation()}>
        <AccountListRowActionButton account={props.account} hidePrimaryAction />
      </StyledRowActions>
    </StyledRow>
  );
};

const SearchProductRow = (props: {
  product: ProductDto;
  onClose: () => void;
}) => {
  return (
    <StyledRow>
      <StyledRowIcon>
        <Avatar
          alt={props.product.name}
          src={`${BASE_URL}/product/${props.product.id}/image`}
          variant="square"
          {...stringWithoutColorAvatar(props.product.name)}
        />
      </StyledRowIcon>
      <StyledRowContent>
        <Typography>{props.product.name}</Typography>
        <Typography variant="caption">{props.product.nickname}</Typography>

        {props.product.tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
      </StyledRowContent>
      <StyledRowCoins>
        <CoinAmountView coins={props.product.price} />
      </StyledRowCoins>
      <StyledRowActions onClick={(e) => e.stopPropagation()}>
        <ProductListRowActionButton product={props.product} hidePrimaryAction />
      </StyledRowActions>
    </StyledRow>
  );
};
