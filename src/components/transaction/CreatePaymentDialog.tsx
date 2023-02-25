import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  AccountDto,
  CoinAmountDto,
  ProductDto,
  TransactionItemDto,
} from "../../redux/api/contracts";
import { usePaymentMutation } from "../../redux/api/accountApi";
import { CoinAmountEdit } from "./CoinAmountEdit";
import { Add, Close, DeleteOutline } from "@mui/icons-material";
import { BASE_URL } from "../../redux/api/customFetchBase";
import { stringAvatar } from "../stringAvatar";
import { CoinAmountView } from "./CoinAmountView";
import { SelectProductPopup } from "./SelectProductPopup";
import {
  addCoinAmount,
  equalCoinAmount,
  isCoinAmountEmpty,
  subCoinAmount,
} from "./transactionUtils";

function getPossiblePrices(product: ProductDto): CoinAmountDto[] {
  let prices: CoinAmountDto[] = [];

  if (product.price.Cent && product.price.Cent !== 0) {
    prices.push({
      Cent: product.price.Cent,
      BottleStamp: product.bonus.BottleStamp
        ? -product.bonus.BottleStamp
        : undefined,
      CoffeeStamp: product.bonus.CoffeeStamp
        ? -product.bonus.CoffeeStamp
        : undefined,
    });
  }
  if (product.price.BottleStamp && product.price.BottleStamp !== 0) {
    prices.push({
      Cent: product.bonus.Cent ? -product.bonus.Cent : undefined,
      BottleStamp: product.price.BottleStamp,
      CoffeeStamp: product.bonus.CoffeeStamp
        ? -product.bonus.CoffeeStamp
        : undefined,
    });
  }
  if (product.price.CoffeeStamp && product.price.CoffeeStamp !== 0) {
    prices.push({
      Cent: product.bonus.Cent ? -product.bonus.Cent : undefined,
      BottleStamp: product.bonus.BottleStamp
        ? -product.bonus.BottleStamp
        : undefined,
      CoffeeStamp: product.price.CoffeeStamp,
    });
  }

  if (prices.length === 0) {
    prices.push({});
  }

  return prices;
}

function selectCoinAmount(
  product: ProductDto,
  current: CoinAmountDto
): CoinAmountDto {
  let prices = getPossiblePrices(product);

  for (let i = 0; i < prices.length; i++) {
    if (equalCoinAmount(current, prices[i])) {
      let next = (i + 1) % prices.length;
      return prices[next];
    }
  }

  return prices[0];
}

export const CreatePaymentDialog = (props: {
  account: AccountDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [payment, { isLoading, isError, error, isSuccess }] =
    usePaymentMutation();

  const [coins, setCoins] = React.useState<CoinAmountDto>({});
  const [paymentItems, setPaymentItems] = React.useState<TransactionItemDto[]>(
    []
  );

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

  const handleAddCoins = () => {
    if (!isCoinAmountEmpty(coins)) {
      setPaymentItems((items) => {
        return [
          ...items,
          {
            product: null,
            effective_price: coins,
          },
        ];
      });
      setCoins({});
    }
  };

  const handleSelectProduct = (product: ProductDto) => {
    setPaymentItems((items) => {
      return [
        ...items,
        {
          product: product,
          effective_price: selectCoinAmount(product, {}),
        },
      ];
    });
  };

  const handleNextPrice = (index: number) => {
    setPaymentItems((items) => {
      if (index < 0 || index >= items.length) {
        return items;
      }
      let current = items[index];
      if (!current.product) {
        return items;
      }

      let cloned = [...items];
      cloned[index] = {
        product: current.product,
        effective_price: selectCoinAmount(
          current.product,
          current.effective_price
        ),
      };
      return cloned;
    });
  };

  const handleRemoveItem = (index: number) => {
    setPaymentItems((items) => {
      if (index < 0 || index >= items.length) {
        return items;
      }

      let cloned = [...items];
      cloned.splice(index, 1);
      return cloned;
    });
  };

  const handleSubmit = () => {
    let items = paymentItems;

    if (!isCoinAmountEmpty(coins)) {
      items = [
        ...items,
        {
          product: null,
          effective_price: coins,
        },
      ];
    }

    if (items.length > 0) {
      payment({
        id: props.account.id,
        payment: {
          items: items.map((i) => {
            return {
              product_id: i.product?.id,
              effective_price: i.effective_price,
            };
          }),
        },
      });
    }
    setCoins({});
    setPaymentItems([]);
  };

  let total = addCoinAmount({}, coins);
  for (const item of paymentItems) {
    total = addCoinAmount(total, item.effective_price);
  }

  let balance = subCoinAmount(props.account.balance, total);

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
          <CoinAmountEdit
            coins={coins}
            onChange={setCoins}
            isTransaction={true}
          >
            <IconButton sx={{ height: "40px" }} onClick={handleAddCoins}>
              <Add />
            </IconButton>
            <SelectProductPopup selectProduct={handleSelectProduct} />
          </CoinAmountEdit>

          <Table size="small">
            <TableBody>
              {paymentItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell width={72}>
                    {item.product ? (
                      <Avatar
                        alt={item.product.name}
                        src={`${BASE_URL}/product/${item.product.id}/image`}
                        {...stringAvatar(item.product.name)}
                      />
                    ) : null}
                  </TableCell>
                  <TableCell>{item.product?.name ?? "-"}</TableCell>
                  <TableCell width={200} onClick={() => handleNextPrice(index)}>
                    <CoinAmountView
                      coins={item.effective_price}
                      isTransaction={true}
                    />
                  </TableCell>
                  <TableCell width={72}>
                    <IconButton onClick={() => handleRemoveItem(index)}>
                      <DeleteOutline />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell height={52.9} width={72}></TableCell>
                <TableCell>
                  <b>Total</b>
                </TableCell>
                <TableCell width={200}>
                  <b>
                    <CoinAmountView coins={total} isTransaction={true} />
                  </b>
                </TableCell>
                <TableCell width={72}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell height={52.9} width={72}></TableCell>
                <TableCell>Estimated balance</TableCell>
                <TableCell width={200}>
                  <CoinAmountView coins={balance} negativeIsError={true} />
                </TableCell>
                <TableCell width={72}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
