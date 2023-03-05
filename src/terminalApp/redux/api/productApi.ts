import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import { ProductDto } from "../../../common/contracts";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: customFetchBase,
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProduct: builder.query<ProductDto, number>({
      query(id) {
        return {
          url: `/product/${id}`,
          credentials: "include",
        };
      },
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    getAllProducts: builder.query<ProductDto[], void>({
      query() {
        return {
          url: `/products`,
          credentials: "include",
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
  }),
});

export const { useGetAllProductsQuery, useGetProductQuery } = productApi;
