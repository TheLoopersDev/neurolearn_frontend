import React from "react";

export default function WithdrawForm() {
  return (
    <div className="bg-white rounded-[20px] p-[24px] flex flex-col gap-[24px]">
      <div>
        <div className="text-[16px] font-semibold mb-[8px]">Amount (VND)</div>
        <div className="bg-[#f7f8fa] rounded-[12px] p-[12px] text-[12px] text-[#808080]">Enter amount</div>
      </div>
      <div>
        <div className="text-[16px] font-semibold mb-[8px]">Reason (Optional)</div>
        <div className="bg-[#f7f8fa] rounded-[12px] p-[12px] text-[12px] text-[#808080]">Enter reason</div>
      </div>
    </div>
  );
}