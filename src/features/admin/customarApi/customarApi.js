import { baseApi } from "../../../utils/apiBaseQuery";


export const customarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    customer: builder.query({
      query: () => ({
        url: "/customer",
        method: "GET",
      }),
    }),

    approveReward: builder.mutation({
      query: (id) => ({
        url: `/customer/approved-reward/${id}`,
        method: "PATCH",
      }),
    }),

     signleCustomer: builder.query({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "GET",
      }),
    }),

  }),
});

// Export hooks
export const {
  useCustomerQuery,
  useApproveRewardMutation,
  useSignleCustomerQuery
} = customarApi;
