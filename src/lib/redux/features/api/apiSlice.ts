import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { User } from '@/types/user';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:5000',
    credentials: 'include',
    prepareHeaders: headers => {
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
      providesTags: ['User'],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
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
    updateCurrentUserInfo: builder.mutation<{ user: User }, Partial<User>>({
      query: updatedData => ({
        url: 'users/update-user', // <<-- ĐẢM BẢO ĐÂY LÀ ĐÚNG ENDPOINT TRÊN BACKEND CỦA BẠN -->>
        method: 'PUT', // Hoặc PATCH tùy backend
        body: updatedData,
      }),
      // <<-- QUAN TRỌNG: INVALIDATE TAG 'User' SAU KHI CẬP NHẬT THÀNH CÔNG -->>
      invalidatesTags: ['User'],
    }),
    // <<-- THAY ĐỔI: THÊM MUTATION CẬP NHẬT AVATAR -->>
    updateUserAvatar: builder.mutation<{ user: User }, string>({
      // `string` ở đây là base64 image string
      query: avatarBase64 => ({
        url: 'users/update-avatar', // <<-- ĐẢM BẢO ĐÂY LÀ ĐÚNG ENDPOINT TRÊN BACKEND CỦA BẠN -->>
        method: 'PUT', // Hoặc POST tùy backend
        body: { avatar: avatarBase64 }, // Backend của bạn cần nhận trường `avatar`
      }),
      // <<-- QUAN TRỌNG: INVALIDATE TAG 'User' SAU KHI CẬP NHẬT THÀNH CÔNG -->>
      invalidatesTags: ['User'],
    }),
    // <<-- THAY ĐỔI: Thêm oldPassword vào payload -->>
    updatePassword: builder.mutation<any, { oldPassword: string; newPassword: string }>({
      query: data => ({
        url: 'users/update-password', // This should match your backend's password update API
        method: 'PUT',
        body: data,
      }),
      // No invalidatesTags: ['User'] here, as password change typically requires re-login
      // and user data might not change visually. The useEffect in SettingPage handles logout/redirect.
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
    handleRequest: builder.mutation<
      any,
      { type: string; requestId: string; action: 'approve' | 'reject' }
    >({
      query: ({ type, requestId, action }) => {
        let url = '';
        if (type === 'course_approval') url = `/request/handle-request-course/${requestId}`;
        else if (type === 'business_verification')
          url = `/request/handle-request-business/${requestId}`;
        else if (type === 'instructor_verification')
          url = `/request/instructor-verification/${requestId}/action`;
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
  useUpdateCurrentUserInfoMutation, // <<-- THAY ĐỔI: EXPORT HOOK MỚI -->>
  useUpdateUserAvatarMutation, // <<-- THAY ĐỔI: EXPORT HOOK MỚI -->>
  useUpdatePasswordMutation,
  useGetPendingRequestsQuery,
  useHandleRequestMutation,
} = apiSlice;
