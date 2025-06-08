import React from 'react';
import { CardInfoProps } from '@/types/income';

interface CreditCardProps extends CardInfoProps {}

export const CreditCard: React.FC<CreditCardProps> = ({
  bankName,
  cardHolder,
  cardNumber,
  expiryDate
}) => {
  // Format card number with spaces (xxxx xxxx xxxx xxxx)
  const formatCardNumber = (number: string) => {
    return number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="w-full h-[242px] bg-[url('/assets/revenue/custom-card.png')] bg-cover bg-center bg-no-repeat rounded-2xl p-5 shadow-lg text-white relative">
      
      {/* Top row - Bank name and chip + contactless */}
      <div className="flex justify-between items-start mb-8">
        <div className="text-lg font-semibold uppercase tracking-wide">
          {bankName}
        </div>
        <div className="flex items-center gap-4">
          {/* EMV Chip */}
          <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md shadow-md relative">
            <div className="absolute inset-0.5 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-4 border border-yellow-700 rounded-xs bg-yellow-200"></div>
              </div>
            </div>
          </div>
          {/* Contactless symbol */}
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-0.5 bg-white rounded-full opacity-80"></div>
            <div className="w-5 h-0.5 bg-white rounded-full opacity-80"></div>
            <div className="w-6 h-0.5 bg-white rounded-full opacity-80"></div>
            <div className="w-7 h-0.5 bg-white rounded-full opacity-80"></div>
          </div>
        </div>
      </div>

      {/* Card number - large and prominent */}
      <div className="mb-6">
        <div className="text-2xl font-mono font-semibold tracking-widest">
          {formatCardNumber(cardNumber)}
        </div>
        {/* Small number below first 4 digits */}
        <div className="text-sm font-mono mt-1 opacity-80">
          {cardNumber.slice(0, 4)}
        </div>
      </div>

      {/* Bottom row - Cardholder, expiry, and logo */}
      <div className="flex justify-between items-end">
        <div className="flex gap-8">
          {/* Cardholder name */}
          <div>
            <div className="text-xs opacity-80 mb-1 uppercase tracking-wide">
              Card Holder Name
            </div>
            <div className="text-base font-semibold uppercase tracking-wide">
              {cardHolder}
            </div>
          </div>
          
          {/* Expiry date */}
          <div>
            <div className="text-xs opacity-80 mb-1 uppercase tracking-wide flex flex-col leading-tight">
              <span>Month/Year</span>
              <span>Good Thru</span>
            </div>
            <div className="text-base font-mono font-semibold">
              {expiryDate}
            </div>
          </div>
        </div>
        
        {/* Payment network logo placeholder */}
        <div className="text-right">
          <div className="text-lg font-bold tracking-wider">
            NAPAS
          </div>
        </div>
      </div>
    </div>
  );
};