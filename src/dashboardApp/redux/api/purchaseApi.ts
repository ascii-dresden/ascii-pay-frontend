import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import { PurchaseDto, SavePurchaseDto } from "../../../common/contracts";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: customFetchBase,
  tagTypes: ["Purchases"],
  endpoints: (builder) => ({
    createPurchase: builder.mutation<PurchaseDto, SavePurchaseDto>({
      query(purchase) {
        return {
          url: "/purchases",
          method: "POST",
          body: purchase,
        };
      },
      invalidatesTags: [{ type: "Purchases", id: "LIST" }],
    }),
    updatePurchase: builder.mutation<
      PurchaseDto,
      { id: number; purchase: SavePurchaseDto }
    >({
      query({ id, purchase }) {
        return {
          url: `/purchase/${id}`,
          method: "PUT",
          body: purchase,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: "Purchases", id },
              { type: "Purchases", id: "LIST" },
            ]
          : [{ type: "Purchases", id: "LIST" }],
    }),
    getPurchase: builder.query<PurchaseDto, number>({
      query(id) {
        return {
          url: `/purchase/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Purchases", id }],
    }),
    getAllPurchases: builder.query<PurchaseDto[], void>({
      query() {
        return {
          url: `/purchases`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Purchases" as const,
                id,
              })),
              { type: "Purchases", id: "LIST" },
            ]
          : [{ type: "Purchases", id: "LIST" }],
    }),
    deletePurchase: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/purchase/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [{ type: "Purchases", id: "LIST" }],
    }),
  }),
});

export const {
  useCreatePurchaseMutation,
  useDeletePurchaseMutation,
  useUpdatePurchaseMutation,
  useGetAllPurchasesQuery,
  useGetPurchaseQuery,
} = purchaseApi;
