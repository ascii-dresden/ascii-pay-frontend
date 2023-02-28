import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Container,
  Grow,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductQuery } from "../redux/api/productApi";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { TagChip } from "../components/product/TagChip";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { BASE_URL } from "../redux/api/customFetchBase";
import { stringWithoutColorAvatar } from "../components/stringAvatar";
import { ProductDto } from "../redux/api/contracts";
import {
  DeleteOutline,
  Edit,
  ImageOutlined,
  MoreVert,
} from "@mui/icons-material";
import { UpdateProductImageDialog } from "../components/product/UpdateProductImageDialog";
import { UpdateProductDialog } from "../components/product/UpdateProductDialog";
import { DeleteProductDialog } from "../components/product/DeleteProductDialog";
import { BarcodeView } from "../components/product/Barcode";

export const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  let params = useParams();
  let productId = parseInt(params.productId ?? "");

  const {
    isLoading,
    isError,
    error,
    data: product,
  } = useGetProductQuery(productId);

  useEffect(() => {
    if (isError) {
      toast.error("Could not load product!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !product) {
    return <FullScreenLoader />;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={0}>
        <Box sx={{ px: 1, py: 2, mb: 2 }}>
          <Toolbar
            disableGutters={true}
            sx={{ justifyContent: "space-between" }}
          >
            <div>
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h5"
                component="div"
              >
                <span style={{ marginRight: "0.6rem" }}>{product.name}</span>
                {product.tags.map((t) => (
                  <TagChip key={t} tag={t} />
                ))}
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
                  color="inherit"
                  onClick={() => navigate("/products")}
                >
                  Products
                </Link>
                <Link
                  underline="hover"
                  color="text.primary"
                  aria-current="page"
                  onClick={() => navigate(`/products/${productId}/`)}
                >
                  {product.name}
                </Link>
              </Breadcrumbs>
            </div>

            <ProductDetailsActionButton product={product} />
          </Toolbar>
        </Box>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Paper sx={{ display: "flex" }} elevation={4}>
          <Box sx={{ p: 2 }}>
            <Avatar
              alt={product.name}
              src={`${BASE_URL}/product/${product.id}/image`}
              variant="rounded"
              sx={{
                width: 128,
                height: 128,
                border: `solid 1px ${theme.palette.divider}`,
              }}
              {...stringWithoutColorAvatar(product.name)}
            />
          </Box>
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <Table size="small">
              <TableBody>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Name
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Nickname
                  </TableCell>
                  <TableCell>{product.nickname}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Category
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Tags
                  </TableCell>
                  <TableCell>
                    {product.tags.map((t) => (
                      <TagChip key={t} tag={t} />
                    ))}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Price
                  </TableCell>
                  <TableCell>
                    <CoinAmountView coins={product.price} />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Bonus
                  </TableCell>
                  <TableCell>
                    <CoinAmountView coins={product.bonus} />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "& > *": { borderBottom: "unset !important" } }}
                >
                  <TableCell
                    width={100}
                    align="right"
                    sx={{ fontWeight: "bold" }}
                  >
                    Barcode
                  </TableCell>
                  <TableCell>
                    {product.barcode ? (
                      <BarcodeView value={product.barcode} />
                    ) : null}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export const ProductDetailsActionButton = (props: {
  product: ProductDto;
  hidePrimaryAction?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const [openImageModal, setOpenImageModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleMenuItemClick = (action: (value: boolean) => void) => {
    action(true);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant="outlined"
        size="large"
        ref={anchorRef}
        aria-label="split button"
      >
        {props.hidePrimaryAction ? null : (
          <Button startIcon={<Edit />} onClick={() => setOpenEditModal(true)}>
            Edit
          </Button>
        )}
        <Button
          sx={{ whiteSpace: "nowrap", width: "3.5rem" }}
          onClick={handleToggle}
        >
          <MoreVert />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick(setOpenImageModal)}
                  >
                    <ListItemIcon>
                      <ImageOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Set product image</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick(setOpenDeleteModal)}
                  >
                    <ListItemIcon>
                      <DeleteOutline fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete product</ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      <UpdateProductImageDialog
        product={props.product}
        open={openImageModal}
        setOpen={setOpenImageModal}
      />

      <UpdateProductDialog
        product={props.product}
        open={openEditModal}
        setOpen={setOpenEditModal}
      />

      <DeleteProductDialog
        product={props.product}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
};
