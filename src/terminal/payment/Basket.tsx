import React from "react";
import { Money } from "../components/Money";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  clearPaymentItems,
  PaymentTransactionItem,
  removePaymentItemAtIndex,
  setKeypadValue,
} from "../../redux/features/paymentSlice";
import { equalCoinAmount } from "../../components/transaction/transactionUtils";
import { EuroSymbol, Photo, RedeemOutlined } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { BASE_URL } from "../../redux/api/customFetchBase";
import { stringWithoutColorAvatar } from "../../components/stringAvatar";
import Stamp from "../components/Stamp";
import styled from "@emotion/styled";

const StyledBasketEmpty = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  top: 4.4rem;
  bottom: 3.2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-left: solid 1px var(--border-color);
  background-color: var(--primary-background);

  .basket-entry-count::after {
    content: "×";
  }

  &.dark {
    .basket-entry-image-shadow * {
      filter: drop-shadow(0 0 0.7px var(--tertiary-background));
    }
  }
`;
const StyledBasket = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  top: 4.4rem;
  bottom: 3.2rem;

  padding: 0.6rem;
  overflow-y: scroll;
  overflow-x: hidden;

  border-left: solid 1px var(--border-color);
  background-color: var(--primary-background);

  & > div {
    display: flex;
    flex-direction: column-reverse;
  }
`;
const StyledBasketEntry = styled.div`
  position: relative;
  height: 3rem;
  margin-bottom: 0.5rem;
  overflow: hidden;

  &.inactive {
    opacity: 0.3;
  }
`;
const StyledBasketEntryImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 2.9rem;
  height: 2.9rem;

  &.bottle,
  &.coffee,
  &.cup {
    & > div div::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }

  &.bottle > div div::before {
    //background: linear-gradient(155deg, rgba(0, 0, 0, 0) 69%, var(--bottle-color) 69%, var(--bottle-color) 100%);
    background: var(--bottle-color);
  }

  &.coffee > div div::before {
    //background: linear-gradient(155deg, rgba(0, 0, 0, 0) 69%, var(--coffee-color) 69%, var(--coffee-color) 100%);
    background: var(--coffee-color);
  }

  &.cup > div div::before {
    //background: linear-gradient(155deg, rgba(0, 0, 0, 0) 69%, var(--cup-color) 69%, var(--cup-color) 100%);
    background: var(--cup-color);
  }

  & > div {
    width: 100%;
    padding-top: 100%;
    position: relative;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    div {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: var(--tertiary-background);
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        position: absolute;
        z-index: 2;
        width: 2rem;
        height: 2rem;
      }
    }
  }
`;
const StyledBasketEntryContent = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 3.6rem;
  right: 3.6rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;

  div {
    white-space: normal;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
const StyledBasketEntryStamps = styled.div`
  font-size: 0.8rem;
  display: flex;
  line-height: 1.2rem;
  gap: 0.5rem;

  &:empty {
    display: none;
  }

  & > div {
    display: flex;
    align-items: center;
  }
`;
const StyledBasketEntryPrice = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0.6rem;
  padding-left: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: var(--primary-background);
`;
const StyledBasketDeleteAll = styled.div`
  text-align: center;
  padding: 0.2rem 0;

  span {
    display: block;
    border: solid 1px var(--border-color);
    background-color: var(--secondary-background);
    padding: 0.4rem 2rem;
  }
`;

function paymentItemEqual(
  a: PaymentTransactionItem,
  b: PaymentTransactionItem
): boolean {
  if (a.product.id !== b.product.id) return false;
  if (a.product.name !== b.product.name) return false;
  if (!equalCoinAmount(a.product.price, b.product.price)) return false;
  if (!equalCoinAmount(a.product.bonus, b.product.bonus)) return false;
  return equalCoinAmount(a.effective_price, b.effective_price);
}

function groupPaymentItems(
  items: PaymentTransactionItem[]
): Map<PaymentTransactionItem, number> {
  let map = new Map<PaymentTransactionItem, number>();

  for (let item of items) {
    let found = false;
    for (let [key, value] of map) {
      if (paymentItemEqual(item, key)) {
        found = true;
        map.set(key, value + 1);
        break;
      }
    }

    if (!found) {
      map.set(item, 1);
    }
  }

  return map;
}

