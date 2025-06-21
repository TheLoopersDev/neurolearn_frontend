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
    getBankInfo: builder.query<any, void>({
      query: () => '/credit-cards/bank-info',
      transformResponse: (response: any) => {
        if (response && response.data && Array.isArray(response.data.data)) {
          const mappedBanks = response.data.data.map((bank: any) => ({
            ...bank,
            bankLogoUrl: bank.logo,
          }));
          return {
            code: response.data.code,
            desc: response.data.desc,
            data: mappedBanks,
          };
        }
        if (response && Array.isArray(response.data)) return response;
        if (response && Array.isArray(response.banks)) {
          return {
            code: '00',
            desc: '',
            data: response.banks,
          };
        }
        return { code: '', desc: '', data: [] };
      },
    }),
  }),
});

export const { useGetBankInfoQuery } = bankApi;