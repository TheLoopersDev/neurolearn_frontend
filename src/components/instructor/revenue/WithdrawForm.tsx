'use client'

import React, { useState } from 'react';
import { TotalRevenueIcon } from '@/components/instructor/revenue/RevenueIcons';   
import { FiUpload } from "react-icons/fi";
import { useWithDrawApiMutation } from '@/lib/redux/features/bank/bankApi';

interface WithdrawFormProps {
  totalRevenue: string;
  onWithdraw: (amount: string, reason: string) => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ totalRevenue, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [withdraw, { isLoading }] = useWithDrawApiMutation();

  const handleSubmit = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    try {
      const result = await withdraw({ amount: Number(amount), reason: reason || undefined }).unwrap();
      if (result.success) {
        alert('Withdrawal request sent successfully!');
        setAmount('');
        setReason('');
      } else {
        alert(result.message || 'Withdrawal failed.');
      }
    } catch (error: any) {
      alert(error?.data || 'Withdrawal failed.');
    }
  };

  return (
    <article className="bg-white rounded-2xl p-4">
      <div className="w-full">
        <header className="flex flex-wrap gap-4 items-end w-full">
          <div className="flex-1 min-w-[200px]">
            <div className="flex gap-2 items-center w-full text-xl font-medium leading-none text-stone-950">
              <TotalRevenueIcon />
              <h1 className="text-2xl font-semibold leading-none text-stone-950">Total Revenue</h1>
            </div>
            <p className="mt-3 text-2xl font-semibold leading-tight text-blue-600">{totalRevenue}</p>
          </div>
          <button
            onClick={handleSubmit}
            className="flex justify-center items-center py-2 px-8 text-lg leading-none bg-slate-50 min-h-[40px] rounded-[30px] text-stone-950 hover:bg-slate-100 transition-colors"
            disabled={isLoading}
          >
            <div className="flex gap-2 items-center">
              <FiUpload className="w-5 h-5" />
              <span>Withdraw</span>
            </div>
          </button>
        </header>

        <div className="mt-4 space-y-4">
          <div className="w-full">
            <label className="text-sm font-semibold leading-none text-stone-950" htmlFor="amount">
              Amount (VND)
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full min-h-[60px] py-2 px-3 mt-1 text-base font-medium leading-none rounded-lg bg-slate-50 text-zinc-500 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-semibold leading-none text-stone-950" htmlFor="reason">
              Reason (Optional)
            </label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
              className="w-full min-h-[60px] py-2 px-3 mt-1 text-base font-medium leading-none rounded-lg bg-slate-50 text-zinc-500 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </article>
  );
};