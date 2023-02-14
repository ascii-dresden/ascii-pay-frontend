import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingButton as _LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useCreateAdminAccountMutation } from "../redux/api/accountApi";
import logo from "../assets/ascii-pay-logo-wide.svg";

const LoadingButton = styled(_LoadingButton)`
  padding: 0.8rem 0;
  font-weight: 500;
`;

const setupSchema = object({
  name: string().min(1, "Name is required"),
  email: string().email("Email is required"),
  username: string().min(1, "Username is required"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

type SetupInput = TypeOf<typeof setupSchema>;

const SetupPage = () => {
  const methods = useForm<SetupInput>({
    resolver: zodResolver(setupSchema),
  });

  // 👇 API Setup Mutation
  const [setupUser, { isLoading, isError, error, isSuccess }] =
    useCreateAdminAccountMutation();

  const navigate = useNavigate();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account successfully created!");
      navigate("/");
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
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<SetupInput> = (values) => {
    // 👇 Executing the setupUser Mutation
    setupUser(values);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
            <img
              style={{ height: "2rem", marginTop: "0.5rem" }}
              src={logo}
              alt="ascii pay"
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            textAlign="center"
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "2rem", md: "3rem" },
              mb: 2,
              letterSpacing: 1,
            }}
          >
            Setup ascii pay!
          </Typography>

          <FormProvider {...methods}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmitHandler)}
              noValidate
              autoComplete="off"
              maxWidth="27rem"
              width="100%"
            >
              <FormInput name="name" label="Name" />
              <FormInput name="email" label="Email" />
              <FormInput name="username" label="Username" />
              <FormInput name="password" label="Password" type="password" />

              <LoadingButton
                variant="contained"
                sx={{ mt: 1 }}
                fullWidth
                disableElevation
                type="submit"
                loading={isLoading}
              >
                Create admin account
              </LoadingButton>
            </Box>
          </FormProvider>
        </Box>
      </Container>
    </Box>
  );
};

export default SetupPage;
