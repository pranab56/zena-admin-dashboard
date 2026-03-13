import { baseApi } from "../../../utils/apiBaseQuery";


export const redemptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRedemption: builder.query({
      query: () => ({
        url: "/salon-reward/redemption",
        method: "GET",
      }),
    }),

    approveRedemption: builder.mutation({
      query: (id) => ({
        url: `/salon-reward/approve/${id}`,
        method: "PATCH",
      }),
    }),

  }),
});

// Export hooks
export const {
  useGetAllRedemptionQuery,
  useApproveRedemptionMutation
} = redemptionApi;

