import { baseApi } from "../../../utils/apiBaseQuery";


export const visitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allVisits: builder.query({
      query: (params) => ({
        url: "/visit",
        method: "GET",
        params: params,
      }),
    }),

    approveVisits: builder.mutation({
      query: (rewardId) => ({
        url: `/visit/${rewardId}`,
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
