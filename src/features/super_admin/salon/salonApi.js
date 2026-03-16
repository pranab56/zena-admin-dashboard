import { baseApi } from "../../../utils/apiBaseQuery";


export const salonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allSalon: builder.query({
      query: (params) => ({
        url: "/salon",
        method: "GET",
        params
      }),
      providesTags: ["Salons"]
    }),

    salonDetails: builder.query({
      query: (id) => ({
        url: `/salon/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Salons", id }]
    }),

    createSalon: builder.mutation({
      query: (data) => ({
        url: `/salon`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Salons"]
    }),

    salonCard: builder.query({
      query: () => ({
        url: "/salon/salon-menagement",
        method: "GET",
      }),
      providesTags: ["Salons"]
    }),

  }),
});

// Export hooks
export const {
  useAllSalonQuery,
  useSalonDetailsQuery,
  useCreateSalonMutation,
  useSalonCardQuery
} = salonApi;
