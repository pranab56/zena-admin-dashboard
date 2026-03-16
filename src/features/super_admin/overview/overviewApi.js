import { baseApi } from "../../../utils/apiBaseQuery";


export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    overview: builder.query({
      query: (params) => ({
        url: "/dashboard",
        method: "GET",
        params
      }),
      providesTags: ["Overview"]
    }),

    topPerformingService: builder.query({
      query: (params) => ({
        url: "/analysis/top-services",
        method: "GET",
        params
      }),
      providesTags: ["Overview"]
    }),

    topPerformingSalons: builder.query({
      query: (params) => ({
        url: "/analysis/top-performing-salons",
        method: "GET",
        params
      }),
      providesTags: ["Overview"]
    }),
  }),
});

export const {
  useOverviewQuery,
  useTopPerformingServiceQuery,
  useTopPerformingSalonsQuery
} = overviewApi;
