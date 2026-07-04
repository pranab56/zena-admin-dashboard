import { baseApi } from "../../utils/apiBaseQuery";

export const ruleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTire: builder.query({
      query: ({ page }) => ({
        url: `/rule/tire?page=${page}`,
        method: "GET",
      }),
      providesTags: ["rule"],
    }),

    createTire: builder.mutation({
      query: (data) => ({
        url: "/rule/tire",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["rule"],
    }),

    updateTire: builder.mutation({
      query: ({ id, data }) => ({
        url: `/rule/tire/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["rule"],
    }),

    updateStatusTire: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/rule/tire-is-active/${id}`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["rule"],
    }),

    deleteTire: builder.mutation({
      query: (id) => ({
        url: `/rule/tire/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["rule"],
    }),
  }),
});

export const {
  useGetAllTireQuery,
  useCreateTireMutation,
  useUpdateTireMutation,
  useUpdateStatusTireMutation,
  useDeleteTireMutation,
} = ruleApi;
