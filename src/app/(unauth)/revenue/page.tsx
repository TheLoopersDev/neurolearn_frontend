import React from "react";
import TotalRevenueCard from "@/components/instructor/revenue/TotalRevenueCard";
import WithdrawForm from "@/components/instructor/revenue/WithdrawForm";
import BalanceOverview from "@/components/instructor/revenue/BalanceOverview";
import MyCard from "@/components/instructor/revenue/MyCard";
import WithdrawHistory from "@/components/instructor/revenue/WithdrawHistory";

export default function Main() {
  return (
    <div className="main-container flex w-[1120px] flex-col gap-[24px] items-start relative mx-auto">
      <div className="flex gap-[24px] items-start w-full">
        <div className="flex flex-col gap-[24px] w-[648px]">
          <TotalRevenueCard />
          <WithdrawForm />
          <BalanceOverview />
        </div>
        <MyCard />
      </div>
      <WithdrawHistory />
    </div>
  );
}