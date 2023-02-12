import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateAccountMutation } from "../../redux/api/accountApi";
import { RoleDto } from "../../redux/api/contracts";

const createAccountSchema = object({
  name: string().min(1, "Name is required"),
  email: string().email("Email is required"),
  role: string(),
});

type ICreateAccount = TypeOf<typeof createAccountSchema>;

const CreateAccount = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [createAccount, { isLoading, isError, error, isSuccess }] =
    useCreateAccountMutation();

  const methods = useForm<ICreateAccount>({
    resolver: zodResolver(createAccountSchema),
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

  const onSubmitHandler: SubmitHandler<ICreateAccount> = (values) => {
    createAccount({
      name: values.name,
      email: values.email,
      role: (values.role ?? "Basic") as unknown as RoleDto,
    });
  };

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle>Create account</DialogTitle>
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
                {...methods.register("name")}
              />
              <TextField
                label="Email"
                fullWidth
                sx={{ mb: "1rem" }}
                {...methods.register("email")}
              />
              <TextField
                label="Role"
                fullWidth
                focused
                select
                sx={{ mb: "1rem" }}
                {...methods.register("role")}
              >
                <MenuItem value="Basic">Basic</MenuItem>
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>
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
              Create Account
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CreateAccount;
