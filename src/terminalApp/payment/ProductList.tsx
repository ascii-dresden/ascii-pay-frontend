import React, { useCallback, useState } from "react";
import Stamp from "../components/Stamp";
import { useTranslation } from "react-i18next";
import { useGetAllProductsQuery } from "../redux/api/productApi";
import { ProductDto } from "../../common/contracts";
import {
  Coffee,
  EuroSymbol,
  IcecreamOutlined,
  LiquorOutlined,
} from "@mui/icons-material";
import { useTerminalDispatch } from "../redux/terminalStore";
import { addProduct } from "../redux/features/paymentSlice";
import { Avatar } from "@mui/material";
import { BASE_URL } from "../redux/api/customFetchBase";
import { stringWithoutColorAvatar } from "../../common/stringAvatar";
import { Money } from "../components/Money";
import styled from "@emotion/styled";

const StyledProductList = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const StyledProductListTabs = styled.div`
  position: absolute;
  bottom: 0;
  height: 3.2em;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  font-size: 1.1em;
  background-color: var(--secondary-hover-background);
  border-top: solid 1px var(--border-color);

  & > div {
    overflow: hidden;
    flex: 1 1 0px;
    gap: 0.3em;
    font-size: 0.7em;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;

    &.active {
      color: var(--theme-color);
      background-color: var(--primary-background);
    }

    & > * {
      position: relative;
      z-index: 1;
    }

    & > svg {
      font-size: 1.2em;
      height: 1.2em;
      display: block;

      &.small {
        font-size: 0.8em;
      }
    }
  }
`;

const StyledProductListContent = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  top: 0;
  bottom: 3.2em;

  padding: 0.6em;
  overflow-y: scroll;
  overflow-x: hidden;

  &.list-layout {
    .product-entry {
      position: relative;
      height: 3em;
      margin-bottom: 0.5em;
      overflow: hidden;
    }

    .product-entry-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 2.9em;
      height: 2.9em;

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
            width: 2em;
            height: 2em;
          }
        }
      }
    }

    .product-entry-content {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 3.6em;
      right: 3.6em;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      display: flex;
      flex-direction: column;
      justify-content: center;

      div {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .product-entry-stamps {
      font-size: 0.8em;
      display: flex;
      line-height: 1.2em;
      gap: 0.5em;

      &:empty {
        display: none;
      }

      & > div {
        display: flex;
        align-items: center;
      }
    }

    .product-entry-price {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0.6em;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .product-entry-name {
      display: flex;
      gap: 0.2em;
      align-items: center;

      span {
        white-space: normal;
      }
    }

    .product-entry-bio {
      color: var(--success-color);
    }

    .product-entry-vegan {
      font-size: 0.6em;
      font-weight: bold;
      color: var(--success-color);
      margin-top: -0.4em;
      letter-spacing: -1.5px;
    }

    .product-entry-nickname {
      font-style: italic;
      color: var(--secondary-text-color);
      padding: 0 0.2em;
      font-size: 0.8em;

      &::before {
        content: '"';
      }

      &::after {
        content: '"';
      }
    }
  }

  &.grid-layout {
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    gap: 0.5em;
    align-content: start;

    .product-entry {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background-color: var(--primary-background);
      border: solid 1px var(--border-color);
    }

    .product-entry-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

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

          filter: drop-shadow(0px 0px 1px var(--primary-text-color));
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
            width: 2em;
            height: 2em;
          }
        }
      }
    }

    .product-entry-content {
      display: none;
    }

    .product-entry-price {
      position: absolute;
      z-index: 10;
      bottom: 0;
      right: 0;

      span {
        display: block;
        z-index: 11;
        position: relative;
        padding: 0.2em 0.4em;
        margin-bottom: -0.2em;
        font-size: 0.8em;
      }

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: var(--primary-background);
        opacity: 0.7;
      }
    }
  }
