import {
  AccountStatusDto,
  CoinAmountDto,
  SaveProductStatusPriceDto,
} from "../../../common/contracts";
import { useGetAllAccountStatusQuery } from "../../redux/api/accountStatusApi";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { Button, IconButton, MenuItem, TextField } from "@mui/material";
import React from "react";
import { CoinAmountEdit } from "../transaction/CoinAmountEdit";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

const StyledEditRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.4em;

  &:not(:nth-last-of-type(1)) > div::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0.3em;
    right: 0;
    border-bottom: solid 1px black;
    opacity: 0.1;
  }

  & > div {
    margin-left: 0.5em;
    position: relative;
  }
`;

export const ProductStatusPricesEdit = (props: {
  statusPrices: SaveProductStatusPriceDto[];
  setStatusPrices: (statusPrices: SaveProductStatusPriceDto[]) => void;
}) => {
  const { t } = useTranslation();

  const { data: accountStatus } = useGetAllAccountStatusQuery();

  const updateStatusPrice = (i: number, p: SaveProductStatusPriceDto) => {
    let newPrices = props.statusPrices.slice();
    newPrices[i] = p;
    props.setStatusPrices(newPrices);
  };
  const removeStatusPrice = (i: number) => {
    let newPrices = props.statusPrices.slice();
    newPrices.splice(i, 1);
    props.setStatusPrices(newPrices);
  };
  const addStatusPrice = () => {
    let newPrices = props.statusPrices.slice();
    newPrices.push({
      status_id: 0,
      price: {},
      bonus: {},
    });
    props.setStatusPrices(newPrices);
  };

  return (
    <>
      {props.statusPrices.map((p, i) => (
        <StyledEditRow key={i}>
          <IconButton onClick={() => removeStatusPrice(i)} color="error">
            <RemoveCircleOutline />
          </IconButton>
          <ProductStatusPriceEdit
            accountStatus={accountStatus}
            statusPrice={p}
            setStatusPrice={(sp) => updateStatusPrice(i, sp)}
          />
        </StyledEditRow>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddCircleOutline />}
        onClick={() => addStatusPrice()}
        fullWidth
      >
        {t("product.action.addStatusPrice")}
      </Button>
    </>
  );
};

const ProductStatusPriceEdit = (props: {
  accountStatus: AccountStatusDto[] | undefined;
  statusPrice: SaveProductStatusPriceDto;
  setStatusPrice: (statusPrice: SaveProductStatusPriceDto) => void;
}) => {
  const { t } = useTranslation();

  const setStatusId = (statusId: number) => {
    props.setStatusPrice({
      status_id: statusId,
      price: props.statusPrice.price,
      bonus: props.statusPrice.bonus,
    });
  };
  const setPrice = (price: CoinAmountDto) => {
    props.setStatusPrice({
      status_id: props.statusPrice.status_id,
      price: price,
      bonus: props.statusPrice.bonus,
    });
  };
  const setBonus = (bonus: CoinAmountDto) => {
    props.setStatusPrice({
      status_id: props.statusPrice.status_id,
      price: props.statusPrice.price,
      bonus: bonus,
    });
  };

  return (
    <div>
      <TextField
        label={t("account.edit.status")}
        fullWidth
        select
        sx={{ mb: "1rem" }}
        size="small"
        value={props.statusPrice.status_id?.toString() ?? "---"}
        onChange={(e) =>
          setStatusId(
            (isNaN(parseInt(e.target.value))
              ? null
              : parseInt(e.target.value)) ?? 0
          )
        }
      >
        {props.accountStatus?.map((s) => (
          <MenuItem key={s.id.toString()} value={s.id.toString()}>
            {s.name}
          </MenuItem>
        ))}
        <MenuItem value="---">---</MenuItem>
      </TextField>
      <CoinAmountEdit
        label={t("product.price")}
        coins={props.statusPrice.price}
        onChange={setPrice}
        size="small"
      />
      <CoinAmountEdit
        label={t("product.bonus")}
        coins={props.statusPrice.bonus}
        onChange={setBonus}
        size="small"
      />
    </div>
  );
};
