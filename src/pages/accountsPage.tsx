import {
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useGetAllAccountsQuery } from "../redux/api/accountApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FullScreenLoader from "../components/FullScreenLoader";
import AccountItem from "../components/account/account.component";
import { Add } from "@mui/icons-material";
import CreateAccount from "../components/account/create-account";

const HomePage = () => {
  const [openModal, setOpenModal] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: accounts,
  } = useGetAllAccountsQuery();

  useEffect(() => {
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

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Container maxWidth="lg">
      <TableContainer component={Paper}>
        <Toolbar>
          <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
            Accounts
          </Typography>
          <Tooltip title="Add account">
            <IconButton onClick={() => setOpenModal(true)}>
              <Add />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Table sx={{ minWidth: 650 }} aria-label="Account table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.map((post) => (
              <AccountItem key={post.id} account={post} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateAccount open={openModal} setOpen={setOpenModal} />
    </Container>
  );
};

export default HomePage;
