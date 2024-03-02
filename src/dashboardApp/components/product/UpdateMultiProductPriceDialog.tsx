import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateProductMutation } from "../../redux/api/productApi";
import {
  CoinAmountDto,
  ProductDto,
  ProductStatusPriceDto,
  SaveProductDto,
  SaveProductStatusPriceDto,
} from "../../../common/contracts";
import { CoinAmountEdit } from "../transaction/CoinAmountEdit";
import { Close, ExpandMore, StarsOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ProductStatusPricesEdit } from "./ProductStatusPricesEdit";
import { TagChip } from "./TagChip";
import { CoinAmountView } from "../transaction/CoinAmountView";
import { AccountStatusChip } from "../accountStatus/AccountStatusChip";
import styled from "@emotion/styled";
import { useGetAllAccountStatusQuery } from "../../redux/api/accountStatusApi";
import {
  addCoinAmount,
  isCoinAmountEmpty,
} from "../../../common/transactionUtils";

const ProductStatusPricesPopoverStyled = styled.div`
  position: absolute;
  visibility: hidden;
  opacity: 0;
  z-index: 1;
  top: calc(100% - 1.4em);
  right: -2em;
  white-space: nowrap;
  transition: opacity 0.2s ease, visibility 0.2s ease;
`;

const ProductStatusPricesIndicatorStyled = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4em;
  cursor: default;

  & > span {
    padding-top: 0.1em;
  }

  &:hover > div {
    visibility: visible;
    opacity: 1;
  }
