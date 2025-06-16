import React from 'react';
import { TotalWithdrawIcon, ServiceFeeIcon, CurrentBalanceIcon } from '@/components/instructor/revenue/RevenueIcons';
import { BalanceOverviewProps } from '@/types/income';

export const BalanceOverview: React.FC<BalanceOverviewProps> = ({
  totalWithdraw,
  serviceFee,
  currentBalance
}) => {
  return (
    <section className="mt-9 w-full">
      <h2 className="text-lg font-semibold leading-none text-stone-950">Balance Overview</h2>
      <div className="flex flex-wrap gap-3 items-center mt-5 w-full">
        <article className="flex flex-col justify-center bg-white border border-gray-200 rounded-xl py-3 px-3 min-h-24 w-[180px]">
          <div className="w-full">
            <TotalWithdrawIcon />
            <div className="mt-3 w-full">
              <p className="text-lg font-semibold leading-none text-blue-600">{totalWithdraw}</p>
              <p className="mt-3 text-sm font-medium leading-none text-neutral-500">Total Withdraw</p>
            </div>
          </div>
        </article>

        <article className="flex flex-col justify-center bg-white border border-gray-200 rounded-xl py-3 px-3 min-h-24 w-[180px]">
          <div className="w-full">
            <ServiceFeeIcon />
            <div className="mt-3 w-full">
              <p className="text-lg font-semibold leading-none text-blue-600">{serviceFee}</p>
              <p className="mt-3 text-sm font-medium leading-none text-neutral-500">Service Fee</p>
            </div>
          </div>
        </article>

        <article className="flex flex-col justify-center bg-white border border-gray-200 rounded-xl py-3 px-3 min-h-24 w-[180px]">
          <div className="w-full">
            <CurrentBalanceIcon />
            <div className="mt-3 w-full">
              <p className="text-lg font-semibold leading-none text-blue-600">{currentBalance}</p>
              <p className="mt-3 text-sm font-medium leading-none text-neutral-500">Current Balance</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};