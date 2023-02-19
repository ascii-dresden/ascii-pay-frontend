import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { CoinAmountDto } from "../../redux/api/contracts";
import { usePaymentMutation } from "../../redux/api/accountApi";
import { CoinAmountEdit } from "./CoinAmountEdit";

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
      toast.success("Payment successfully executed");
      props.setOpen(false);
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) => toast.error(el.message));
      } else {
        toast.error((error as any).data.message);
      }
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
      <DialogTitle>Payment</DialogTitle>
      <DialogContent>
        <Box pt={1}>
          <CoinAmountEdit coins={coins} onChange={setCoins} />
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          fullWidth
          sx={{ py: "0.8rem" }}
          onClick={handleSubmit}
          loading={isLoading}
        >
          Pay
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
