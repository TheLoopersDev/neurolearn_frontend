import React from "react";

export default function BalanceOverview() {
  return (
    <div className="flex flex-col gap-[32px] p-6 bg-white">
      <div className="text-[28px] font-bold text-black">Balance Overview</div>
      
      <div className="flex gap-[32px] items-start">
        {/* Card 1 - Total Withdraw */}
        <div className="flex flex-col items-center gap-[16px]">
          <div className="w-[140px] h-[140px] bg-cover bg-center bg-no-repeat rounded-[20px]"
               style={{ backgroundImage: "url('/assets/revenue/total-withdraw.png')" }}>
          </div>
          <div className="text-center">
            <div className="text-[24px] font-bold text-blue-600 mb-[4px]">84.900 VND</div>
            <div className="text-[14px] text-gray-600">Total Withdraw</div>
          </div>
        </div>

        {/* Card 2 - Service Fee */}
        <div className="flex flex-col items-center gap-[16px]">
          <div className="w-[140px] h-[140px] bg-cover bg-center bg-no-repeat rounded-[20px]"
               style={{ backgroundImage: "url('/assets/revenue/service-fee.png')" }}>
          </div>
          <div className="text-center">
            <div className="text-[24px] font-bold text-blue-600 mb-[4px]">100.000 VND</div>
            <div className="text-[14px] text-gray-600">Service Fee</div>
          </div>
        </div>

        {/* Card 3 - Current Balance */}
        <div className="flex flex-col items-center gap-[16px]">
          <div className="w-[140px] h-[140px] bg-cover bg-center bg-no-repeat rounded-[20px]"
               style={{ backgroundImage: "url('/assets/revenue/current-balance.png')" }}>
          </div>
          <div className="text-center">
            <div className="text-[24px] font-bold text-blue-600 mb-[4px]">200.000 VND</div>
            <div className="text-[14px] text-gray-600">Current Balance</div>
          </div>
        </div>
      </div>
    </div>
  );
}