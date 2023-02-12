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
import { pickBy } from "lodash";
import { toast } from "react-toastify";
import { AccountDto } from "../../redux/api/contracts";
import { useUpdateAccountMutation } from "../../redux/api/accountApi";

const updateAccountSchema = object({
  name: string().min(1, "Name is required"),
  email: string().email("Email is required"),
}).partial();

type IUpdateAccount = TypeOf<typeof updateAccountSchema>;

const UpdateAccount = (props: {
  account: AccountDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [updateAccount, { isLoading, isError, error, isSuccess }] =
    useUpdateAccountMutation();

  const methods = useForm<IUpdateAccount>({
    resolver: zodResolver(updateAccountSchema),
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account updated successfully");
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
    if (props.account) {
      methods.reset({
        name: props.account.name,
        email: props.account.email,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.account]);

  const onSubmitHandler: SubmitHandler<IUpdateAccount> = (values) => {
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
    updateAccount({
      id: props.account?.id!,
      account: {
        name: values.name ?? "",
        email: values.email ?? "",
        role: "Member",
      },
    });
  };

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle>Update account</DialogTitle>
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          noValidate
          onSubmit={methods.handleSubmit(onSubmitHandler)}
        >
          <DialogContent>
            <Box pt={2}>
              <TextField
                label="Account name"
                fullWidth
                sx={{ mb: "1rem" }}
                focused
                {...methods.register("name")}
              />
              <TextField
                label="Email"
                fullWidth
                focused
                sx={{ mb: "1rem" }}
                {...methods.register("email")}
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
              Edit Account
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateAccount;
