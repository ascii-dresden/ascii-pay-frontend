import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { CoinAmountDto } from "../../redux/api/contracts";
import { usePaymentMutation } from "../../redux/api/accountApi";
import { CoinAmountEdit } from "./CoinAmountEdit";
import { Close } from "@mui/icons-material";

export const CreatePaymentDialog = (props: {
  accountId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [payment, { isLoading, isError, error, isSuccess }] =
    usePaymentMutation();

  const [coins, setCoins] = React.useState<CoinAmountDto>({});

  useEffect(() => {
    if (isSuccess) {
      toast.success("Payment successfully executed!");
      props.setOpen(false);
      setCoins({});
    } else if (isError) {
      toast.error("Payment could not be executed!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = () => {
    payment({
      id: props.accountId,
      payment: {
        items: [
          {
            effective_price: coins,
          },
        ],
      },
    });
  };

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle component="div">
        <Typography variant="h5">Payment</Typography>
        <IconButton
          aria-label="close"
          onClick={() => props.setOpen(false)}
          sx={{
            position: "absolute",
            right: 16,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box pt={1}>
          <CoinAmountEdit coins={coins} onChange={setCoins} />
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          fullWidth
          sx={{ mx: 2, py: 1.5 }}
          onClick={handleSubmit}
          loading={isLoading}
        >
          Pay
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
