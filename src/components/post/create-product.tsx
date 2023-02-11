import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "../FileUpload/FileUpload";
import { LoadingButton } from "@mui/lab";
import { FC, useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "../../redux/api/productApi";

interface ICreatePostProp {
  setOpenPostModal: (openPostModal: boolean) => void;
}

const createProductSchema = object({
  name: string().min(1, "Title is required"),
  nickname: string(),
  barcode: string(),
  category: string(),
});

export type ICreateProduct = TypeOf<typeof createProductSchema>;

const CreateProduct: FC<ICreatePostProp> = ({ setOpenPostModal }) => {
  const [createPost, { isLoading, isError, error, isSuccess }] =
    useCreateProductMutation();

  const methods = useForm<ICreateProduct>({
    resolver: zodResolver(createProductSchema),
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Post created successfully");
      setOpenPostModal(false);
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
    createPost({
      name: values.name,
      price: {
        cent: 0,
      },
      bonus: {
        coffeeStamp: 0,
      },
      nickname: values.nickname,
      barcode: values.barcode,
      category: values.category,
      tags: [],
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1">
          Create Post
        </Typography>
        {isLoading && <CircularProgress size="1rem" color="primary" />}
      </Box>
      <FormProvider {...methods}>
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
          <FileUpload limit={1} name="image" multiple={false} />
          <LoadingButton
            variant="contained"
            fullWidth
            sx={{ py: "0.8rem", mt: 4, backgroundColor: "#2363eb" }}
            type="submit"
            loading={isLoading}
          >
            Create Product
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default CreateProduct;
