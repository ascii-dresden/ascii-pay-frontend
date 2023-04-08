import {
  AppBar,
  Box,
  Container,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton as _LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import logo from "../../assets/ascii-pay-logo-wide.svg";
import { useCreateAdminAccountMutation } from "../redux/api/accountApi";
import { usePageTitle } from "../components/usePageTitle";
import { useTranslation } from "react-i18next";

const LoadingButton = styled(_LoadingButton)`
  padding: 0.8rem 0;
  font-weight: 500;
`;

export const SetupPage = () => {
  const { t } = useTranslation();

  const [createAdminAccount, { isLoading, isError, error, isSuccess }] =
    useCreateAdminAccountMutation();

  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  usePageTitle("Setup");

  useEffect(() => {
    if (isSuccess) {
      toast.success("Admin account successfully created!");
      navigate("/");
    } else if (isError) {
      toast.error("Could not create admin account!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createAdminAccount({
      name,
      email,
      username: username,
      password,
    });
    return true;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box component={Link} to="/" sx={{ cursor: "pointer" }}>
              <img
                style={{ height: "2rem", marginTop: "0.5rem" }}
                src={logo}
                alt="ascii pay"
              />
            </Box>
          </Toolbar>
        </Container>
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
          component={"form"}
          onSubmit={handleSubmit}
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
            {t("setup.message")}
          </Typography>

          <Box maxWidth="27rem" width="100%">
            <TextField
              label={t("setup.name")}
              fullWidth
              sx={{ mb: "1rem" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label={t("setup.email")}
              fullWidth
              sx={{ mb: "1rem" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label={t("setup.username")}
              fullWidth
              sx={{ mb: "1rem" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label={t("setup.password")}
              fullWidth
              sx={{ mb: "1rem" }}
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <LoadingButton
              variant="contained"
              sx={{ mt: 1 }}
              fullWidth
              disableElevation
              type="submit"
              loading={isLoading}
            >
              {t("setup.action")}
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
