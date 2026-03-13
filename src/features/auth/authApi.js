import { baseApi } from "../../utils/apiBaseQuery";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login-admin",
        method: "POST",
        body: credentials,
      }),
    }),

    sendOTP: builder.mutation({
      query: (forgotEmail) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: forgotEmail,
      }),
    }),

    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

// Export hooks
export const {
  useLoginMutation,
  useSendOTPMutation,
  useForgetPasswordMutation,
} = authApi;
