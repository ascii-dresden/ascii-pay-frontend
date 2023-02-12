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
import { useCreateProductMutation } from "../../redux/api/productApi";
import { CoinAmountDto } from "../../redux/api/contracts";

const createProductSchema = object({
  name: string(),
  nickname: string(),
  barcode: string(),
  category: string(),
  priceCents: optional(number()),
  priceCoffeeStamps: optional(number()).default(0),
  priceBottleStamps: optional(number()).default(0),
  bonusCents: optional(number()).default(0),
  bonusCoffeeStamps: optional(number()).default(0),
  bonusBottleStamps: optional(number()).default(0),
});

type ICreateProduct = TypeOf<typeof createProductSchema>;

const CreateProduct = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [createProduct, { isLoading, isError, error, isSuccess }] =
    useCreateProductMutation();

  const methods = useForm<ICreateProduct>({
    resolver: zodResolver(createProductSchema),
    values: {
      name: "",
      nickname: "",
      barcode: "",
      category: "",
      priceCents: 0,
      priceBottleStamps: 0,
      priceCoffeeStamps: 0,
      bonusCents: 0,
      bonusBottleStamps: 0,
      bonusCoffeeStamps: 0,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product created successfully");
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
      methods.reset({
        name: "",
        nickname: "",
        barcode: "",
        category: "",
        priceCents: 0,
        priceBottleStamps: 0,
        priceCoffeeStamps: 0,
        bonusCents: 0,
        bonusBottleStamps: 0,
        bonusCoffeeStamps: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.formState.isSubmitting]);

  const onSubmitHandler: SubmitHandler<ICreateProduct> = (values) => {
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

    createProduct({
      name: values.name,
      price,
      bonus,
      nickname: values.nickname,
      barcode: values.barcode,
      category: values.category,
      tags: [],
    });
  };

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle>Create product</DialogTitle>
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
                {...methods.register("name")}
              />
              <TextField
                label="Nickname"
                fullWidth
                sx={{ mb: "1rem" }}
                {...methods.register("nickname")}
              />
              <TextField
                label="Category"
                fullWidth
                sx={{ mb: "1rem" }}
                {...methods.register("category")}
              />
              <TextField
                label="Barcode"
                fullWidth
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
              Create Product
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CreateProduct;
