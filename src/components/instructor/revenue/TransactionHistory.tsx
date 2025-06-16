import React from 'react';
import { Transaction } from '@/types/income';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <section className="mt-4 w-full">
      <h2 className="text-lg font-semibold leading-none text-stone-950">Withdraw History</h2>
      <div className="bg-white rounded-lg p-4 mt-3">
        <div className="w-full">
          {/* Table Header */}
          <div className="flex items-center text-sm font-medium text-neutral-500 pb-3 border-b border-zinc-300">
            <div className="flex-1">Transaction Note</div>
            <div className="w-20">Transaction</div>
            <div className="w-20">Total Price</div>
            <div className="w-20">Date</div>
            <div className="w-24">Status</div>
          </div>

          {/* Transaction Rows */}
          <div className="space-y-2 mt-2">
            {transactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-center w-full text-sm py-2">
                  <div className="flex-1 font-semibold text-stone-950 pr-3">
                    {transaction.note}
                  </div>
                  <div className="w-20 font-semibold text-stone-950">
                    {transaction.bank}
                  </div>
                  <div className="w-20 font-semibold text-stone-950">
                    {transaction.amount}
                  </div>
                  <div className="w-20 font-semibold text-stone-950">
                    {transaction.date}
                  </div>
                  <div className="w-24">
                    <span className={`inline-block py-1.5 px-3 font-medium text-white text-center rounded-[30px] text-xs ${transaction.status === 'Pending'
                      ? 'bg-orange-500'
                        : 'bg-teal-500'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
                {index < transactions.length - 1 && (
                  <hr className="border-t border-zinc-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
