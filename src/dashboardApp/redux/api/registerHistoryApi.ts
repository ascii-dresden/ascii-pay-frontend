import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import {
  RegisterHistoryDto,
  SaveRegisterHistoryDto,
} from "../../../common/contracts";

export const registerHistoryApi = createApi({
  reducerPath: "registerHistoryApi",
  baseQuery: customFetchBase,
  tagTypes: ["RegisterHistories"],
  endpoints: (builder) => ({
    createRegisterHistory: builder.mutation<
      RegisterHistoryDto,
      SaveRegisterHistoryDto
    >({
      query(registerHistory) {
        return {
          url: "/register",
          method: "POST",
          body: registerHistory,
        };
      },
      invalidatesTags: [{ type: "RegisterHistories", id: "LIST" }],
    }),
    updateRegisterHistory: builder.mutation<
      RegisterHistoryDto,
      { id: number; registerHistory: SaveRegisterHistoryDto }
    >({
      query({ id, registerHistory }) {
        return {
          url: `/register/${id}`,
          method: "PUT",
          body: registerHistory,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: "RegisterHistories", id },
              { type: "RegisterHistories", id: "LIST" },
            ]
          : [{ type: "RegisterHistories", id: "LIST" }],
    }),
    getRegisterHistory: builder.query<RegisterHistoryDto, number>({
      query(id) {
        return {
          url: `/register/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "RegisterHistories", id }],
    }),
    getAllRegisterHistories: builder.query<RegisterHistoryDto[], void>({
      query() {
        return {
          url: `/register`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "RegisterHistories" as const,
                id,
              })),
              { type: "RegisterHistories", id: "LIST" },
            ]
          : [{ type: "RegisterHistories", id: "LIST" }],
    }),
    deleteRegisterHistory: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/register/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [{ type: "RegisterHistories", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateRegisterHistoryMutation,
  useDeleteRegisterHistoryMutation,
  useUpdateRegisterHistoryMutation,
  useGetAllRegisterHistoriesQuery,
  useGetRegisterHistoryQuery,
} = registerHistoryApi;