`;

export const UpdateMultiProductPriceDialog = (props: {
  products: ProductDto[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [updateProduct, { isLoading, isError, error, isSuccess }] =
    useUpdateProductMutation();

  const { data: accountStatus } = useGetAllAccountStatusQuery();

  const [mode, setMode] = React.useState<"override" | "offset">("override");

  const [price, setPrice] = React.useState<CoinAmountDto>({});
  const [bonus, setBonus] = React.useState<CoinAmountDto>({});
  const [statusPrices, setStatusPrices] = React.useState<
    SaveProductStatusPriceDto[]
  >([]);

  const extendedStatusPrices = React.useMemo(() => {
    return statusPrices.map(
      (sp) =>
        ({
          status: accountStatus?.find((s) => s.id == sp.status_id) ?? {
            id: -1,
            name: "",
            color: "",
            priority: 0,
          },
          price: sp.price,
          bonus: sp.bonus,
        } as ProductStatusPriceDto)
    );
  }, [accountStatus, statusPrices]);
  React.useEffect(() => {
    setPrice({});
    setBonus({});
    setStatusPrices([]);
  }, [props.products]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product updated successfully!");
      props.setOpen(false);
    } else if (isError) {
      toast.error("Product could not be updated!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = async () => {
    for (const product of props.products) {
      let {
        price: newPrice,
        bonus: newBonus,
        statusPrices: newStatusPrices,
      } = calculatePrices(product, mode, price, bonus, extendedStatusPrices);

      let saveProduct: SaveProductDto = {
        name: product.name,
        nickname: product.nickname,
        barcode: product.barcode,
        price: newPrice,
        bonus: newBonus,
        category: product.category,
        tags: product.tags,
        status_prices: newStatusPrices.map((sp) => ({
          status_id: sp.status.id,
          price: sp.price,
          bonus: sp.bonus,
        })),
      };
      await updateProduct({
        id: product.id,
        product: saveProduct,
      });
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle component="div">
        <Typography variant="h5">{t("product.edit.updateTitle")}</Typography>
        <IconButton
          aria-label="close"
          onClick={() => props.setOpen(false)}
          sx={{
            position: "absolute",
            right: 16,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box pt={1}>
          <ToggleButtonGroup
            value={mode}
            onChange={(_, value) => setMode(value)}
            sx={{ mb: 3 }}
            size="small"
            color="primary"
            fullWidth
            exclusive
          >
            <ToggleButton value="override">Override prices</ToggleButton>
            <ToggleButton value="offset">Apply offset</ToggleButton>
          </ToggleButtonGroup>
          <CoinAmountEdit
            label={t("product.price")}
            coins={price}
            onChange={setPrice}
          />
          <CoinAmountEdit
            label={t("product.bonus")}
            coins={bonus}
            onChange={setBonus}
          />
          <ProductStatusPricesEdit
            statusPrices={statusPrices}
            setStatusPrices={setStatusPrices}
          />
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              Preview
            </AccordionSummary>
            <AccordionDetails>
              <Table aria-label="Preview table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("product.name")}</TableCell>
                    <TableCell width={250}>
                      {t("product.price")} / {t("product.bonus")}
                    </TableCell>
                    <TableCell width={80}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.products.map((product) => (
                    <ProductListRow
                      key={product.id}
                      mode={mode}
                      product={product}
                      price={price}
                      bonus={bonus}
                      statusPrices={extendedStatusPrices}
                    />
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          fullWidth
          sx={{ mx: 2, py: 1.5 }}
          onClick={handleSubmit}
          loading={isLoading}
        >
          {t("product.edit.updateAction")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

function calculatePrices(
  product: ProductDto,
  mode: "override" | "offset",
  price: CoinAmountDto,
  bonus: CoinAmountDto,
  statusPrices: ProductStatusPriceDto[]
) {
  let newPrice = price;
  let newBonus = bonus;
  let newStatusPrices = statusPrices;

  if (mode === "offset") {
    newPrice = addCoinAmount(product.price, price);
    newBonus = addCoinAmount(product.bonus, bonus);
    newStatusPrices = statusPrices.map((sp) => ({
      status: sp.status,
      price: addCoinAmount(newPrice, sp.price),
      bonus: addCoinAmount(newBonus, sp.bonus),
    }));

    for (let statusPrice of product.status_prices) {
      if (
        newStatusPrices.findIndex(
          (sp) => sp.status.id === statusPrice.status.id
        ) < 0
      ) {
        newStatusPrices.push(statusPrice);
      }
    }

    for (let statusPrice of statusPrices) {
      if (
        isCoinAmountEmpty(statusPrice.price) &&
        isCoinAmountEmpty(statusPrice.bonus)
      ) {
        newStatusPrices = newStatusPrices.filter(
          (sp) => sp.status.id !== statusPrice.status.id
        );
      }
    }
  }

  return {
    price: newPrice,
    bonus: newBonus,
    statusPrices: newStatusPrices,
  };
}

const ProductListRow = (props: {
  product: ProductDto;
  mode: "override" | "offset";
  price: CoinAmountDto;
  bonus: CoinAmountDto;
  statusPrices: ProductStatusPriceDto[];
}) => {
  const { t } = useTranslation();

  let { price, bonus, statusPrices } = calculatePrices(
    props.product,
    props.mode,
    props.price,
    props.bonus,
    props.statusPrices
  );

  return (
    <>
      <TableRow style={{ height: 78 }}>
        <TableCell>
          <Typography>{props.product.name}</Typography>
          <Typography variant="caption">{props.product.nickname}</Typography>

          <div style={{ marginBottom: -3 }}>
            {props.product.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        </TableCell>
        <TableCell width={250} align="right">
          <CoinAmountView coins={price} />
          <div style={{ height: "1em" }}></div>
          <CoinAmountView coins={bonus} />
        </TableCell>
        <TableCell width={80}>
          {statusPrices.length <= 0 ? (
            <ProductStatusPricesIndicatorStyled>
              <StarsOutlined fontSize="small" opacity={0.2} />
            </ProductStatusPricesIndicatorStyled>
          ) : (
            <ProductStatusPricesIndicatorStyled>
              <span>{statusPrices.length}</span>
              <span>×</span>
              <StarsOutlined fontSize="small" opacity={0.8} />
              <ProductStatusPricesPopoverStyled>
                <Paper elevation={4}>
                  <Table aria-label="Price table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("layout.accountStatus")}</TableCell>
                        <TableCell>{t("product.price")}</TableCell>
                        <TableCell>{t("product.bonus")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statusPrices.map((p) => (
                        <TableRow key={p.status.id}>
                          <TableCell>
                            <AccountStatusChip status={p.status} />
                          </TableCell>
                          <TableCell>
                            <CoinAmountView coins={p.price} />
                          </TableCell>
                          <TableCell>
                            <CoinAmountView coins={p.bonus} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </ProductStatusPricesPopoverStyled>
            </ProductStatusPricesIndicatorStyled>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};
