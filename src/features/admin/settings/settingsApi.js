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
  }),
});

// Export hooks
export const {
  useMySettingsMutation,
  useGetSettingsQuery
} = settingsApi;

