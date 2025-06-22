import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { userLoggerIn } from '../auth/authSlice';
import { User } from '@/types/user';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  }),
  endpoints: builder => ({
    refreshToken: builder.query({
      query: () => ({
        url: 'users/refresh',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: 'users/me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          // For session-based auth, we don't get accessToken from loadUser
          // Just update the user info
          const user = result.data?.user ?? result.user;

          if (user) {
            dispatch(
              userLoggerIn({
                accessToken: 'session-based', // Placeholder for session auth
                user: user,
              })
            );
          }
        } catch (error) {
          console.log('LoadUser error:', error);
        }
      },
    }),
    getInstructors: builder.query<User[], void>({
      query: () => ({
        url: 'users/instructors',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useRefreshTokenQuery,
  useLoadUserQuery,
  useGetInstructorsQuery,
} = apiSlice;
