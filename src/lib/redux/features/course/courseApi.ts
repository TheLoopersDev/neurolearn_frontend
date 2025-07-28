import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Course } from '@/types/course';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  courses?: T;
  message?: string;
}

interface RootState {
  auth?: {
    token?: string;
  };
}

interface PaginatedCourses {
  page: number;
  totalCourses: number;
  totalPages: number;
  limit: number;
  courses: Course[];
}

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URI}`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Course'],
  endpoints: builder => ({
    getCourses: builder.query<ApiResponse<Course[]>, void>({
      query: () => '/courses',
      providesTags: ['Course'],
    }),
    getCourseById: builder.query<ApiResponse<Course>, string>({
      query: id => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    getCourseByDetail: builder.query<ApiResponse<Course>, string>({
      query: id => `/courses/course/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    getTopCourses: builder.query<ApiResponse<{ courses: Course[] }>, void>({
      query: () => '/courses/top-courses',
      providesTags: ['Course'],
    }),
    getUserCourses: builder.query<ApiResponse<Course[]>, void>({
      query: () => '/courses/user-courses',
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(course => ({ type: 'Course' as const, id: course._id })),
              { type: 'Course' },
            ]
          : [{ type: 'Course' }],
      transformResponse: (response: { success: boolean; data: Course[] }) => {
        return {
          success: response.success,
          data: response.data,
        };
      },
    }),

    createCourse: builder.mutation<ApiResponse<Course>, Partial<Course>>({
      query: course => ({
        url: '/courses/create-course',
        method: 'POST',
        body: course,
      }),
      invalidatesTags: result =>
        result?.data?._id
          ? [{ type: 'Course' }, { type: 'Course', id: result.data._id }]
          : [{ type: 'Course' }],
    }),
    updateCourse: builder.mutation<ApiResponse<Course>, { id: string; course: Partial<Course> }>({
      query: ({ id, course }) => ({
        url: `/courses/update-course/${id}`,
        method: 'PUT',
        body: course,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Course', id },
        { type: 'Course' }, // đảm bảo getUserCourses cũng bị refetch
      ],
    }),
    saveCurriculum: builder.mutation<ApiResponse<null>, { courseId: string; sections: any[] }>({
      query: ({ courseId, sections }) => ({
        url: `/courses/${courseId}/sections`,
        method: 'POST',
        body: sections,
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Course', id: courseId }],
    }),
    deleteCourse: builder.mutation<ApiResponse<void>, string>({
      query: id => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),
    searchCourses: builder.query<
      ApiResponse<Course[]>,
      { search: string; category?: string; level?: string }
    >({
      query: ({ search, category, level }) => ({
        url: '/courses/search',
        method: 'GET',
        params: { search, category, level },
      }),
      providesTags: ['Course'],
    }),
    getCoursesPaginated: builder.query<
      PaginatedCourses,
      {
        page?: number;
        limit?: number;
        category?: string;
        level?: string;
        subCategory?: string;
        price?: 'Free' | 'Paid';
        rating?: number;
        language?: string;
        authorId?: string;
        search?: string;
      }
    >({
      query: params => ({
        url: '/courses/pagination',
        method: 'GET',
        params,
      }),

      transformResponse: (response: PaginatedCourses & { success: boolean }) => {
        return {
          page: response.page,
          limit: response.limit,
          totalCourses: response.totalCourses,
          totalPages: response.totalPages,
          courses: response.courses,
        };
      },

      serializeQueryArgs: ({ queryArgs }) => {
        const {
          page = 1,
          limit = 12,
          category = '',
          level = '',
          price = '',
          rating = '',
          subCategory = '',
          language = '',
          authorId = '',
          search = '',
        } = queryArgs;

        return `courses-${page}-${limit}-${category}-${level}-${price}-${rating}-${subCategory}-${language}-${authorId}-${search}`;
      },

      keepUnusedDataFor: 60,
      providesTags: ['Course'],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCourseByDetailQuery,
  useGetTopCoursesQuery,
  useGetUserCoursesQuery,
  useSaveCurriculumMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useSearchCoursesQuery,
  useGetCoursesPaginatedQuery,
} = courseApi;
