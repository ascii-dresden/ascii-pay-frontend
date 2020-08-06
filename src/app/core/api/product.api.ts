import { Product } from "../models";
import { requestJson, Method } from "./utils";

export async function listProducts(search: string = null): Promise<Product[]> {
    return await requestJson(
        Method.GET,
        "products" + (search ? "?search=" + search : "")
    )
}

export async function createProduct(product: Product): Promise<string> {
    return await requestJson(
        Method.PUT,
        "products",
        product
    )
}

export async function getProduct(id: string): Promise<Product> {
    return await requestJson(
        Method.GET,
        "product/" + id
    )
}

export async function updateProduct(product: Product) {
    return await requestJson(
        Method.POST,
        "product/" + product.id
    )
}

export async function deleteProduct(product: Product) {
    return await requestJson(
        Method.DELETE,
        "product/" + product.id
    )
}
