import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TerminalApp, TerminalAppPage } from "../terminal/TerminalApp";
import { TerminalSettings } from "../terminal/pages/TerminalSettingsPage";

export const TerminalPage = () => {
  const navigate = useNavigate();
  let params = useParams();

  const [width, setWidth] = React.useState("1000");
  const [height, setHeight] = React.useState("600");

  const [settings, setSettings] = React.useState<TerminalSettings>({
    language: "en",
    theme: "dark",
    highlightColor: "green",
  });

  let terminalPage: TerminalAppPage = "start";
  switch (params.page) {
    case "payment":
      terminalPage = "payment";
      break;
    case "register":
      terminalPage = "register";
      break;
    case "accounts":
      terminalPage = "accounts";
      break;
    case "settings":
      terminalPage = "settings";
      break;
  }

  const header = (
    <Paper elevation={0}>
      <Box sx={{ px: 1, py: 2, mb: 3 }}>
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
              Terminal emulator
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate("/")}
              >
                ascii-pay
              </Link>
              <Link
                underline="hover"
                color={terminalPage === "start" ? "text.primary" : "inherit"}
                aria-current={terminalPage === "start" ? "page" : undefined}
                onClick={() => navigate("/terminal")}
              >
                Terminal
              </Link>
              {terminalPage !== "start" ? (
                <Link
                  underline="hover"
                  color="text.primary"
                  aria-current="page"
                  onClick={() => navigate("/terminal")}
                >
                  {terminalPage.charAt(0).toUpperCase() +
                    terminalPage.substr(1).toLowerCase()}
                </Link>
              ) : null}
            </Breadcrumbs>
          </div>
        </Toolbar>
      </Box>
    </Paper>
  );

  return (
    <>
      <Container maxWidth="lg">
        {header}
        <Paper elevation={4} sx={{ m: 4, px: 1, py: 2 }}>
          <Box sx={{ display: "flex" }}>
            <TextField
              label="Width"
              fullWidth
              sx={{ mr: "0.4rem" }}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <TextField
              label="Height"
              fullWidth
              sx={{ ml: "0.4rem" }}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </Box>
        </Paper>
      </Container>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={4}
          sx={{
            width: `${width}px`,
            height: `${height}px`,
            position: "relative",
          }}
        >
          <TerminalApp
            page={terminalPage}
            width={parseInt(width)}
            height={parseInt(height)}
            settings={settings}
            setSettings={setSettings}
          />
        </Paper>
      </Box>
    </>
  );
};
