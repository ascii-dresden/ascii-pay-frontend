import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "../../redux/api/productApi";

const createProductSchema = object({
  name: string().min(1, "Title is required"),
  nickname: string(),
  barcode: string(),
  category: string(),
});

export type ICreateProduct = TypeOf<typeof createProductSchema>;

const CreateProduct = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [createProduct, { isLoading, isError, error, isSuccess }] =
    useCreateProductMutation();

  const methods = useForm<ICreateProduct>({
    resolver: zodResolver(createProductSchema),
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Post created successfully");
      props.setOpen(false);
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
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

  const onSubmitHandler: SubmitHandler<ICreateProduct> = (values) => {
    createProduct({
      name: values.name,
      price: {
        Cent: 0,
      },
      bonus: {
        CoffeeStamp: 0,
      },
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
            <Box pt={2}>
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
            </Box>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              variant="contained"
              fullWidth
              sx={{ py: "0.8rem", mt: 4, backgroundColor: "#2363eb" }}
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
