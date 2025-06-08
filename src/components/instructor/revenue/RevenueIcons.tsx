import React from 'react';

export const TotalRevenueIcon: React.FC = () => (
  <div className="w-[52px] h-[52px] rounded-lg flex items-center justify-center">
    <img 
      src="/assets/revenue/total-revenue.png" 
      alt="Total Revenue" 
      className="w-[52px] h-[52px] object-contain"
    />
  </div>
);

export const TotalWithdrawIcon: React.FC = () => (
  <div className="w-[52px] h-[52px] rounded-lg flex items-center justify-center">
    <img 
      src="/assets/revenue/total-withdraw.png" 
      alt="Total Withdraw" 
      className="w-[52px] h-[52px] object-contain"
    />
  </div>
);

export const ServiceFeeIcon: React.FC = () => (
  <div className="w-[52px] h-[52px] rounded-lg flex items-center justify-center">
    <img 
      src="/assets/revenue/service-fee.png" 
      alt="Service Fee" 
      className="w-[52px] h-[52px] object-contain"
    />
  </div>
);

export const CurrentBalanceIcon: React.FC = () => (
    <div className="w-[52px] h-[52px] rounded-lg flex items-center justify-center">
      <img 
        src="/assets/revenue/current-balance.png" 
        alt="Current Balance" 
        className="w-[52px] h-[52px] object-contain"
      />
    </div>
  );