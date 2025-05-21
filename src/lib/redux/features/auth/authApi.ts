import { apiSlice } from '../api/apiSlice';
import { userLoggerIn, userLoggerOut, userRegistration, userResetToken } from './authSlice';

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: data => ({
        url: 'users/register',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userRegistration({ token: result.data.activationToken }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: 'users/activate-user',
        method: 'POST',
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: 'users/login',
        method: 'POST',
        body: {
          email,
          password,
        },
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggerIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: 'users/social-auth',
        method: 'POST',
        body: {
          email,
          name,
          avatar,
        },
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggerIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: builder.query({
      query: () => ({
        url: 'users/logout',
        method: 'GET',
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { dispatch }) {
        try {
          dispatch(userLoggerOut());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: 'users/forgot-password',
        method: 'POST',
        body: { email },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userResetToken({ resetToken: result.data.resetToken }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    resetCode: builder.mutation({
      query: ({ reset_token, reset_code }) => ({
        url: 'users/resetcode-verify',
        method: 'POST',
        body: {
          reset_token,
          reset_code,
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ reset_token, newPassword }) => ({
        url: 'users/reset-password',
        method: 'PUT',
        body: {
          reset_token,
          newPassword,
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogoutQuery,
  useForgotPasswordMutation,
  useResetCodeMutation,
  useResetPasswordMutation,
} = authApi;
