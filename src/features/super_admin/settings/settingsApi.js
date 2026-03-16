import { baseApi } from "../../../utils/apiBaseQuery";


export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    systemSetting: builder.mutation({
      query: (data) => ({
        url: "/rule/global",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["settings"]
    }),

    getSystemSetting: builder.query({
      query: () => ({
        url: "/rule/globalRule",
        method: "GET",
      }),
      providesTags: ["settings"]
    }),

    // -----------------------------------

    createTire: builder.mutation({
      query: (data) => ({
        url: "/rule/tire",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["settings"]
    }),

    updateTire: builder.mutation({
      query: ({ data, id }) => ({
        url: `/rule/tire/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["settings"]
    }),

    updateTireStatus: builder.mutation({
      query: (id) => ({
        url: `/rule/tire-is-active/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["settings"]
    }),

    allTire: builder.query({
      query: () => ({
        url: `/rule/tire`,
        method: "GET",
      }),
      invalidatesTags: ["settings"]
    }),

    // --------------------------------


    createRule: builder.mutation({
      query: (data) => ({
        url: "/rule/time-day-rule",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["settings"]
    }),


    updateRule: builder.mutation({
      query: ({ data, id }) => ({
        url: `/rule/time-day-rule/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["settings"]
    }),

    allRule: builder.query({
      query: () => ({
        url: `/rule/time-day-rule`,
        method: "GET",
      }),
      invalidatesTags: ["settings"]
    }),

    deleteRule: builder.mutation({
      query: (id) => ({
        url: `/rule/time-day-rule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["settings"]
    }),


    // ------------------------------------------

    allSmartRule: builder.query({
      query: () => ({
        url: `/rule/smartRule`,
        method: "GET",
      }),
      invalidatesTags: ["settings"]
    }),

    updateSmartRule: builder.mutation({
      query: ({ data, id }) => ({
        url: `/rule/smart/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["settings"]
    }),

  }),
});

export const {
  useSystemSettingMutation,
  useGetSystemSettingQuery,
  useCreateTireMutation,
  useUpdateTireMutation,
  useAllTireQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useAllRuleQuery,
  useDeleteRuleMutation,
  useAllSmartRuleQuery,
  useUpdateSmartRuleMutation,
  useUpdateTireStatusMutation,
} = settingsApi;
