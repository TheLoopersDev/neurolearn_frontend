import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { userLoggerIn } from '../auth/authSlice';
import { User } from '@/types/user';
import { RootState } from '@/lib/redux/store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:5000',
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        // Don't add Content-Type for GET requests to avoid conflicts
      }
      return headers;
    },
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
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;

          // For session-based auth, just update the user info, do NOT overwrite token
          const user = result.data?.user;

          if (user) {
            // Only update user, keep the current token
            dispatch({
              type: 'auth/userLoggerIn',
              payload: {
                accessToken: (getState() as import('@/lib/redux/store').RootState).auth.token || '',
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
