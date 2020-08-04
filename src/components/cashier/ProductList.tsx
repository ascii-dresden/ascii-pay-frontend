import * as React from "react";

import "./ProductList.scss";
import { Product, Category } from "../../app/core/models";
import { MdPhoto } from "react-icons/md";

export interface ProductListProps { }
export interface ProductListState {
    products: Map<string, Product[]>,
    loading: boolean,
    error: boolean,
}

export class ProductList extends React.Component<ProductListProps, ProductListState> {
    static displayName = "ProductList"

    constructor(props: ProductListProps) {
        super(props)

        this.state = {
            products: new Map(),
            loading: false,
            error: false
        }
    }

    async loadProducts() {
        try {
            let response = await fetch("https://ascii.pixix4.com/api/v1/products");
            let data = await response.json() as Product[];

            let map = new Map<string, Product[]>();
            for (let product of data) {
                let list = map.get(product.category.id);
                if (list) {
                    list.push(product);
                } else {
                    map.set(product.category.id, [product])
                }
            }

            this.setState({
                products: map,
                loading: false,
                error: false
            });
        } catch {
            this.setState({
                loading: false,
                error: true
            });
        }
    }

    reload() {
        this.setState({
            loading: true
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

        for (let [category, products] of this.state.products) {
            list.push(
                <ProductListEntry key={products[0].category.id} category={products[0].category} products={products} />
            )
        }

        let error;
        if (this.state.error) {
            error = <div className="product-list-error" onClick={() => this.reload()}>
                <span>Error. Click to retry!</span>
            </div>
        }
        let loading;
        if (this.state.loading) {
            error = <div className="product-list-loading" onClick={() => this.reload()}>
                <span>Loading</span>
            </div>
        }

    return <div className="product-list">{error}{loading}{list}</div>;
    }
}


interface ProductListEntryProps {
    category: Category,
    products: Product[]
}
interface ProductListEntryState { }

class ProductListEntry extends React.Component<ProductListEntryProps, ProductListEntryState> {
    static displayName = "ProductListEntry"

    render() {
        let list = this.props.products.map(product => <ProductView key={product.id} product={product} />);
        return <div className="product-list-entry">
            <div className="product-list-entry-name">{this.props.category.name}</div>
            <div className="product-list-entry-content">{list}</div>
        </div>;
    }
}



interface ProductViewProps {
    product: Product
}
interface ProductViewState { }

class ProductView extends React.Component<ProductViewProps, ProductViewState> {
    static displayName = "ProductView"

    render() {
        let product = this.props.product;

        let image;
        if (product.image) {
            image = <img src={product.image} />;
        } else {
            image = <div><MdPhoto /></div>;
        }

        return <div className="product-view" key={product.id}>
            <div className="product-view-image">{image}</div>
            <span className="product-view-name"><span>{product.name}</span></span>
            <span className="product-view-price">{product.current_price}</span>
        </div>
    }
}
