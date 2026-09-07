import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import {
  PurchaseDto,
  PurchaseItemDto,
  PurchaseStateDto,
  SavePurchaseDto,
  SavePurchaseItemDto,
} from "../../../common/contracts";

export type GetAllPurchasesArgs = { state?: PurchaseStateDto } | void;

const purchaseTags = (id: number) => [
  { type: "Purchases" as const, id },
  { type: "Purchases" as const, id: "LIST" },
];

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
        result ? purchaseTags(id) : [{ type: "Purchases", id: "LIST" }],
    }),
    getPurchase: builder.query<PurchaseDto, number>({
      query(id) {
        return {
          url: `/purchase/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Purchases", id }],
    }),
    getAllPurchases: builder.query<PurchaseDto[], GetAllPurchasesArgs>({
      query(args) {
        return {
          url: `/purchases`,
          params: args && args.state ? { state: args.state } : undefined,
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
    finalizePurchase: builder.mutation<PurchaseDto, number>({
      query(id) {
        return {
          url: `/purchase/${id}/finalize`,
          method: "POST",
        };
      },
      invalidatesTags: (result, error, id) => purchaseTags(id),
    }),
    reopenPurchase: builder.mutation<PurchaseDto, number>({
      query(id) {
        return {
          url: `/purchase/${id}/reopen`,
          method: "POST",
        };
      },
      invalidatesTags: (result, error, id) => purchaseTags(id),
    }),
    addPurchaseItem: builder.mutation<
      PurchaseItemDto,
      { id: number; item: SavePurchaseItemDto }
    >({
      query({ id, item }) {
        return {
          url: `/purchase/${id}/items`,
          method: "POST",
          body: item,
        };
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: created } = await queryFulfilled;
          // Insert the created row right away; the tag invalidation below
          // refetches the purchase afterwards to stay consistent.
          dispatch(
            purchaseApi.util.updateQueryData("getPurchase", id, (draft) => {
              if (!draft.items.some((i) => i.id === created.id)) {
                draft.items.push(created);
              }
            })
          );
        } catch {
          // handled by the caller
        }
      },
      invalidatesTags: (result, error, { id }) => purchaseTags(id),
    }),
    updatePurchaseItem: builder.mutation<
      PurchaseItemDto,
      { id: number; itemId: number; item: SavePurchaseItemDto }
    >({
      query({ id, itemId, item }) {
        return {
          url: `/purchase/${id}/item/${itemId}`,
          method: "PUT",
          body: item,
        };
      },
      async onQueryStarted({ id, itemId, item }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          purchaseApi.util.updateQueryData("getPurchase", id, (draft) => {
            const existing = draft.items.find((i) => i.id === itemId);
            if (!existing) {
              return;
            }
            existing.name = item.name;
            existing.container_size = item.container_size;
            existing.container_count = item.container_count;
            existing.container_cents = item.container_cents;
            existing.best_before = item.best_before ?? null;
            existing.barcode = item.barcode ?? null;
            existing.collected = item.collected ?? true;
            if (item.product_id === null) {
              existing.product = null;
            } else if (existing.product?.id !== item.product_id) {
              // Product changed to one we cannot resolve locally; the
              // refetch triggered by the tag invalidation fills it in.
              existing.product = null;
            }
          })
        );
        try {
          const { data: updated } = await queryFulfilled;
          dispatch(
            purchaseApi.util.updateQueryData("getPurchase", id, (draft) => {
              const index = draft.items.findIndex((i) => i.id === itemId);
              if (index >= 0) {
                draft.items[index] = updated;
              }
            })
          );
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => purchaseTags(id),
    }),
    deletePurchaseItem: builder.mutation<void, { id: number; itemId: number }>({
      query({ id, itemId }) {
        return {
          url: `/purchase/${id}/item/${itemId}`,
          method: "DELETE",
        };
      },
      async onQueryStarted({ id, itemId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          purchaseApi.util.updateQueryData("getPurchase", id, (draft) => {
            draft.items = draft.items.filter((i) => i.id !== itemId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => purchaseTags(id),
    }),
  }),
});

export const {
  useCreatePurchaseMutation,
  useDeletePurchaseMutation,
  useUpdatePurchaseMutation,
  useGetAllPurchasesQuery,
  useGetPurchaseQuery,
  useFinalizePurchaseMutation,
  useReopenPurchaseMutation,
  useAddPurchaseItemMutation,
  useUpdatePurchaseItemMutation,
  useDeletePurchaseItemMutation,
  useLazyGetPurchaseQuery,
} = purchaseApi;
