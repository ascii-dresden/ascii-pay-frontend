import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "../FileUpload/FileUpload";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import { pickBy } from "lodash";
import { toast } from "react-toastify";
import { ProductDto } from "../../redux/api/contracts";
import { useUpdateProductMutation } from "../../redux/api/productApi";

const updateProductSchema = object({
  name: string().min(1, "Title is required"),
  nickname: string(),
  barcode: string(),
  category: string(),
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

  useEffect(() => {
    if (props.product) {
      methods.reset({
        name: props.product.name,
        nickname: props.product.nickname ?? undefined,
        barcode: props.product.barcode ?? undefined,
        category: props.product.category,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.product]);

  const onSubmitHandler: SubmitHandler<IUpdateProduct> = (values) => {
    const formData = new FormData();
    const filteredFormData = pickBy(
      values,
      (value) => value !== "" && value !== undefined
    );
    const { image, ...otherFormData } = filteredFormData;
    if (image) {
      formData.append("image", image);
    }
    formData.append("data", JSON.stringify(otherFormData));
    updateProduct({
      id: props.product?.id!,
      product: {
        name: values.name ?? "",
        price: {
          cent: 0,
        },
        bonus: {
          coffeeStamp: 0,
        },
        nickname: values.nickname,
        barcode: values.barcode,
        category: values.category ?? "",
        tags: [],
      },
    });
  };

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle>Update product</DialogTitle>
      <FormProvider {...methods}>
        <DialogContent>
          <Box>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="h5" component="h1">
                Edit Post
              </Typography>
              {isLoading && <CircularProgress size="1rem" color="primary" />}
            </Box>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={methods.handleSubmit(onSubmitHandler)}
            >
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
              <FileUpload limit={1} name="image" multiple={false} />
            </Box>
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
            Edit Product
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateProduct;
