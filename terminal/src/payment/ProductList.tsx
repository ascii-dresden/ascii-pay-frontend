import React, { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql';
import { getProducts, getProducts_getProducts } from '../__generated__/getProducts';
import './ProductList.scss';
import { MdCoffee, MdEuroSymbol, MdPhoto } from 'react-icons/md';
import { FaLeaf, FaWineBottle } from 'react-icons/fa';
import { GiChocolateBar } from 'react-icons/gi';
import Money from '../components/Money';
import { useAppDispatch } from '../store';
import { addProduct } from './paymentSlice';
import { StampType } from '../types/graphql-global';
import Stamp from '../components/Stamp';
import { SERVER_URI } from '..';

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

export default function ProductList() {
  const { loading, error, data } = useQuery<getProducts>(GET_PRODUCTS, {
    fetchPolicy: 'network-only',
  });

  let [tabIndex, setTabIndex] = useState(0);

  if (loading) {
    return <></>;
  }

  if (error) {
    return <></>;
  }

  if (!data) {
    return <></>;
  }

  const productGroup = groupBy(data.getProducts, (x) => x.category.name);

  const ordering = (name: string): number => {
    switch (name) {
      case 'Heißgetränke':
        return 0;
      case 'Kaltgetränke 0,5l':
        return 0;
      case 'Kaltgetränke 0,33l':
        return 0;
      case 'Snacks':
        return 0;
      default:
        return 999;
    }
  };

  let resultArray: {
    categoryId: string;
    categoryName: string;
    categoryOrder: number;
    productList: getProducts_getProducts[];
  }[] = [];
  for (let [categoryId, productList] of productGroup.entries()) {
    resultArray.push({
      categoryId: categoryId ?? '',
      categoryName: productList[0].category.name,
      categoryOrder: ordering(productList[0].category.name),
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
      case 'Heißgetränke':
        icon = <MdCoffee />;
        name = 'Kaffee';
        break;
      case 'Kaltgetränke 0,5l':
        icon = <FaWineBottle />;
        name = 'Flasche 0,5l';
        break;
      case 'Kaltgetränke 0,33l':
        icon = <FaWineBottle />;
        name = 'Flasche 0,33l';
        break;
      case 'Snacks':
        icon = <GiChocolateBar />;
        name = 'Snacks';
        break;
    }

    tabs.push(
      <div key={entry.categoryId} className={active ? 'active' : ''} onClick={() => setTabIndex(currentTabIndex)}>
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
    <div className="product-list">
      <div className="product-list-content">{content}</div>
      <div className="product-list-tabs">{tabs}</div>
    </div>
  );
}

function ProductItem(props: { product: getProducts_getProducts }) {
  const dispatch = useAppDispatch();

  const clickHandler = useCallback(() => {
    dispatch(
      addProduct({
        id: props.product.id,
        name: props.product.name,
        image: props.product.image,
        price: props.product.price,
        payWithStamps: StampType.NONE,
        giveStamps: props.product.giveStamps,
      })
    );
  }, [props, dispatch]);

  let image;

  if (props.product) {
    if (props.product.image) {
      image = (
        <div>
          <img src={SERVER_URI + props.product.image} alt="" />
        </div>
      );
    } else {
      image = (
        <div>
          <MdPhoto />
        </div>
      );
    }
  } else {
    image = (
      <div>
        <MdEuroSymbol />
      </div>
    );
  }

  let stamps: any[] = [];
  if (props.product.giveStamps === StampType.COFFEE) {
    stamps.push(<Stamp key="coffee+1" value={1} type={StampType.COFFEE} />);
  } else if (props.product.giveStamps === StampType.BOTTLE) {
    stamps.push(<Stamp key="bottle+1" value={1} type={StampType.BOTTLE} />);
  }

  if (props.product.payWithStamps === StampType.COFFEE) {
    stamps.push(<Stamp key="coffee-10" value="Bezahlbar mit " type={StampType.COFFEE} />);
  } else if (props.product.payWithStamps === StampType.BOTTLE) {
    stamps.push(<Stamp key="bottle-10" value="Bezahlbar mit " type={StampType.BOTTLE} />);
  }

  let start = props.product.name.indexOf('(');
  let end = props.product.name.indexOf(')') + 1;

  let splitName = start >= 0 && end >= start;

  let name = (
    <div className="product-entry-name">
      <span>{splitName ? props.product.name.substring(0, start) : props.product.name}</span>
      {splitName ? <i>{props.product.name.substring(start, end)}</i> : null}
      {props.product.flags.includes('BIO') ? (
        <div key="bio" className="product-entry-bio">
          <FaLeaf />
        </div>
      ) : null}
    </div>
  );

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
          <Money value={props.product.price} />
        </div>
      </div>
    </div>
  );
}
