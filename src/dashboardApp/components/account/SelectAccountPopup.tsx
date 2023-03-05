import * as React from "react";
import { useEffect } from "react";
import Autocomplete, {
  AutocompleteCloseReason,
} from "@mui/material/Autocomplete";
import { AccountDto } from "../../../common/contracts";
import { Box, Button, IconButton, Popover, TextField } from "@mui/material";
import { Coffee } from "@mui/icons-material";
import { useGetAllAccountsQuery } from "../../redux/api/accountApi";
import { toast } from "react-toastify";
import { CoinAmountView } from "../transaction/CoinAmountView";
import { RoleChip } from "./RoleChip";

const PopperComponent = (props: {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}) => {
  const { disablePortal, anchorEl, open, ...other } = props;
  return <div {...other} />;
};

export const SelectAccountPopup = (props: {
  label: string;
  selectAccount: (account: AccountDto) => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const {
    isLoading,
    isError,
    error,
    data: accounts,
  } = useGetAllAccountsQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Could not load accounts!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || accounts === undefined) {
    return (
      <IconButton sx={{ height: "40px" }} disabled={true}>
        <Coffee />
      </IconButton>
    );
  }

  const sortedAccounts = [...accounts];
  sortedAccounts.sort((a, b) => a.name.localeCompare(b.name));

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  const handleSelect = (account: AccountDto | null) => {
    if (account) {
      props.selectAccount(account);
    }
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "select-account-dialog" : undefined;

  return (
    <>
      <Button onClick={handleClick} variant="outlined" size="large">
        {props.label}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ mt: 2, mb: 1, mx: 1 }}>
          <Autocomplete
            open
            selectOnFocus
            disableCloseOnSelect
            onClose={(
              event: React.ChangeEvent<{}>,
              reason: AutocompleteCloseReason
            ) => {
              if (reason === "escape") {
                handleClose();
              }
            }}
            value={null}
            onChange={(event: any, newValue: AccountDto | null) => {
              handleSelect(newValue);
            }}
            PopperComponent={PopperComponent}
            noOptionsText="No accounts"
            options={sortedAccounts}
            getOptionLabel={(option) => option?.name ?? "---"}
            renderOption={(props, option) => (
              <li {...props} style={{ display: "block" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ paddingRight: "0.5rem" }}>
                      {option.name}
                    </span>
                    <RoleChip role={option.role} />
                  </div>
                  <CoinAmountView
                    coins={option.balance}
                    negativeIsError={true}
                  />
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                label="Select account"
                autoFocus={true}
                sx={{
                  width: "30rem",
                }}
              />
            )}
            sx={{
              width: "30rem",
            }}
          />
        </Box>
      </Popover>
    </>
  );
};
