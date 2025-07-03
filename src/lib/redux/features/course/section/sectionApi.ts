import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Section {
    _id: string;
    title: string;
    description?: string;
    courseId: string;
    order: number;
    isPublished?: boolean;
    lessons?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface SectionDetail extends Section {
    lessons?: any[];
}

interface ApiResponse<T> {
    _id: string | undefined;
    success: boolean;
    data?: T;
    message?: string;
}

interface RootState {
    auth?: {
        token?: string;
    };
}

export const sectionApi = createApi({
    reducerPath: 'sectionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Section'],
    endpoints: (builder) => ({
        getAllSections: builder.query<ApiResponse<Section[]>, string>({
            query: (courseId) => `/sections/course/${courseId}`,
            providesTags: ['Section'],
        }),
        getSectionsByUserId: builder.query<ApiResponse<Section[]>, string>({
            query: (userId) => `/sections/user/${userId}`,
            providesTags: ['Section'],
        }),
        getSectionDetail: builder.query<ApiResponse<SectionDetail>, string>({
            query: (sectionId) => `/sections/detail/${sectionId}`,
            providesTags: (result, error, id) => [{ type: 'Section', id }],
        }),
        createSection: builder.mutation<ApiResponse<Section>, { courseId: string; data: Partial<Section> }>({
            query: ({ courseId, data }) => ({
                url: `/sections/create/${courseId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Section'],
        }),
        updateSection: builder.mutation<ApiResponse<Section>, { id: string; data: Partial<Section> }>({
            query: ({ id, data }) => ({
                url: `/sections/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Section', id }],
        }),
        deleteSection: builder.mutation<ApiResponse<void>, string>({
            query: (sectionId) => ({
                url: `/sections/delete/${sectionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Section'],
        }),
        reorderSections: builder.mutation<ApiResponse<null>, { sectionOrders: { sectionId: string; order: number }[] }>({
            query: (body) => ({
                url: '/sections/reorder',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Section'],
        }),
        publishSection: builder.mutation<ApiResponse<Section>, string>({
            query: (sectionId) => ({
                url: `/sections/publish/${sectionId}`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Section', id }],
        }),
        unpublishSection: builder.mutation<ApiResponse<Section>, string>({
            query: (sectionId) => ({
                url: `/sections/unpublish/${sectionId}`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Section', id }],
        }),
    }),
});

export const {
    useGetAllSectionsQuery,
    useGetSectionsByUserIdQuery,
    useGetSectionDetailQuery,
    useCreateSectionMutation,
    useUpdateSectionMutation,
    useDeleteSectionMutation,
    useReorderSectionsMutation,
    usePublishSectionMutation,
    useUnpublishSectionMutation,
} = sectionApi;
