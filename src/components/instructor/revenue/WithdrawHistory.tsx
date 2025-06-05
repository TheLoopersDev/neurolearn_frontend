import React from "react";

export default function WithdrawHistory() {
  return (
    <div className="flex flex-col gap-[24px] w-full">
      <div className="text-[24px] font-semibold">Withdraw History</div>
      <div className="bg-white p-[24px] rounded-[12px]">
        <div className="flex justify-between text-[#6a6a6a] text-[16px] font-medium">
          <span>Transaction Note</span>
          <span>Status</span>
        </div>
        <hr className="my-[12px]" />
        <div className="flex justify-between items-center text-[16px] font-semibold text-[#0d0d0d]">
          <span>Payment for course sales</span>
          <span className="bg-[#ff7410] text-white rounded-[40px] px-[24px] py-[6px]">Pending</span>
        </div>
      </div>
    </div>
  );
}