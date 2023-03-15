import { Box, CircularProgress, Container, Paper } from "@mui/material";
import React from "react";

export const PaperScreenLoader = (props: {
  hidePaper?: boolean;
  children?: React.ReactNode;
}) => {
  if (props.hidePaper) {
    return (
      <Container maxWidth="lg">
        {props.children}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ height: "16rem" }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg">
      {props.children}
      <Paper elevation={4}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ height: "16rem" }}
        >
          <CircularProgress />
        </Box>
      </Paper>
    </Container>
  );
};
