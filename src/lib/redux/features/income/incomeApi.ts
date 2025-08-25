import { apiSlice } from '../api/apiSlice';

type ChartData = { name: string; revenue: number };

type IncomeResponse = {
  success: boolean;
  monthlyChart: ChartData[];
  yearlyChart: ChartData[];
};

type TotalIncomeResponse = {
  success: boolean;
  income: number;
  message?: string;
};

// Updated detailed revenue response: maps to /revenue/detailed/me
type RevenueDetailedResponse = {
  success: boolean;
  data: {
    total: number;        // Total revenue from orders, never decreases
    submission: number;   // 10% of total, calculated runtime
    withdrawn: number;    // Total amount already withdrawn
    available: number;    // netIncome = total - (submission + withdrawn)
  };
  message?: string;
};

export const incomeApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getIncome: builder.query<IncomeResponse, string>({
      // userId là params
      query: userId => ({
        url: `income/${userId}/chart`,
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Income'],
    }),
    
    // Thêm endpoint mới để lấy total income
    getTotalIncome: builder.query<TotalIncomeResponse, void>({
      query: () => ({
        url: 'revenue/income/me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Income'],
    }),

    // New: detailed revenue for current user with withdrawn and available
    getRevenueDetailedMe: builder.query<RevenueDetailedResponse, void>({
      query: () => ({
        url: 'revenue/detailed/me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Income'],
    }),
  }),
});

export const { useGetIncomeQuery, useGetTotalIncomeQuery, useGetRevenueDetailedMeQuery } = incomeApi;
