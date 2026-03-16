import { baseApi } from "../../../utils/apiBaseQuery";


export const analysisApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allSalonAnalysis: builder.query({
      query: (params) => ({
        url: "/analysis/salons",
        method: "GET",
        params
      }),
      providesTags: ["Salons"]
    }),

    salonAnalysisDetails: builder.query({
      query: (id) => ({
        url: `/analysis/salon-history/${id}`,
        method: "GET",
      }),
      providesTags: ["Salons"]
    }),

    topServices: builder.query({
      query: () => ({
        url: `/analysis/top-services`,
        method: "GET",
      }),
      providesTags: ["Salons"]
    }),

  }),
});

// Export hooks
export const {
  useAllSalonAnalysisQuery,
  useSalonAnalysisDetailsQuery,
  useTopServicesQuery
} = analysisApi;
