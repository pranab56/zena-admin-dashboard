import { baseApi } from "../../../utils/apiBaseQuery";


export const customarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    customer: builder.query({
      query: () => ({
        url: "/customer",
        method: "GET",
      }),
    }),

    createCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer/create",
        method: "POST",
        body: data
      }),
    }),


    applyReward: builder.mutation({
      query: (id) => ({
        url: `/customer/approved-reward/${id}`,
        method: "PATCH",
      }),
    }),

    singleCustomer: builder.query({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "GET",
      }),
    }),

    usedReword: builder.query({
      query: (id) => ({
        url: `/reward/${id}/used`,
        method: "GET",
      }),
    }),



  }),
});

// Export hooks
export const {
  useCustomerQuery,
  useApplyRewardMutation,
  useSingleCustomerQuery,
  useCreateCustomerMutation,
  useUsedRewordQuery,
} = customarApi;
