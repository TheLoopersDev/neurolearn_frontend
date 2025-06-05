import React from "react";

export default function TotalRevenueCard() {
  return (
    <div className="flex gap-[12px] items-center bg-white p-[24px] rounded-[20px]">
      <div className="w-[52px] h-[52px] bg-[url('/assets/revenue/total-revenue.png')] bg-cover" />
      <div>
        <div className="text-[32px] font-medium text-[#0d0d0d]">Total Revenue</div>
        <div className="text-[40px] font-semibold text-[#3858f8]">350.000 VND</div>
      </div>
    </div>
  );
}