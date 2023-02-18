import { Box, Container, Paper, Typography } from "@mui/material";
import { useAppSelector } from "../redux/store";
import FullScreenLoader from "../components/FullScreenLoader";
import { TransactionList } from "../components/transaction/transactions.list";
import { CoinAmountView } from "../components/CoinAmountView";
import styled from "@emotion/styled";

const StyledBalanceDiv = styled.div`
  display: flex;
`;

const ProfilePage = () => {
  const user = useAppSelector((state) => state.userState.user);

  if (!user) {
    return <FullScreenLoader />;
  }

  return (
    <Container maxWidth="lg">
      <Paper>
        <Box sx={{ p: 2, mb: 2 }}>
          <Typography gutterBottom>
            <strong>Id:</strong> {user.id}
          </Typography>
          <Typography gutterBottom>
            <strong>Full Name:</strong> {user.name}
          </Typography>
          <Typography gutterBottom>
            <strong>Email Address:</strong> {user.email}
          </Typography>
          <StyledBalanceDiv>
            <Typography gutterBottom>
              <strong>Balance:</strong>
            </Typography>
            <CoinAmountView coins={user.balance} />
          </StyledBalanceDiv>
          <Typography gutterBottom>
            <strong>Role:</strong> {user.role}
          </Typography>
        </Box>
      </Paper>

      <TransactionList id={user.id} />
    </Container>
  );
};

export default ProfilePage;
