import { baseApi } from "../../../utils/apiBaseQuery";


export const visitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    allVisits: builder.query({
      query: (params) => ({
        url: "/rule/smartRule",
        method: "GET",
        params: params,
      }),
    }),


    approveVisits: builder.mutation({
      query: (id) => ({
        url: `/salon-reward/approve/${id}`,
        method: "PATCH",
      }),
    }),

  }),
});

// Export hooks
export const {
  useAllVisitsQuery,
  useApproveVisitsMutation
} = visitApi;
