import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CreditCard,
  BankInfo,
  BankInfoApiResponse,
  BankInfoResponse,
  AlternativeBankResponse,
  BanksArrayResponse
} from '@/types/creditCard';

interface RootState {
  auth: {
    token: string;
    user: string;
    isLoggingOut: boolean;
  };
}

export const bankApi = createApi({
  reducerPath: 'bankApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    credentials: 'include' as const,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['CreditCard'],
  endpoints: (builder) => ({
    getBankInfo: builder.query<BankInfoResponse, void>({
      query: () => '/credit-cards/bank-info',
      transformResponse: (response: BankInfoApiResponse | AlternativeBankResponse | BanksArrayResponse): BankInfoResponse => {
        // Handle main API response format
        if ('success' in response && response.data && 'data' in response.data && Array.isArray(response.data.data)) {
          const mappedBanks: BankInfo[] = response.data.data.map((bank) => ({
            bin: bank.bin,
            shortName: bank.shortName,
            name: bank.name,
            bankLogoUrl: bank.logo, // Map 'logo' to 'bankLogoUrl'
            isVietQr: bank.isVietQr,
            isNapas: bank.isNapas,
            isDisburse: bank.isDisburse,
          }));
          
          return {
            code: response.data.code,
            desc: response.data.desc,
            data: mappedBanks,
          };
        }
        
        // Handle direct data array format
        if ('data' in response && Array.isArray(response.data)) {
          return {
            code: '00',
            desc: 'Success',
            data: response.data,
          };
        }
        
        // Handle banks array format
        if ('banks' in response && Array.isArray(response.banks)) {
          return {
            code: '00',
            desc: 'Success',
            data: response.banks,
          };
        }
        
        // Fallback for unknown format
        return {
          code: 'ERROR',
          desc: 'Unknown response format',
          data: [],
        };
      },
    }),
    
    // Nếu bạn cần endpoint cho credit cards
    getCreditCards: builder.query<CreditCard[], void>({
      query: () => '/credit-cards',
    }),

    // Lấy thông tin credit card của user hiện tại
    getMyCreditCard: builder.query<
      { success: boolean; data: CreditCard },
      void
    >({
      query: () => '/credit-cards/me',
      providesTags: ['CreditCard'],
    }),
    
    // Thêm credit card
    addCreditCard: builder.mutation<
      { success: boolean; message: string; data: CreditCard },
      { name: string; accountNumber: string; cardType: string }
    >({
      query: (creditCard) => ({
        url: '/credit-cards',
        method: 'POST',
        body: creditCard,
      }),
      invalidatesTags: ['CreditCard'],
    }),
    
    // Cập nhật credit card
    updateCreditCard: builder.mutation<CreditCard, { id: string; updates: Partial<Omit<CreditCard, '_id' | 'createdAt' | 'updatedAt'>> }>({
      query: ({ id, updates }) => ({
        url: `/credit-cards/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    
    // Xóa credit card - sử dụng token trong header thay vì ID
    deleteCreditCard: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/credit-cards',
        method: 'DELETE',
      }),
      invalidatesTags: ['CreditCard'],
    }),

    // Rút tiền từ tài khoản ngân hàng
    withDrawApi: builder.mutation<
      { success: boolean; message: string },
      { amount: number; reason?: string }
    >({
      async queryFn(arg, api, extraOptions, baseQuery) {
        const creditCardResult = await baseQuery({ url: '/credit-cards/me', method: 'GET' }) as { data?: { success: boolean; data: CreditCard } };
        if (!creditCardResult.data || !creditCardResult.data.success) {
          return { error: { status: 400, data: 'Cannot get bank card info' } };
        }
        const creditCard = creditCardResult.data.data;
        const { amount, reason } = arg;
        const body: any = {
          bankName: creditCard.cardType,
          bankAccountNumber: creditCard.accountNumber,
          bankAccountName: creditCard.name,
          amount,
        };
        if (reason) body.reason = reason;
        const withdrawResult = await baseQuery({
          url: '/withdraw',
          method: 'POST',
          body,
        }) as { data?: { success: boolean; message: string } };
        if (withdrawResult.data) {
          return { data: withdrawResult.data };
        } else {
          return { error: { status: 400, data: 'Withdraw failed' } };
        }
      },
    }),

    // Lấy lịch sử rút tiền
    getWithdrawHistory: builder.query<
      { success: boolean; data: Array<{
        bankName: string;
        bankAccountNumber: string;
        bankAccountName: string;
        amount: number;
        status: string;
        reason?: string;
        requestedAt: string;
      }> },
      void
    >({
      query: () => '/withdraw',
    }),
  }),
});

export const {
  useGetBankInfoQuery,
  useGetCreditCardsQuery,
  useGetMyCreditCardQuery,
  useAddCreditCardMutation,
  useUpdateCreditCardMutation,
  useDeleteCreditCardMutation,
  useWithDrawApiMutation,
  useGetWithdrawHistoryQuery,
} = bankApi;