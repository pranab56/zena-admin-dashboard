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
  }),
});

export const {
  useSystemSettingMutation
} = settingsApi;
