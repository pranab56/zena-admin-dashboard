import { baseApi } from "../../../utils/apiBaseQuery";


export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    dashboard: builder.query({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
    }),

    allRedemptionReward: builder.query({
      query: () => ({
        url: "/salon-reward/redemption",
        method: "GET",
      }),
    }),


  }),
});

// Export hooks
export const {
  useDashboardQuery,
  useAllRedemptionRewardQuery
} = overviewApi;
