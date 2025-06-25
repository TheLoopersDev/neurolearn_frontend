import React from 'react';
import { useGetWithdrawHistoryQuery } from '@/lib/redux/features/bank/bankApi';

export const TransactionHistory: React.FC = () => {
  const { data, isLoading } = useGetWithdrawHistoryQuery();
  const transactions = data?.data || [];

  return (
    <section className="mt-4 w-full">
      <h2 className="text-lg font-semibold leading-none text-stone-950">Withdraw History</h2>
      <div className="bg-white rounded-lg p-4 mt-3">
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-neutral-500 pb-3 border-b border-zinc-300">
            <div className="col-span-4">Transaction Note</div>
            <div className="col-span-2 text-center">Bank Name</div>
            <div className="col-span-2 text-center">Amount</div>
            <div className="col-span-2 text-center">Date</div>
            <div className="col-span-2 text-center">Status</div>
          </div>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-0 mt-2">
              {transactions.map((transaction, index) => (
                <div key={index}>
                  <div className="grid grid-cols-12 gap-4 items-center w-full text-sm py-4">
                    <div className="col-span-4 font-semibold text-stone-950">
                      {transaction.reason || 'No reason'}
                    </div>
                    <div className="col-span-2 font-semibold text-stone-950 text-center">
                      {transaction.bankName}
                    </div>
                    <div className="col-span-2 font-semibold text-stone-950 text-center">
                      {transaction.amount}
                    </div>
                    <div className="col-span-2 font-semibold text-stone-950 text-center">
                      {new Date(transaction.requestedAt).toLocaleString()}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span className={`inline-block py-2 px-4 font-medium text-white text-center rounded-full text-xs min-w-[80px] ${transaction.status === 'pending'
                        ? 'bg-orange-500'
                        : 'bg-teal-500'
                        }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                  {index < transactions.length - 1 && (
                    <hr className="border-t border-zinc-200" />
                  )}
                </div>
              ))}
              </div>
          )}
        </div>
      </div>
    </section>
  );
};