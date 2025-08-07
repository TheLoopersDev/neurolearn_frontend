import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface RootState {
  auth?: {
    token?: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface CourseApprovalRequest {
  _id: string;
  courseId: string;
  userId: string;
  type: 'course_approval';
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export const requestApi = createApi({
  reducerPath: 'requestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Request'],
  endpoints: builder => ({
    createCourseApprovalRequest: builder.mutation<
      ApiResponse<CourseApprovalRequest>,
      { courseId: string; message?: string }
    >({
      query: ({ courseId, message }) => ({
        url: '/request/create-request-course',
        method: 'POST',
        body: { courseId, message },
      }),
      invalidatesTags: ['Request'],
    }),

    getInstructorCourseRequests: builder.query<
      { success: boolean; total: number; data: CourseApprovalRequest[] },
      void
    >({
      query: () => '/request/instructor/course-requests',
      providesTags: ['Request'],
    }),
    updateCourseApprovalRequest: builder.mutation<
      ApiResponse<CourseApprovalRequest>,
      { requestId?: string; courseId: string; message?: string; status?: string }
    >({
      query: ({ requestId, courseId, message, status }) => ({
        url: '/request/update-course-approval-request',
        method: 'PUT',
        body: { requestId, courseId, message, status },
      }),
      invalidatesTags: ['Request'],
    }),
  }),
});

export const {
  useCreateCourseApprovalRequestMutation,
  useGetInstructorCourseRequestsQuery,
  useUpdateCourseApprovalRequestMutation,
} = requestApi;
