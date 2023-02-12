import { Box, Container, Typography } from "@mui/material";
import { useAppSelector } from "../redux/store";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.userState.user);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2 }}>
        <Typography gutterBottom>
          <strong>Id:</strong> {user?.id}
        </Typography>
        <Typography gutterBottom>
          <strong>Full Name:</strong> {user?.name}
        </Typography>
        <Typography gutterBottom>
          <strong>Email Address:</strong> {user?.email}
        </Typography>
        <Typography gutterBottom>
          <strong>Balance:</strong> {JSON.stringify(user?.balance)}
        </Typography>
        <Typography gutterBottom>
          <strong>Role:</strong> {user?.role}
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;
