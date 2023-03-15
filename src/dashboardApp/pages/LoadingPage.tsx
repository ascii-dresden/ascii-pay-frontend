import { AppBar, Box, Toolbar } from "@mui/material";
import React from "react";
import { FullScreenLoader } from "../components/FullScreenLoader";

export const LoadingPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar></Toolbar>
      </AppBar>
      <FullScreenLoader />
    </Box>
  );
};
