import React from "react";
import { useSearchHook } from "./useSearchHook";
import { AccountDto, ProductDto } from "../../redux/api/contracts";
import { styled } from "@mui/material/styles";
import { alpha, Avatar, CircularProgress, Typography } from "@mui/material";
import { stringAvatar, stringWithoutColorAvatar } from "../stringAvatar";
import { BASE_URL } from "../../redux/api/customFetchBase";
import { TagChip } from "../product/TagChip";
import { CoinAmountView } from "../transaction/CoinAmountView";
import { RoleChip } from "../account/RoleChip";
import { useNavigate } from "react-router-dom";
import { AccountListRowActionButton } from "../../pages/AccountListPage";
import { ProductListRowActionButton } from "../../pages/ProductListPage";
import clsx from "clsx";

const StyledRow = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  borderBottom: `solid 1px ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  height: "5rem",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  "&:hover::before": {
    backgroundColor: alpha(theme.palette.text.primary, 0.04),
  },
  "&.selected::before": {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
  },
  "&.selected:hover::before": {
    backgroundColor: alpha(theme.palette.primary.main, 0.25),
  },
  "&:last-of-type": {
    borderBottom: "none",
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
const StyledRowEmpty = styled("div")(() => ({
  height: "5rem",
  userSelect: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const SearchContent = (props: {
  search: string;
  onClose: () => void;
}) => {
  const { isLoading, results } = useSearchHook(props.search, 6);
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    setSelected(0);
  }, [props.search]);

  const resultCount = results.length;
  const handleKeyAction = React.useMemo(
    () => (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setSelected((s) => {
          if (s + 1 >= resultCount) {
            return -1;
          }
          return s + 1;
        });
      } else if (e.key === "ArrowUp") {
        setSelected((s) => {
          if (s < 0) {
            return resultCount - 1;
          }
          return s - 1;
        });
      }
    },
    [resultCount]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyAction);
    return () => window.removeEventListener("keydown", handleKeyAction);
  }, [handleKeyAction]);

  if (isLoading) {
    return (
      <StyledRowEmpty>
        <CircularProgress />
      </StyledRowEmpty>
    );
  }

  if (props.search === "") {
    return (
      <StyledRowEmpty>
        <span>Type to start searching…</span>
      </StyledRowEmpty>
    );
  }

  if (resultCount === 0) {
    return (
      <StyledRowEmpty>
        <span>Nothing found</span>
      </StyledRowEmpty>
    );
  }

  const rows = results.map((r, i) => {
    switch (r.type) {
      case "account":
        return (
          <SearchAccountRow
            key={i}
            account={r.account}
            onClose={props.onClose}
            isSelected={i === selected}
          />
        );
      case "product":
        return (
          <SearchProductRow
            key={i}
            product={r.product}
            onClose={props.onClose}
            isSelected={i === selected}
          />
        );
    }
  });

  return <>{rows}</>;
};

const SearchAccountRow = (props: {
  account: AccountDto;
  onClose: () => void;
  isSelected: boolean;
}) => {
  const navigate = useNavigate();

  const onClose = props.onClose;
  const accountId = props.account.id;
  const isSelected = props.isSelected;
  const handleAction = React.useMemo(
    () => () => {
      onClose();
      navigate(`/accounts/${accountId}`);
    },
    [onClose, accountId, navigate]
  );

  const handleKeyAction = React.useMemo(
    () => (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleAction();
      }
    },
    [handleAction]
  );

  React.useEffect(() => {
    if (isSelected) {
      window.addEventListener("keydown", handleKeyAction);
      return () => window.removeEventListener("keydown", handleKeyAction);
    }
  }, [handleKeyAction, isSelected]);

  return (
    <StyledRow
      onClick={handleAction}
      className={clsx({
        selected: props.isSelected,
      })}
    >
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
  isSelected: boolean;
}) => {
  const navigate = useNavigate();

  const onClose = props.onClose;
  const productId = props.product.id;
  const isSelected = props.isSelected;
  const handleAction = React.useMemo(
    () => () => {
      onClose();
      navigate(`/products/${productId}`);
    },
    [onClose, productId, navigate]
  );

  const handleKeyAction = React.useMemo(
    () => (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleAction();
      }
    },
    [handleAction]
  );

  React.useEffect(() => {
    if (isSelected) {
      window.addEventListener("keydown", handleKeyAction);
      return () => window.removeEventListener("keydown", handleKeyAction);
    }
  }, [handleKeyAction, isSelected]);

  return (
    <StyledRow
      className={clsx({
        selected: props.isSelected,
      })}
    >
      <StyledRowIcon>
        <Avatar
          alt={props.product.name}
          src={`${BASE_URL}/product/${props.product.id}/image`}
          variant="rounded"
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
