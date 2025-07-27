import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { userLoggerIn } from '../auth/authSlice';
import { User } from '@/types/user';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:5000',
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
          const user = result.data?.user;

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
    getPendingRequests: builder.query<any[], { type: string }>({
      query: ({ type }) => ({
        url: `/api/request/get-request-pending?type=${type}`,
        method: 'GET',
        headers: {},
      }),
    }),
    handleRequest: builder.mutation<any, { type: string; requestId: string; action: 'approve' | 'reject' }>({
      query: ({ type, requestId, action }) => {
        let url = '';
        if (type === 'course_approval') url = `/api/request/handle-request-course/${requestId}`;
        else if (type === 'business_verification') url = `/api/request/handle-request-business/${requestId}`;
        else if (type === 'instructor_verification') url = `/api/request/instructor-verification/${requestId}/action`;
        return {
          url,
          method: 'PUT',
          body: { action },
          headers: {},
        };
      },
    }),
  }),
});

export const {
  useRefreshTokenQuery,
  useLoadUserQuery,
  useGetInstructorsQuery,
  useGetPendingRequestsQuery,
  useHandleRequestMutation,
} = apiSlice;
