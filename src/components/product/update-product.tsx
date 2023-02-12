import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { number, object, optional, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CoinAmountDto, ProductDto } from "../../redux/api/contracts";
import { useUpdateProductMutation } from "../../redux/api/productApi";

const updateProductSchema = object({
  name: string(),
  nickname: string(),
  barcode: string(),
  category: string(),
  priceCents: optional(number()).default(0),
  priceCoffeeStamps: optional(number()).default(0),
  priceBottleStamps: optional(number()).default(0),
  bonusCents: optional(number()).default(0),
  bonusCoffeeStamps: optional(number()).default(0),
  bonusBottleStamps: optional(number()).default(0),
}).partial();

type IUpdateProduct = TypeOf<typeof updateProductSchema>;

const UpdateProduct = (props: {
  product: ProductDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [updateProduct, { isLoading, isError, error, isSuccess }] =
    useUpdateProductMutation();

  const methods = useForm<IUpdateProduct>({
    resolver: zodResolver(updateProductSchema),
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product updated successfully");
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

  useEffect(() => {
    if (methods.formState.isSubmitting) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.formState.isSubmitting]);

  useEffect(() => {
    if (props.product) {
      methods.reset({
        name: props.product.name,
        nickname: props.product.nickname ?? undefined,
        barcode: props.product.barcode ?? undefined,
        category: props.product.category,
        priceCents: props.product.price.Cent ?? 0,
        priceBottleStamps: props.product.price.BottleStamp ?? 0,
        priceCoffeeStamps: props.product.price.CoffeeStamp ?? 0,
        bonusCents: props.product.bonus.Cent ?? 0,
        bonusBottleStamps: props.product.bonus.BottleStamp ?? 0,
        bonusCoffeeStamps: props.product.bonus.CoffeeStamp ?? 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.product]);

  const onSubmitHandler: SubmitHandler<IUpdateProduct> = (values) => {
    let price: CoinAmountDto = {};
    if (values.priceCents && values.priceCents > 0) {
      price.Cent = values.priceCents;
    }
    if (values.priceCoffeeStamps && values.priceCoffeeStamps > 0) {
      price.CoffeeStamp = values.priceCoffeeStamps;
    }
    if (values.priceBottleStamps && values.priceBottleStamps > 0) {
      price.BottleStamp = values.priceBottleStamps;
    }

    let bonus: CoinAmountDto = {};
    if (values.bonusCents && values.bonusCents > 0) {
      bonus.Cent = values.bonusCents;
    }
    if (values.bonusCoffeeStamps && values.bonusCoffeeStamps > 0) {
      bonus.CoffeeStamp = values.bonusCoffeeStamps;
    }
    if (values.bonusBottleStamps && values.bonusBottleStamps > 0) {
      bonus.BottleStamp = values.bonusBottleStamps;
    }

    updateProduct({
      id: props.product?.id!,
      product: {
        name: values.name ?? props.product.name,
        price,
        bonus,
        nickname: values.nickname ?? props.product.nickname,
        barcode: values.barcode ?? props.product.barcode,
        category: values.category ?? props.product.category,
        tags: props.product.tags,
      },
    });
  };

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle>Update product</DialogTitle>

      <FormProvider {...methods}>
        <form
          autoComplete="off"
          noValidate
          onSubmit={methods.handleSubmit(onSubmitHandler)}
        >
          <DialogContent>
            <Box pt={1}>
              <TextField
                label="Product name"
                fullWidth
                sx={{ mb: "1rem" }}
                focused
                {...methods.register("name")}
              />
              <TextField
                label="Nickname"
                fullWidth
                focused
                sx={{ mb: "1rem" }}
                {...methods.register("nickname")}
              />
              <TextField
                label="Category"
                fullWidth
                focused
                sx={{ mb: "1rem" }}
                {...methods.register("category")}
              />
              <TextField
                label="Barcode"
                fullWidth
                focused
                sx={{ mb: "1rem" }}
                {...methods.register("barcode")}
              />
              <div>
                <TextField
                  label="Price Cents"
                  type="number"
                  sx={{ mb: "1rem" }}
                  {...methods.register("priceCents", { valueAsNumber: true })}
                />
                <TextField
                  label="Price Coffee Stamps"
                  type="number"
                  sx={{ mb: "1rem" }}
                  {...methods.register("priceCoffeeStamps", {
                    valueAsNumber: true,
                  })}
                />
                <TextField
                  label="Price Bottle Stamps"
                  type="number"
                  sx={{ mb: "1rem" }}
                  {...methods.register("priceBottleStamps", {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <TextField
                  label="Bonus Cents"
                  type="number"
                  sx={{ mb: "1rem" }}
                  {...methods.register("bonusCents", { valueAsNumber: true })}
                />
                <TextField
                  label="Bonus Coffee Stamps"
                  type="number"
                  sx={{ mb: "1rem" }}
                  {...methods.register("bonusCoffeeStamps", {
                    valueAsNumber: true,
                  })}
                />
                <TextField
                  label="Bonus Bottle Stamps"
                  type="number"
                  sx={{ mb: "1rem" }}
                  {...methods.register("bonusBottleStamps", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </Box>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              variant="contained"
              fullWidth
              sx={{ py: "0.8rem" }}
              type="submit"
              loading={isLoading}
            >
              Edit Product
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateProduct;
