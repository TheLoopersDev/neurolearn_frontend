'use client';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';
import authSlice from './features/auth/authSlice';
import { courseApi } from './features/course/courseApi';
import courseReducer from './features/course/courseSlice';
import { expertApi } from './features/expert/expertApi';
// import orderSlice from './features/order/orderSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [expertApi.reducerPath]: expertApi.reducer,
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
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// call the refresh token function every page load
const initializeApp = async () => {
    // await store.dispatch(apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }));
    await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }));
};

initializeApp();
