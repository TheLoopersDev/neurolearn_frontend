'use client';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';
import authSlice from './features/auth/authSlice';
import { courseApi } from './features/course/courseApi';
import courseReducer from './features/course/courseSlice';
import { expertApi } from './features/expert/expertApi';
import { bankApi } from './features/bank/bankApi';
import { chatApi } from './features/chat/chatApi';
import chatReducer from './features/chat/chatSlice';
// import orderSlice from './features/order/orderSlice';

// Create an array of all API middlewares
const apiMiddlewares = [
  apiSlice.middleware,
  courseApi.middleware,
  expertApi.middleware,
  bankApi.middleware
];

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [expertApi.reducerPath]: expertApi.reducer,
        [bankApi.reducerPath]: bankApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        auth: authSlice,
        course: courseReducer,
        chat: chatReducer,
        // order: orderSlice
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(...apiMiddlewares)
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(courseApi.middleware)
            .concat(expertApi.middleware)
            .concat(chatApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// call the refresh token function every page load
const initializeApp = async () => {
    // await store.dispatch(apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }));
    await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }));
};

initializeApp();
