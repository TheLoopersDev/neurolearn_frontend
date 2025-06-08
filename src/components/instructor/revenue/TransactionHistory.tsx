import React from 'react';
import { Transaction } from '@/types/income';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <section className="mt-6 w-full">
      <h2 className="text-2xl font-semibold leading-none text-stone-950">Withdraw History</h2>
      <div className="bg-white rounded-xl p-6 mt-6">
        <div className="w-full">
          {/* Table Header */}
          <div className="flex items-center text-base font-medium text-neutral-500 pb-6 border-b-2 border-zinc-300">
            <div className="flex-1">Transaction Note</div>
            <div className="w-28">Transaction</div>
            <div className="w-28">Total Price</div>
            <div className="w-28">Date</div>
            <div className="w-32">Status</div>
          </div>

          {/* Transaction Rows */}
          <div className="space-y-3 mt-3">
            {transactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-center w-full text-base py-3">
                  <div className="flex-1 font-semibold text-stone-950 pr-4">
                    {transaction.note}
                  </div>
                  <div className="w-28 font-semibold text-stone-950">
                    {transaction.bank}
                  </div>
                  <div className="w-28 font-semibold text-stone-950">
                    {transaction.amount}
                  </div>
                  <div className="w-28 font-semibold text-stone-950">
                    {transaction.date}
                  </div>
                  <div className="w-32">
                    <span className={`inline-block py-2.5 px-4 font-medium text-white text-center rounded-[40px] text-sm ${
                      transaction.status === 'Pending' 
                        ? 'bg-orange-500' 
                        : 'bg-teal-500'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
                {index < transactions.length - 1 && (
                  <hr className="border-t-2 border-zinc-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
