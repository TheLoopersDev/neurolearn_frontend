'use client';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';
import authSlice from './features/auth/authSlice';
import { courseApi } from './features/course/courseApi';
import courseReducer from './features/course/courseSlice';
import { expertApi } from './features/expert/expertApi';
import { categoryApi } from './features/course/category/categoryApi';
import { levelApi } from './features/course/level/levelApi';
import { sectionApi } from './features/course/section/sectionApi';
import { lessonApi } from './features/course/section/lesson/lessonApi';
// import orderSlice from './features/order/orderSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [expertApi.reducerPath]: expertApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [levelApi.reducerPath]: levelApi.reducer,
        [sectionApi.reducerPath]: sectionApi.reducer,
        [lessonApi.reducerPath]: lessonApi.reducer,
        auth: authSlice,
        course: courseReducer,
        // order: orderSlice
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(courseApi.middleware)
            .concat(expertApi.middleware)
            .concat(categoryApi.middleware)
            .concat(levelApi.middleware)
            .concat(sectionApi.middleware)
            .concat(lessonApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// call the refresh token function every page load
const initializeApp = async () => {
    // await store.dispatch(apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }));
    await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }));
};

initializeApp();
