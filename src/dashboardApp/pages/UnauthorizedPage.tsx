import { Box, Container, Typography } from "@mui/material";

export const UnauthorizedPage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: "2rem",
          height: "15rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 500 }}>
          Unauthorized Page
        </Typography>
      </Box>
    </Container>
  );
};
