import { baseApi } from "../../../utils/apiBaseQuery";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    mySettings: builder.mutation({
      query: (data) => ({
        url: "/salon/setting",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    getSettings: builder.query({
      query: () => ({
        url: "/salon/setting",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    // tires (Reward Targets)
    allTire: builder.query({
      query: () => ({
        url: `/rule/tire`,
        method: "GET",
      }),
      providesTags: ["Settings"]
    }),
    createTire: builder.mutation({
      query: (data) => ({
        url: "/rule/tire",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Settings"]
    }),
    updateTire: builder.mutation({
      query: ({ data, id }) => ({
        url: `/rule/tire/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Settings"]
    }),
    updateTireStatus: builder.mutation({
      query: (id) => ({
        url: `/rule/tire-is-active/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Settings"]
    }),

    // smart rules
    allSmartRule: builder.query({
      query: () => ({
        url: `/rule/smartRule`,
        method: "GET",
      }),
      providesTags: ["Settings"]
    }),
    updateSmartRule: builder.mutation({
      query: ({ data, id }) => ({
        url: `/rule/smart/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Settings"]
    }),

    updateSmartRuleBody: builder.mutation({
      query: ({ data }) => ({
        url: `/rule/smart`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Settings"]
    }),


    // time & day rules
    allRule: builder.query({
      query: () => ({
        url: `/rule/time-day-rule`,
        method: "GET",
      }),
      providesTags: ["Settings"]
    }),
    createRule: builder.mutation({
      query: (data) => ({
        url: "/rule/time-day-rule",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Settings"]
    }),
    updateRule: builder.mutation({
      query: ({ data, id }) => ({
        url: `/rule/time-day-rule/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Settings"]
    }),
    deleteRule: builder.mutation({
      query: (id) => ({
        url: `/rule/time-day-rule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"]
    }),
  }),
});

// Export hooks
export const {
  useMySettingsMutation,
  useGetSettingsQuery,
  useAllTireQuery,
  useCreateTireMutation,
  useUpdateTireMutation,
  useUpdateTireStatusMutation,
  useAllSmartRuleQuery,
  useUpdateSmartRuleMutation,
  useAllRuleQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
  useUpdateSmartRuleBodyMutation
} = settingsApi;
