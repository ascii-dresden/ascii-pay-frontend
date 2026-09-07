import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import {
  MarkShoppingListItemDoneDto,
  SaveShoppingListItemDto,
  ShoppingListItemDto,
  ShoppingListStateDto,
} from "../../../common/contracts";

export type GetShoppingListArgs = {
  state?: ShoppingListStateDto;
};

/** Every list cache key that may contain an entry (used for optimistic removal). */
const LIST_ARGS: (GetShoppingListArgs | void)[] = [
  undefined,
  { state: "open" },
  { state: "done" },
  { state: "all" },
];

/** Removes an entry from a cached list (optimistic update). */
const removeEntry = (id: number) => (draft: ShoppingListItemDto[]) => {
  const index = draft.findIndex((item) => item.id === id);
  if (index >= 0) {
    draft.splice(index, 1);
  }
};

export const shoppingListApi = createApi({
  reducerPath: "shoppingListApi",
  baseQuery: customFetchBase,
  tagTypes: ["ShoppingList"],
  endpoints: (builder) => ({
    getShoppingList: builder.query<
      ShoppingListItemDto[],
      GetShoppingListArgs | void
    >({
      query(args) {
        return {
          url: "/shopping-list",
          params: args?.state ? { state: args.state } : undefined,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ShoppingList" as const,
                id,
              })),
              { type: "ShoppingList", id: "LIST" },
            ]
          : [{ type: "ShoppingList", id: "LIST" }],
    }),
    getShoppingListItem: builder.query<ShoppingListItemDto, number>({
      query(id) {
        return {
          url: `/shopping-list/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "ShoppingList", id }],
    }),
    createShoppingListItem: builder.mutation<
      ShoppingListItemDto,
      SaveShoppingListItemDto
    >({
      query(body) {
        return {
          url: "/shopping-list",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "ShoppingList", id: "LIST" }],
    }),
    updateShoppingListItem: builder.mutation<
      ShoppingListItemDto,
      { id: number; body: SaveShoppingListItemDto }
    >({
      query({ id, body }) {
        return {
          url: `/shopping-list/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "ShoppingList", id },
        { type: "ShoppingList", id: "LIST" },
      ],
    }),
    deleteShoppingListItem: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/shopping-list/${id}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patches = LIST_ARGS.map((args) =>
          dispatch(
            shoppingListApi.util.updateQueryData(
              "getShoppingList",
              args,
              removeEntry(id)
            )
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: "ShoppingList", id },
        { type: "ShoppingList", id: "LIST" },
      ],
    }),
    markShoppingListItemDone: builder.mutation<
      ShoppingListItemDto,
      { id: number } & MarkShoppingListItemDoneDto
    >({
      query({ id, purchase_id }) {
        return {
          url: `/shopping-list/${id}/done`,
          method: "POST",
          body: { purchase_id: purchase_id ?? null },
        };
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Drop the entry from the open list right away; the done list is
        // refreshed by the tag invalidation.
        const patch = dispatch(
          shoppingListApi.util.updateQueryData(
            "getShoppingList",
            { state: "open" },
            removeEntry(id)
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "ShoppingList", id },
        { type: "ShoppingList", id: "LIST" },
      ],
    }),
    reopenShoppingListItem: builder.mutation<ShoppingListItemDto, number>({
      query(id) {
        return {
          url: `/shopping-list/${id}/reopen`,
          method: "POST",
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: "ShoppingList", id },
        { type: "ShoppingList", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetShoppingListQuery,
  useGetShoppingListItemQuery,
  useCreateShoppingListItemMutation,
  useUpdateShoppingListItemMutation,
  useDeleteShoppingListItemMutation,
  useMarkShoppingListItemDoneMutation,
  useReopenShoppingListItemMutation,
} = shoppingListApi;
