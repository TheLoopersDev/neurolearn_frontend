import React from "react";
import { Plus } from "lucide-react";

export default function MyCard() {
  return (
    <div className="w-[448px] bg-white rounded-[20px] p-[24px]">
      <div className="flex justify-between items-center mb-[12px]">
        <div className="text-[24px] font-semibold">My Card</div>
        <div className="bg-[#f7f8fa] rounded-[40px] px-[12px] py-[4px] flex items-center gap-[8px]">
          <Plus 
            className="w-[26px] h-[26px] text-[#3858f8]" 
          />
          <span className="text-[#3858f8] text-[16px]">Add Card</span>
        </div>
      </div>
      {/* Card preview & info here (rút gọn lại hoặc modular nếu cần) */}
      <div className="text-[16px] text-[#6a6a6a]">Card content here...</div>
    </div>
  );
}