function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}

export const Basket = () => {
  const { t } = useTranslation();
  const storedPaymentItems = useAppSelector(
    (state) => state.paymentState.storedPaymentItems
  );
  const keypadValue = useAppSelector((state) => state.paymentState.keypadValue);
  const dispatch = useAppDispatch();

  if (storedPaymentItems.length <= 0 && keypadValue === 0) {
    return <StyledBasketEmpty>{t("payment.basket.empty")}</StyledBasketEmpty>;
  }

  const paymentItemMap = groupPaymentItems(storedPaymentItems);

  const onRemove = (item: PaymentTransactionItem) => {
    let i = findLastIndex(storedPaymentItems, (v) => paymentItemEqual(v, item));
    dispatch(removePaymentItemAtIndex(i));
  };
  const onClear = () => {
    dispatch(clearPaymentItems());
  };

  let content: any = [];
  let index = 0;

  for (let [value, count] of paymentItemMap) {
    let image;

    if (value.product) {
      if (value.product.id !== undefined) {
        image = (
          <div>
            <Avatar
              alt={value.product.name}
              src={`${BASE_URL}/product/${value.product.id}/image`}
              variant="square"
              {...stringWithoutColorAvatar(value.product.name)}
            />
          </div>
        );
      } else {
        image = (
          <div className="basket-entry-image-shadow">
            <Photo />
          </div>
        );
      }
    } else {
      if (value.effective_price.Cent && value.effective_price.Cent < 0) {
        image = (
          <div className="basket-entry-image-shadow">
            <RedeemOutlined />
          </div>
        );
      } else {
        image = (
          <div className="basket-entry-image-shadow">
            <EuroSymbol />
          </div>
        );
      }
    }

    let stamps: any[] = [];
    if (
      value.effective_price.CoffeeStamp &&
      value.effective_price.CoffeeStamp < 0
    ) {
      stamps.push(<Stamp key="coffee+1" value={1} type="CoffeeStamp" />);
    } else if (
      value.effective_price.BottleStamp &&
      value.effective_price.BottleStamp < 0
    ) {
      stamps.push(<Stamp key="bottle+1" value={1} type="BottleStamp" />);
    }

    content.push(
      <div key={index} onClick={() => onRemove(value)}>
        <StyledBasketEntry>
          <StyledBasketEntryImage className={value.colorHint}>
            <div>{image}</div>
          </StyledBasketEntryImage>
          <StyledBasketEntryContent>
            <div>{value.product.name}</div>
            <StyledBasketEntryStamps>{stamps}</StyledBasketEntryStamps>
          </StyledBasketEntryContent>
          <StyledBasketEntryPrice>
            {count > 1 ? (
              <span className="basket-entry-count">{count}</span>
            ) : null}
            <Money value={value.effective_price.Cent ?? 0} />
          </StyledBasketEntryPrice>
        </StyledBasketEntry>
      </div>
    );

    index += 1;
  }

  if (keypadValue !== 0) {
    content.push(
      <div key={index} onClick={() => dispatch(setKeypadValue(0))}>
        <StyledBasketEntry className="inactive">
          <StyledBasketEntryImage>
            <div>
              <div>
                {keypadValue >= 0 ? <EuroSymbol /> : <RedeemOutlined />}
              </div>
            </div>
          </StyledBasketEntryImage>
          <StyledBasketEntryContent>
            <div>
              {keypadValue >= 0
                ? t("payment.basket.keypadValuePositive")
                : t("payment.basket.keypadValueNegative")}
            </div>
          </StyledBasketEntryContent>
          <StyledBasketEntryPrice>
            <Money value={keypadValue} />
          </StyledBasketEntryPrice>
        </StyledBasketEntry>
      </div>
    );
  }

  if (content.length >= 3) {
    content.splice(
      0,
      0,
      <StyledBasketDeleteAll key="delete-all" onClick={onClear}>
        <span>{t("payment.basket.emptyAction")}</span>
      </StyledBasketDeleteAll>
    );
  }

  return (
    <StyledBasket>
      <div>{content}</div>
    </StyledBasket>
  );
};
