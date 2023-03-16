import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import { ProductDto, SaveProductDto } from "../../../common/contracts";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: customFetchBase,
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    createProduct: builder.mutation<ProductDto, SaveProductDto>({
      query(product) {
        return {
          url: "/products",
          method: "POST",
          body: product,
        };
      },
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    updateProduct: builder.mutation<
      ProductDto,
      { id: number; product: SaveProductDto }
    >({
      query({ id, product }) {
        return {
          url: `/product/${id}`,
          method: "PUT",
          body: product,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: "Products", id },
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    updateProductImage: builder.mutation<
      void,
      { id: number; content: FormData }
    >({
      query({ id, content }) {
        return {
          url: `/product/${id}/image`,
          method: "PUT",
          body: content,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: "Products", id },
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    deleteProductImage: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/product/${id}/image`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) =>
        result
          ? [
              { type: "Products", id },
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    getProduct: builder.query<ProductDto, number>({
      query(id) {
        return {
          url: `/product/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    getAllProducts: builder.query<ProductDto[], void>({
      query() {
        return {
          url: `/products`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Products" as const,
                id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    deleteProduct: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/product/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
  useGetAllProductsQuery,
  useGetProductQuery,
} = productApi;
