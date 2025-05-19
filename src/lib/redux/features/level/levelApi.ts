import { apiSlice } from '../api/apiSlice';

export const levelApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLevels: builder.query({
            query: () => ({
                url: 'level',
                method: 'GET',
                credentials: 'include' as const
            })
        })
    })
});

export const { useGetLevelsQuery } = levelApi;
