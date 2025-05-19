import { apiSlice } from '../api/apiSlice';

export const incomeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getInstructorIncome: builder.query({
            query: (userId) => ({
                url: `/income/${userId}`,
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        getAllWithdrawRequests: builder.query({
            query: () => ({
                url: `/income/withdraw/all`,
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        createWithdrawRequest: builder.mutation({
            query: (data) => ({
                url: 'income/create-withdraw-request',
                method: 'POST',
                body: data,
                credentials: 'include' as const
            })
        }),
        rejectWithdrawRequest: builder.mutation({
            query: (data) => ({
                url: 'income/withdraw/reject',
                method: 'PUT',
                body: data,
                credentials: 'include' as const
            })
        }),
        transferWithdrawMoney: builder.mutation({
            query: (data) => ({
                url: 'income/withdraw/transfer',
                method: 'PUT',
                body: data,
                credentials: 'include' as const
            })
        }),
        createTransaction: builder.mutation({
            query: (data) => ({
                url: 'income/withdraw/approve',
                method: 'PUT',
                body: data,
                credentials: 'include' as const
            })
        })
    })
});

export const {
    useGetInstructorIncomeQuery,
    useCreateWithdrawRequestMutation,
    useGetAllWithdrawRequestsQuery,
    useRejectWithdrawRequestMutation,
    useCreateTransactionMutation,
    useTransferWithdrawMoneyMutation
} = incomeApi;
