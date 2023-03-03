import { AppBar, Box, Toolbar } from "@mui/material";
import React from "react";
import logo from "../assets/ascii-pay-logo-wide.svg";
import { FullScreenLoader } from "../components/FullScreenLoader";

export const LoadingPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Box sx={{ cursor: "pointer" }}>
            <img
              style={{ height: "2rem", marginTop: "0.5rem" }}
              src={logo}
              alt="ascii pay"
            />
          </Box>
        </Toolbar>
      </AppBar>
      <FullScreenLoader />
    </Box>
  );
};
