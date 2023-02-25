import * as React from "react";
import { useEffect } from "react";
import Autocomplete, {
  AutocompleteCloseReason,
} from "@mui/material/Autocomplete";
import { ProductDto } from "../../redux/api/contracts";
import { Box, IconButton, Popover, TextField, Tooltip } from "@mui/material";
import { Coffee } from "@mui/icons-material";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import { toast } from "react-toastify";
import { CoinAmountView } from "./CoinAmountView";

const PopperComponent = (props: {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}) => {
  const { disablePortal, anchorEl, open, ...other } = props;
  return <div {...other} />;
};

export const SelectProductPopup = (props: {
  selectProduct: (product: ProductDto) => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const {
    isLoading,
    isError,
    error,
    data: products,
  } = useGetAllProductsQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Could not load products!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || products === undefined) {
    return (
      <IconButton sx={{ height: "40px" }} disabled={true}>
        <Coffee />
      </IconButton>
    );
  }

  const sortedProducts = [...products];
  sortedProducts.sort((a, b) => -b.category.localeCompare(a.category));

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  const handleSelect = (product: ProductDto | null) => {
    if (product) {
      props.selectProduct(product);
    }
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "select-product-dialog" : undefined;

  return (
    <>
      <Tooltip title="Add product to transaction">
        <IconButton sx={{ height: "40px" }} onClick={handleClick}>
          <Coffee />
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
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
            onChange={(event: any, newValue: ProductDto | null) => {
              handleSelect(newValue);
            }}
            PopperComponent={PopperComponent}
            noOptionsText="No products"
            options={sortedProducts}
            getOptionLabel={(option) => option?.name ?? "---"}
            groupBy={(option) => option.category}
            renderOption={(props, option) => (
              <li {...props} style={{ display: "block" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{option.name}</span>
                  <CoinAmountView coins={option.price} />
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                label="Select payment product"
                autoFocus={true}
                sx={{
                  width: "24rem",
                }}
              />
            )}
            sx={{
              width: "24rem",
            }}
          />
        </Box>
      </Popover>
    </>
  );
};
