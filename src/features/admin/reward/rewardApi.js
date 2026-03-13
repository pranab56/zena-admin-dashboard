import { baseApi } from "../../../utils/apiBaseQuery";


export const rewardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allReward: builder.query({
      query: () => ({
        url: "/salon-reward",
        method: "GET",
      }),
    }),

    signleReward: builder.query({
      query: (id) => ({
        url: `/salon-reward/${id}`,
        method: "GET",
      }),
    }),

    updateReward: builder.mutation({
      query: ({ id, data }) => ({
        url: `/salon-reward/${id}`,
        method: "PATCH",
        body: data
      }),
    }),

    createReward: builder.mutation({
      query: (data) => ({
        url: `/salon-reward`,
        method: "POST",
        body: data,
      }),
    }),

  }),
});

// Export hooks
export const {
  useAllRewardQuery,
  useSignleRewardQuery,
  useUpdateRewardMutation,
  useCreateRewardMutation
} = rewardApi;
