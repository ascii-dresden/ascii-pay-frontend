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
import { useGetAllProductsQuery } from "../redux/api/productApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FullScreenLoader from "../components/FullScreenLoader";
import ProductItem from "../components/product/product.component";
import { Add } from "@mui/icons-material";
import CreateProduct from "../components/product/create-product";

const HomePage = () => {
  const [openModal, setOpenModal] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: products,
  } = useGetAllProductsQuery();

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
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            component="div"
          >
            Products
          </Typography>
          <Tooltip title="Add product">
            <IconButton onClick={() => setOpenModal(true)}>
              <Add />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Table sx={{ minWidth: 650 }} aria-label="Products table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Bonus</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((post) => (
              <ProductItem key={post.id} product={post} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateProduct open={openModal} setOpen={setOpenModal} />
    </Container>
  );
};

export default HomePage;
