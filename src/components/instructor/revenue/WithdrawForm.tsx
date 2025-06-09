'use client'

import React, { useState } from 'react';
import { TotalRevenueIcon } from '@/components/instructor/revenue/RevenueIcons';   
import { FiUpload } from "react-icons/fi";

interface WithdrawFormProps {
  totalRevenue: string;
  onWithdraw: (amount: string, reason: string) => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ totalRevenue, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    onWithdraw(amount, reason);
    setAmount('');
    setReason('');
  };

  return (
    <article className="bg-white rounded-3xl p-6">
      <div className="w-full">
        <header className="flex flex-wrap gap-6 items-end w-full">
          <div className="flex-1 min-w-[259px]">
            <div className="flex gap-3 items-center w-full text-3xl font-medium leading-none text-stone-950">
              <TotalRevenueIcon />
              <h1 className="text-stone-950">Total Revenue</h1>
            </div>
            <p className="mt-6 text-4xl font-semibold leading-tight text-blue-600">{totalRevenue}</p>
          </div>
          <button 
            onClick={handleSubmit}
            className="flex justify-center items-center py-3.5 px-14 text-2xl leading-none bg-slate-50 min-h-[60px] rounded-[40px] text-stone-950 hover:bg-slate-100 transition-colors"
          >
            <div className="flex gap-3 items-center">
              <FiUpload className="w-8 h-8" />
              <span>Withdraw</span>
            </div>
          </button>
        </header>

        <div className="mt-6 space-y-6">
          <div className="w-full">
            <label className="text-base font-semibold leading-none text-stone-950" htmlFor="amount">
              Amount (VND)
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full py-3 px-3 mt-2 text-xs font-medium leading-none rounded-xl bg-slate-50 text-zinc-500 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full">
            <label className="text-base font-semibold leading-none text-stone-950" htmlFor="reason">
              Reason (Optional)
            </label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
              className="w-full py-3 px-3 mt-2 text-xs font-medium leading-none rounded-xl bg-slate-50 text-zinc-500 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </article>
  );
};