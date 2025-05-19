import { apiSlice } from '../api/apiSlice';

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourseContent: builder.query({
            query: (id) => ({
                url: `courses/purchased/${id}`,
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        getUploadedCourseByInstructor: builder.query({
            query: (id) => ({
                url: `courses/uploaded/${id}`,
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        createCourse: builder.mutation({
            query: (data) => ({
                url: 'courses/create-course',
                method: 'POST',
                body: data,
                credentials: 'include' as const
            })
        }),
        updateCourse: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/update-course/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `courses/delete-course/${id}`,
                method: 'DELETE',
                credentials: 'include' as const
            })
        }),
        publishCourse: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/publish-course/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        unpublishCourse: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/unpublish-course/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        reorderSection: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/reorder-section/${id}`,
                method: 'PUT',
                body: data.data,
                credentials: 'include' as const
            })
        }),
        createSection: builder.mutation({
            query: ({ id, title }) => ({
                url: `courses/create-section/${id}`,
                method: 'PUT',
                body: { title },
                credentials: 'include' as const
            })
        }),
        updateSection: builder.mutation({
            query: ({ id, oldTitle, title }) => ({
                url: `courses/update-section/${id}`,
                method: 'PUT',
                body: { oldTitle, title },
                credentials: 'include' as const
            })
        }),
        addLesson: builder.mutation({
            query: ({ id, videoSection, title }) => ({
                url: `courses/create-lesson/${id}`,
                method: 'PUT',
                body: { videoSection, title },
                credentials: 'include' as const
            })
        }),
        reorderLesson: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/reorder-lesson/${id}`,
                method: 'PUT',
                body: data.data,
                credentials: 'include' as const
            })
        }),
        updateLesson: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/update-lesson/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        deleteLesson: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/delete-lesson/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        publishLesson: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/publish-lesson/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        unpublishLesson: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/unpublish-lesson/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        publishSection: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/publish-section/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        unpublishSection: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/unpublish-section/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        deleteSection: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/delete-section/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        addNewQuestion: builder.mutation({
            query: ({ question, contentId, courseId }) => ({
                url: 'courses/add-question',
                method: 'PUT',
                body: { question, contentId, courseId },
                credentials: 'include' as const
            })
        }),
        addAnswerInQuestion: builder.mutation({
            query: ({ answer, questionId, contentId, courseId }) => ({
                url: 'courses/add-answer',
                method: 'PUT',
                body: { answer, questionId, contentId, courseId },
                credentials: 'include' as const
            })
        }),
        addReviewInCourse: builder.mutation({
            query: ({ review, rating, courseId }) => ({
                url: `courses/add-review/${courseId}`,
                method: 'PUT',
                body: { review, rating },
                credentials: 'include' as const
            })
        }),
        addReplyInReview: builder.mutation({
            query: ({ comment, courseId, reviewId }) => ({
                url: `courses/add-reply`,
                method: 'PUT',
                body: { comment, courseId, reviewId },
                credentials: 'include' as const
            })
        }),
        getCourseStats: builder.query({
            query: () => ({
                url: `courses/instructor/all`,
                method: 'GET',
                credentials: 'include' as const
            })
        })
    })
});

export const {
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useAddNewQuestionMutation,
    useGetCourseContentQuery,
    useAddAnswerInQuestionMutation,
    useAddReviewInCourseMutation,
    useAddReplyInReviewMutation,
    useGetUploadedCourseByInstructorQuery,
    useCreateSectionMutation,
    useReorderSectionMutation,
    useUpdateSectionMutation,
    useAddLessonMutation,
    useReorderLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    usePublishLessonMutation,
    useUnpublishLessonMutation,
    usePublishSectionMutation,
    useUnpublishSectionMutation,
    useDeleteSectionMutation,
    usePublishCourseMutation,
    useUnpublishCourseMutation,
    useDeleteCourseMutation,
    useGetCourseStatsQuery
} = courseApi;
