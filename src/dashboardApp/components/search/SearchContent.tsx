import React, { useState } from "react";
import { useSearchHook } from "./useSearchHook";
import { AccountDto, ProductDto } from "../../../common/contracts";
import { styled } from "@mui/material/styles";
import {
  alpha,
  Avatar,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import {
  stringAvatar,
  stringWithoutColorAvatar,
} from "../../../common/stringAvatar";
import { BASE_URL } from "../../redux/api/customFetchBase";
import { TagChip } from "../product/TagChip";
import { CoinAmountView } from "../transaction/CoinAmountView";
import { RoleChip } from "../account/RoleChip";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Terminal } from "@mui/icons-material";
import { CreateAccountDialog } from "../account/CreateAccountDialog";
import { CreateProductDialog } from "../product/CreateProductDialog";
import { AccountListRowActionButton } from "../account/AccountListRowActionButton";
import { ProductListRowActionButton } from "../product/ProductListRowActionButton";

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
      case "action":
        switch (r.action) {
          case "newAccount":
            return (
              <SearchActionNewAccountRow
                key={i}
                onClose={props.onClose}
                isSelected={i === selected}
              />
            );
          case "newProduct":
            return (
              <SearchActionNewProductRow
                key={i}
                onClose={props.onClose}
                isSelected={i === selected}
              />
            );
        }
    }
  });

  return <>{rows}</>;
};

const SearchAccountRow = (props: {
  account: AccountDto;
  onClose: () => void;
  isSelected: boolean;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const onClose = props.onClose;
  const accountId = props.account.id;
  const isSelected = props.isSelected;
  const handleAction = React.useMemo(
    () => (e?: React.MouseEvent) => {
      if (e?.ctrlKey || e?.metaKey) {
        return false;
      }
      onClose();
      navigate(`/accounts/${accountId}`);
      return true;
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
    <Link
      to={`/accounts/${accountId}`}
      style={{
        textDecoration: "none",
        color: theme.palette.text.primary,
      }}
      onClick={handleAction}
    >
      <StyledRow
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
          <CoinAmountView
            coins={props.account.balance}
            negativeIsError={true}
          />
        </StyledRowCoins>
        <StyledRowActions onClick={(e) => e.stopPropagation()}>
          <AccountListRowActionButton
            account={props.account}
            hidePrimaryAction
          />
        </StyledRowActions>
      </StyledRow>
    </Link>
  );
};

const SearchProductRow = (props: {
  product: ProductDto;
  onClose: () => void;
  isSelected: boolean;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const onClose = props.onClose;
  const productId = props.product.id;
  const isSelected = props.isSelected;
  const handleAction = React.useMemo(
    () => (e?: React.MouseEvent) => {
      if (e?.ctrlKey || e?.metaKey) {
        return false;
      }
      onClose();
      navigate(`/products/${productId}`);
      return true;
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
    <Link
      to={`/products/${productId}`}
      style={{
        textDecoration: "none",
        color: theme.palette.text.primary,
      }}
      onClick={handleAction}
    >
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
          <ProductListRowActionButton
            product={props.product}
            hidePrimaryAction
          />
        </StyledRowActions>
      </StyledRow>
    </Link>
  );
};

const SearchActionNewAccountRow = (props: {
  onClose: () => void;
  isSelected: boolean;
}) => {
  const [openModal, setOpenModal] = useState(false);

  const isSelected = props.isSelected;
  const handleAction = React.useMemo(
    () => () => setOpenModal(true),
    [setOpenModal]
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
    <>
      <StyledRow
        onClick={handleAction}
        className={clsx({
          selected: props.isSelected,
        })}
      >
        <StyledRowIcon>
          <Avatar variant="rounded">
            <Terminal />
          </Avatar>
        </StyledRowIcon>
        <StyledRowContent>
          <Typography>Action: Create new account</Typography>
        </StyledRowContent>
      </StyledRow>
      <CreateAccountDialog open={openModal} setOpen={setOpenModal} />
    </>
  );
};

const SearchActionNewProductRow = (props: {
  onClose: () => void;
  isSelected: boolean;
}) => {
  const [openModal, setOpenModal] = useState(false);

  const isSelected = props.isSelected;
  const handleAction = React.useMemo(
    () => () => setOpenModal(true),
    [setOpenModal]
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
    <>
      <StyledRow
        onClick={handleAction}
        className={clsx({
          selected: props.isSelected,
        })}
      >
        <StyledRowIcon>
          <Avatar variant="rounded">
            <Terminal />
          </Avatar>
        </StyledRowIcon>
        <StyledRowContent>
          <Typography>Action: Create new product</Typography>
        </StyledRowContent>
      </StyledRow>
      <CreateProductDialog open={openModal} setOpen={setOpenModal} />
    </>
  );
};
