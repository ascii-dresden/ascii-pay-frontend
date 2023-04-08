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
import { Link } from "react-router-dom";
import { LoadingButton as _LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useLoginUserMutation } from "../redux/api/authApi";
import logo from "../../assets/ascii-pay-logo-wide.svg";
import { useTranslation } from "react-i18next";

const LoadingButton = styled(_LoadingButton)`
  padding: 0.8rem 0;
  font-weight: 500;
`;

export const LoginPage = () => {
  const { t } = useTranslation();

  const [loginUser, { isLoading, isError, error, isSuccess }] =
    useLoginUserMutation();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [hasErrors, setHasErrors] = React.useState(false);

  useEffect(() => {
    if (isSuccess) {
      setHasErrors(false);
    } else if (isError) {
      toast.error("Username or password wrong!");
      console.error(error);
      setHasErrors(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser({
      username: username,
      password: password,
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
          noValidate
          autoComplete="off"
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
            {t("login.message")}
          </Typography>

          <Box maxWidth="27rem" width="100%">
            <TextField
              error={hasErrors}
              label={t("login.username")}
              fullWidth
              sx={{ mb: "1rem" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              error={hasErrors}
              label={t("login.password")}
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
              {t("login.action")}
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
