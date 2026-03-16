import { baseApi } from "../../utils/apiBaseQuery";


export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: () => ({
        url: `/notification`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    getNotificationCount: builder.query({
      query: () => ({
        url: `/notification/count`,
        method: "GET",
      }),
      providesTags: ["NotificationCount"],
    }),

    readNotification: builder.query({
      query: (id) => ({
        url: `/notification/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["NotificationCount", "Notification"],
    }),

  }),
});

// Export hooks
export const {
  useGetAllNotificationQuery,
  useGetNotificationCountQuery,
  useReadNotificationQuery,
} = notificationApi;
