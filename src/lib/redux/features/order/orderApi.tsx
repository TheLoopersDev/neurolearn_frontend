import { apiSlice } from '../api/apiSlice';

export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrders: builder.query({
            query: () => ({
                url: 'orders/get-orders',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        getOrder: builder.query({
            query: (orderId) => ({
                url: `orders/${orderId}`,
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        getStripePublishableKey: builder.query({
            query: () => ({
                url: 'orders/payment/stripepublishablekey',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        createPaymentIntent: builder.mutation({
            query: (amount: number) => ({
                url: 'orders/payment',
                method: 'POST',
                body: {
                    amount
                },
                credentials: 'include' as const
            })
        }),
        createOrder: builder.mutation({
            query: ({ courseIds, payment_info }) => ({
                url: 'orders/create-order',
                method: 'POST',
                body: {
                    courseIds,
                    payment_info
                },
                credentials: 'include' as const
            })
        })
    })
});

export const {
    useGetAllOrdersQuery,
    useCreatePaymentIntentMutation,
    useGetStripePublishableKeyQuery,
    useCreateOrderMutation,
    useGetOrderQuery
} = orderApi;
