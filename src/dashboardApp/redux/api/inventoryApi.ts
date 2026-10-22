import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import { productApi } from "./productApi";
import { purchaseApi } from "./purchaseApi";
import { shoppingListApi } from "./shoppingListApi";
import {
  CompleteInventoryCheckDto,
  CompleteInventoryCheckResponseDto,
  CreateInventoryCheckDto,
  InventoryCheckDto,
  InventoryCheckItemDto,
  InventoryCheckStateDto,
  InventoryCheckSummaryDto,
  InventoryRowDto,
  UpdateInventoryCheckItemDto,
  UpdateInventoryProductDto,
} from "../../../common/contracts";

export type GetInventoryChecksArgs = {
  state?: InventoryCheckStateDto;
};

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: customFetchBase,
  tagTypes: ["Inventory", "InventoryChecks"],
  endpoints: (builder) => ({
    getInventory: builder.query<InventoryRowDto[], void>({
      query() {
        return {
          url: "/inventory",
        };
      },
      providesTags: [{ type: "Inventory", id: "LIST" }],
    }),
    updateInventoryProducts: builder.mutation<
      void,
      UpdateInventoryProductDto[]
    >({
      query(products) {
        return {
          url: "/products/inventory",
          method: "PUT",
          body: products,
        };
      },
      invalidatesTags: [{ type: "Inventory", id: "LIST" }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            productApi.util.invalidateTags([{ type: "Products", id: "LIST" }])
          );
        } catch {
          // handled by the caller
        }
      },
    }),
    getInventoryChecks: builder.query<
      InventoryCheckSummaryDto[],
      GetInventoryChecksArgs | void
    >({
      query(args) {
        return {
          url: "/inventory/checks",
          params: args?.state ? { state: args.state } : undefined,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "InventoryChecks" as const,
                id,
              })),
              { type: "InventoryChecks", id: "LIST" },
            ]
          : [{ type: "InventoryChecks", id: "LIST" }],
    }),
    createInventoryCheck: builder.mutation<
      InventoryCheckDto,
      CreateInventoryCheckDto
    >({
      query(body) {
        return {
          url: "/inventory/checks",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "InventoryChecks", id: "LIST" }],
    }),
    getInventoryCheck: builder.query<InventoryCheckDto, number>({
      query(id) {
        return {
          url: `/inventory/check/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "InventoryChecks", id }],
    }),
    updateInventoryCheckItem: builder.mutation<
      InventoryCheckItemDto,
      {
        id: number;
        productId: number;
        /** Set for products that are counted per sub product. */
        subProductId?: number | null;
        body: UpdateInventoryCheckItemDto;
      }
    >({
      query({ id, productId, subProductId, body }) {
        return {
          url:
            subProductId != null
              ? `/inventory/check/${id}/item/${productId}/sub-product/${subProductId}`
              : `/inventory/check/${id}/item/${productId}`,
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(
        { id, productId, subProductId, body },
        { dispatch, queryFulfilled }
      ) {
        const patch = dispatch(
          inventoryApi.util.updateQueryData(
            "getInventoryCheck",
            id,
            (draft) => {
              const item = draft.items.find(
                (i) =>
                  i.product.id === productId &&
                  (i.sub_product_id ?? null) === (subProductId ?? null)
              );
              if (item) {
                item.counted_quantity = body.counted_quantity;
              }
              draft.counted_count = draft.items.filter(
                (i) => i.counted_quantity !== null
              ).length;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      // The detail cache is patched optimistically; only the summaries need
      // to be refreshed (they are not subscribed while counting).
      invalidatesTags: [{ type: "InventoryChecks", id: "LIST" }],
    }),
    deleteInventoryCheck: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/inventory/check/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: "InventoryChecks", id },
        { type: "InventoryChecks", id: "LIST" },
      ],
    }),
    completeInventoryCheck: builder.mutation<
      CompleteInventoryCheckResponseDto,
      { id: number; body: CompleteInventoryCheckDto }
    >({
      query({ id, body }) {
        return {
          url: `/inventory/check/${id}/complete`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "InventoryChecks", id },
        { type: "InventoryChecks", id: "LIST" },
        { type: "Inventory", id: "LIST" },
      ],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.purchase) {
            dispatch(
              purchaseApi.util.invalidateTags([
                { type: "Purchases", id: "LIST" },
              ])
            );
          }
          // The missing articles land on the shared shopping list, which lives
          // in its own slice and would otherwise still show the stale list.
          if (data.shopping_list_items.length > 0) {
            dispatch(
              shoppingListApi.util.invalidateTags([
                { type: "ShoppingList", id: "LIST" },
              ])
            );
          }
        } catch {
          // handled by the caller
        }
      },
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useUpdateInventoryProductsMutation,
  useGetInventoryChecksQuery,
  useCreateInventoryCheckMutation,
  useGetInventoryCheckQuery,
  useUpdateInventoryCheckItemMutation,
  useDeleteInventoryCheckMutation,
  useCompleteInventoryCheckMutation,
} = inventoryApi;
