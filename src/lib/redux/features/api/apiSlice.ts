import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { userLoggerIn } from '../auth/authSlice';
import { User } from '@/types/user';
import { RootState } from '@/lib/redux/store';
import { getCookie } from '@/lib/utils';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:5000',
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Don't manually set Authorization header for HttpOnly cookies
      // The browser will automatically send the cookie with credentials: 'include'
      return headers;
    },
  }),
  tagTypes: ['User'],
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
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;

          // For session-based auth, just update the user info, do NOT overwrite token
          const user = result.data?.user;

          if (user) {
            // Don't try to get HttpOnly cookie, just update user info
            dispatch({
              type: 'auth/userLoggerIn',
              payload: {
                accessToken: 'session-based', // Keep session-based for HttpOnly cookies
                user: user,
              },
            });
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
        url: `/request/get-request-pending?type=${type}`,
        method: 'GET',
      }),
    }),
    handleRequest: builder.mutation<any, { type: string; requestId: string; action: 'approve' | 'reject' }>({
      query: ({ type, requestId, action }) => {
        let url = '';
        if (type === 'course_approval') url = `/request/handle-request-course/${requestId}`;
        else if (type === 'business_verification') url = `/request/handle-request-business/${requestId}`;
        else if (type === 'instructor_verification') url = `/request/instructor-verification/${requestId}/action`;
        return {
          url,
          method: 'PUT',
          body: { action },
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
