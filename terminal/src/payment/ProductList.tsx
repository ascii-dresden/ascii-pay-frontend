import React, { useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql';
import { getProducts, getProducts_getProducts_element } from '../__generated__/getProducts';
import './ProductList.scss';
import { MdPhoto } from 'react-icons/md';
import { moneyToString } from '../components/Money';
import { useAppDispatch } from '../store';
import { addProduct } from './paymentSlice';
import { StampType } from '../types/graphql-global';

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

  if (loading) {
    return <></>;
  }

  if (error) {
    return <></>;
  }

  if (!data) {
    return <></>;
  }

  const productGroup = groupBy(data.getProducts, (x) => x.element.category?.id ?? '');

  let groups: any[] = [];
  for (let [categoryId, productList] of productGroup.entries()) {
    groups.push(<ProductGroup key={categoryId} productList={productList.map((x) => x.element)} />);
  }
  return <div className="product-list">{groups}</div>;
}

function ProductGroup(props: { productList: getProducts_getProducts_element[] }) {
  let list = props.productList.map((product) => <ProductItem key={product.id} product={product} />);
  return (
    <div className="product-list-entry">
      <div className="product-list-entry-name">{props.productList[0].category?.name}</div>
      <div className="product-list-entry-content">{list}</div>
    </div>
  );
}

function ProductItem(props: { product: getProducts_getProducts_element }) {
  const dispatch = useAppDispatch();

  const clickHandler = useCallback(() => {
    dispatch(
      addProduct({
        id: props.product.id,
        name: props.product.name,
        image: props.product.image,
        price: props.product.price ?? props.product.category.price,
        payWithStamps: StampType.NONE,
        giveStamps: props.product.giveStamps ?? props.product.category.giveStamps,
      })
    );
  }, [props, dispatch]);

  let image;
  if (props.product.image) {
    image = <img src={props.product.image} alt="" />;
  } else {
    image = (
      <div>
        <MdPhoto />
      </div>
    );
  }
  return (
    <div className="product-view" key={props.product.id} onClick={clickHandler}>
      <div className="product-view-image">{image}</div>
      <span className="product-view-name">
        <span>{props.product.name}</span>
      </span>
      <span className="product-view-price">{moneyToString(props.product.price ?? props.product.category.price)}</span>
    </div>
  );
}
