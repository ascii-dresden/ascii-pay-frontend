import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import {
  BarcodeConflictDto,
  ProductBarcodeDto,
  ProductDto,
  SaveProductBarcodeDto,
  SaveProductDto,
} from "../../../common/contracts";

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
    getProductByBarcode: builder.query<ProductDto, string>({
      query(barcode) {
        return {
          url: `/products/by-barcode/${encodeURIComponent(barcode.trim())}`,
        };
      },
      providesTags: (result) =>
        result ? [{ type: "Products", id: result.id }] : [],
    }),
    /** Products that already use a code, for the duplicate warning in the product form. */
    getBarcodeConflicts: builder.query<BarcodeConflictDto[], string>({
      query(barcode) {
        return {
          url: `/products/by-barcode/${encodeURIComponent(
            barcode.trim()
          )}/conflicts`,
        };
      },
    }),
    /** Adds one code to an existing product without rewriting the whole product. */
    addProductBarcode: builder.mutation<
      ProductBarcodeDto,
      { id: number; barcode: SaveProductBarcodeDto }
    >({
      query({ id, barcode }) {
        return {
          url: `/product/${id}/barcodes`,
          method: "POST",
          body: barcode,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),
    deleteProductBarcode: builder.mutation<
      void,
      { id: number; barcodeId: number }
    >({
      query({ id, barcodeId }) {
        return {
          url: `/product/${id}/barcode/${barcodeId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
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
  useGetProductByBarcodeQuery,
  useLazyGetProductByBarcodeQuery,
  useGetBarcodeConflictsQuery,
  useLazyGetBarcodeConflictsQuery,
  useAddProductBarcodeMutation,
  useDeleteProductBarcodeMutation,
  useGetProductQuery,
} = productApi;
