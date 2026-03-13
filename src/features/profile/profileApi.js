import { baseApi } from "../../utils/apiBaseQuery";


export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => ({
        url: "/user/details",
        method: "GET",
      }),
      providesTags: ["Profile"]
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user",
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Profile"]
    }),

    // resetPasswordProfile: builder.mutation({
    //   query: () => ({
    //     url: "/auth/change-password",
    //     method: "POST",
    //   }),
    // }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} = profileApi;
