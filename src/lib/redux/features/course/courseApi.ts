import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Course } from '@/types/course';

interface ApiResponse<T> {
  success: boolean;
  courses: T;
  message?: string;
}

interface RootState {
  auth?: {
    token?: string;
  };
}

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URI}/courses`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Course'],
  endpoints: (builder) => ({
    getCourses: builder.query<ApiResponse<Course[]>, void>({
      query: () => '',
      providesTags: ['Course'],
    }),
    getCourseById: builder.query<ApiResponse<Course>, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    createCourse: builder.mutation<ApiResponse<Course>, Partial<Course>>({
      query: (course) => ({
        url: '',
        method: 'POST',
        body: course,
      }),
      invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation<ApiResponse<Course>, { id: string; course: Partial<Course> }>({
      query: ({ id, course }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: course,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Course', id }],
    }),
    deleteCourse: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),
    searchCourses: builder.query<ApiResponse<Course[]>, { search: string; category?: string; level?: string }>({
      query: ({ search, category, level }) => ({
        url: '/search',
        method: 'GET',
        params: { search, category, level },
      }),
      providesTags: ['Course'],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useSearchCoursesQuery,
} = courseApi; 