`;

const groupBy = function <T>(array: T[], selector: (x: T) => string | null) {
  let map = new Map<string | null, T[]>();
  for (let x of array) {
    let key = selector(x);
    let list = map.get(key);
    if (list) {
      list.push(x);
    } else {
      map.set(key, [x]);
    }
  }
  return map;
};

export const ProductList = () => {
  const { t } = useTranslation();

  const {
    isLoading,
    isError,
    error,
    data: products,
  } = useGetAllProductsQuery();

  let [tabIndex, setTabIndex] = useState(0);
  let [useGridLayout, setUseGridLayout] = useState(false);

  if (isLoading) {
    return <></>;
  }

  if (isError || !products) {
    return <></>;
  }

  const productGroup = groupBy(products, (x) => x.category);

  const ordering = (name: string): number => {
    switch (name) {
      case "Heißgetränke":
        return 2;
      case "Kaltgetränke 0,5l":
        return 0;
      case "Kaltgetränke 0,33l":
        return 1;
      case "Snacks":
        return 3;
      default:
        return 999;
    }
  };

  let resultArray: {
    categoryId: string;
    categoryName: string;
    categoryOrder: number;
    productList: ProductDto[];
  }[] = [];
  for (let [categoryId, productList] of productGroup.entries()) {
    resultArray.push({
      categoryId: categoryId ?? "",
      categoryName: productList[0].category,
      categoryOrder: ordering(productList[0].category),
      productList,
    });
  }
  resultArray.sort((a, b) => a.categoryOrder - b.categoryOrder);

  let tabs: any[] = [];
  let content: any[] = [];
  let index = 0;
  for (let entry of resultArray) {
    let active = index === tabIndex;
    let currentTabIndex = index;

    let name = entry.categoryName;
    let icon: any | null = null;
    switch (name) {
      case "Heißgetränke":
        icon = <Coffee />;
        name = t("payment.products.coffee");
        break;
      case "Kaltgetränke 0,5l":
        icon = <LiquorOutlined />;
        name = t("payment.products.bottle_500");
        break;
      case "Kaltgetränke 0,33l":
        icon = <LiquorOutlined fontSize="small" />;
        name = t("payment.products.bottle_330");
        break;
      case "Snacks":
        icon = <IcecreamOutlined />;
        name = t("payment.products.snacks");
        break;
    }

    let onTabClick = (index: number) => {
      if (index === tabIndex) {
        setUseGridLayout(!useGridLayout);
      } else {
        setTabIndex(currentTabIndex);
      }
    };

    tabs.push(
      <div
        key={entry.categoryId}
        className={active ? "active" : ""}
        onClick={() => onTabClick(currentTabIndex)}
      >
        {icon}
        <span>{name}</span>
      </div>
    );

    if (active) {
      entry.productList.sort((a, b) => a.name.localeCompare(b.name));
      for (let product of entry.productList) {
        content.push(<ProductItem key={product.id} product={product} />);
      }
    }

    index += 1;
  }

  return (
    <StyledProductList>
      <StyledProductListContent
        className={useGridLayout ? "grid-layout" : "list-layout"}
      >
        {content}
      </StyledProductListContent>
      <StyledProductListTabs>{tabs}</StyledProductListTabs>
    </StyledProductList>
  );
};

function ProductItem(props: { product: ProductDto }) {
  const { t } = useTranslation();
  const dispatch = useTerminalDispatch();

  const clickHandler = useCallback(() => {
    dispatch(addProduct(props.product));
  }, [props, dispatch]);

  let image;

  if (props.product) {
    image = (
      <div>
        <Avatar
          alt={props.product.name}
          src={`${BASE_URL}/product/${props.product.id}/image`}
          variant="rounded"
          {...stringWithoutColorAvatar(props.product.name)}
        />
      </div>
    );
  } else {
    image = (
      <div>
        <EuroSymbol />
      </div>
    );
  }

  let stamps: any[] = [];
  if (props.product.bonus.CoffeeStamp && props.product.bonus.CoffeeStamp > 0) {
    stamps.push(
      <Stamp
        key="coffee+1"
        value={props.product.bonus.CoffeeStamp}
        type="CoffeeStamp"
      />
    );
  } else if (
    props.product.bonus.BottleStamp &&
    props.product.bonus.BottleStamp > 0
  ) {
    stamps.push(
      <Stamp
        key="bottle+1"
        value={props.product.bonus.BottleStamp}
        type="BottleStamp"
      />
    );
  }
  if (props.product.price.CoffeeStamp && props.product.price.CoffeeStamp > 0) {
    stamps.push(
      <Stamp
        key="coffee-1"
        value={t("payment.products.payable")}
        type="CoffeeStamp"
      />
    );
  } else if (
    props.product.price.BottleStamp &&
    props.product.price.BottleStamp > 0
  ) {
    stamps.push(
      <Stamp
        key="bottle-1"
        value={t("payment.products.payable")}
        type="BottleStamp"
      />
    );
  }

  let start = props.product.name.indexOf("(");
  let end = props.product.name.indexOf(")") + 1;

  let splitName = start >= 0 && end >= start;

  let flags = props.product.tags.map((tag) => tag.toLocaleLowerCase());

  let nameArray = [];

  if (splitName) {
    nameArray.push(
      <span key="name">{props.product.name.substring(0, start)}</span>
    );
    nameArray.push(
      <i key="splitName">{props.product.name.substring(start, end)}</i>
    );
  } else {
    nameArray.push(<span key="name">{props.product.name}</span>);
  }
  if (props.product.nickname) {
    nameArray.push(
      <div key="nickname" className="product-entry-nickname">
        {props.product.nickname}
      </div>
    );
  }
  if (flags.includes("bio")) {
    nameArray.push(
      <div key="bio" className="product-entry-bio">
        <span>BIO</span>
      </div>
    );
  }
  if (flags.includes("vegan")) {
    nameArray.push(
      <div key="vegan" className="product-entry-vegan">
        <span>VEGAN</span>
      </div>
    );
  }

  let name = <div className="product-entry-name">{nameArray}</div>;

  return (
    <div onClick={clickHandler}>
      <div className="product-entry" data-id={props.product.id}>
        <div className="product-entry-image">
          <div>{image}</div>
        </div>
        <div className="product-entry-content">
          {name}
          <div className="product-entry-stamps">{stamps}</div>
        </div>
        <div className="product-entry-price">
          <Money
            value={
              (props.product.price.Cent ?? 0) + (props.product.bonus.Cent ?? 0)
            }
          />
        </div>
      </div>
    </div>
  );
}
