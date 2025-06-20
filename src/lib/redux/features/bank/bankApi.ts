import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BankInfo {
  bin: string;
  shortName: string;
  name: string;
  bankLogoUrl: string;
  isVietQr: boolean;
  isNapas: boolean;
  isDisburse: boolean;
}

export interface BankInfoResponse {
  success: boolean;
  data: Record<string, BankInfo>;
}

export const bankApi = createApi({
  reducerPath: 'bankApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  }),
  endpoints: (builder) => ({
    getBankInfo: builder.query<Record<string, BankInfo>, void>({
      query: () => 'credit-cards/bank-info',
      transformResponse: (response: BankInfoResponse) => response.data,
    }),
  }),
});

export const { useGetBankInfoQuery } = bankApi;