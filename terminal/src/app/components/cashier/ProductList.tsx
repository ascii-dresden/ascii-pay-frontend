import * as React from 'react';

import './ProductList.scss';
import { Product, Category } from '@ascii-pay-frontend/common/src/models';
import { listProducts } from '@ascii-pay-frontend/common/src/api';
import { MdPhoto } from 'react-icons/md';
import { BASE_URL } from '@ascii-pay-frontend/common/src/api/utils';

export interface ProductListProps {
  selectProduct: (product: Product) => void;
}
export interface ProductListState {
  products: Map<string | null, Product[]>;
  loading: boolean;
  error: boolean;
}

export class ProductList extends React.Component<ProductListProps, ProductListState> {
  static displayName = 'ProductList';

  constructor(props: ProductListProps) {
    super(props);

    this.state = {
      products: new Map(),
      loading: false,
      error: false,
    };
  }

  async loadProducts() {
    try {
      let data = await listProducts();

      let map = new Map<string | null, Product[]>();
      for (let product of data) {
        let list = map.get(product.category?.id || null);
        if (list) {
          list.push(product);
        } else {
          map.set(product.category?.id || null, [product]);
        }
      }

      this.setState({
        products: map,
        loading: false,
        error: false,
      });
    } catch {
      this.setState({
        loading: false,
        error: true,
      });
    }
  }

  reload() {
    this.setState({
      loading: true,
    });
    (async () => {
      this.loadProducts();
    })();
  }

  componentDidMount() {
    if (this.state.products.size <= 0) {
      (async () => {
        this.loadProducts();
      })();
    }
  }

  render() {
    let list = [];

    for (let [category, products] of this.state.products.entries()) {
      list.push(
        <ProductListEntry
          key={products[0].category?.id}
          category={products[0].category || null}
          products={products}
          selectProduct={(product) => this.props.selectProduct(product)}
        />
      );
    }

    let error;
    if (this.state.error) {
      error = (
        <div className="product-list-error" onClick={() => this.reload()}>
          <span>Error. Click to retry!</span>
        </div>
      );
    }
    let loading;
    if (this.state.loading) {
      loading = (
        <div className="product-list-loading" onClick={() => this.reload()}>
          <span>Loading</span>
        </div>
      );
    }

    return (
      <div className="product-list">
        {error}
        {loading}
        {list}
      </div>
    );
  }
}

interface ProductListEntryProps {
  category: Category | null;
  products: Product[];
  selectProduct: (product: Product) => void;
}
interface ProductListEntryState {}

class ProductListEntry extends React.Component<ProductListEntryProps, ProductListEntryState> {
  static displayName = 'ProductListEntry';

  render() {
    let list = this.props.products.map((product) => (
      <ProductView key={product.id} product={product} selectProduct={() => this.props.selectProduct(product)} />
    ));
    return (
      <div className="product-list-entry">
        <div className="product-list-entry-name">{this.props.category?.name}</div>
        <div className="product-list-entry-content">{list}</div>
      </div>
    );
  }
}

interface ProductViewProps {
  product: Product;
  selectProduct: () => void;
}
interface ProductViewState {}

class ProductView extends React.Component<ProductViewProps, ProductViewState> {
  static displayName = 'ProductView';

  render() {
    let product = this.props.product;

    let image;
    if (product.image) {
      image = <img src={BASE_URL + 'product/image/' + product.image} />;
    } else {
      image = (
        <div>
          <MdPhoto />
        </div>
      );
    }

    return (
      <div className="product-view" key={product.id} onClick={() => this.props.selectProduct()}>
        <div className="product-view-image">{image}</div>
        <span className="product-view-name">
          <span>{product.name}</span>
        </span>
        <span className="product-view-price">{((product.current_price || 0) / 100).toFixed(2)}€</span>
      </div>
    );
  }
}
