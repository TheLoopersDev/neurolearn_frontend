import React from 'react';
import Image from 'next/image';
import { CardInfoProps } from '@/types/income';
import { useGetMyCreditCardQuery } from '@/lib/redux/features/bank/bankApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

interface CreditCardProps extends CardInfoProps {
  bankLogo?: string;
}

// UI Component - keeps the existing beautiful design
const CreditCardUI: React.FC<CreditCardProps> = ({
  bankName = 'MB Bank',
  bankLogo,
  cardHolder = 'DAO TUAN K',
  cardNumber = '1231 2312 3123 456',
  expiryDate = '12/28'
}) => {
  return (
    <div className="w-full max-w-[340px] h-[200px] rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-[url('/assets/revenue/custom-card.png')] bg-cover bg-center"
        style={{
          filter: 'brightness(0.9) contrast(1.1)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-blue-900/30"></div>
      </div>
      
      {/* Glossy reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none"></div>
      
      {/* Holographic security strip */}
      <div className="absolute top-5 w-full h-8 bg-gradient-to-r from-transparent via-white/40 to-transparent transform rotate-3"></div>
      
      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col p-4 text-white">
        {/* Bank logo/name top row */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {/* Bank name text */}
            <div className="text-lg font-bold drop-shadow-md">{bankName}</div>

            {/* Bank logo */}
            {bankLogo && (
              <div className="relative h-8 w-16">
                <Image
                  src={bankLogo}
                  alt={bankName}
                  fill
                  className="object-contain"
                  sizes="(max-width: 64px) 100vw, 64px"
                />
              </div>
            )}
          </div>

          {/* Contactless payment icon */}
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <div className="flex flex-col gap-[1px]">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-[1.5px] bg-white rounded-full ${i === 0 ? 'w-2' : i === 1 ? 'w-3' : i === 2 ? 'w-4' : 'w-5'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Centered card number */}
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl font-mono tracking-widest text-center font-medium drop-shadow-lg">
            {cardNumber}
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card holder */}
          <div>
            <div className="text-[10px] uppercase tracking-wider opacity-85 mb-1">CARD HOLDER</div>
            <div className="text-xs font-bold uppercase tracking-wider truncate">
              {cardHolder}
            </div>
          </div>

          {/* Expiry date */}
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider opacity-85 mb-1">VALID THRU</div>
            <div className="text-xs font-mono font-medium">
              {expiryDate}
            </div>
          </div>

          {/* Payment network - Mastercard logo */}
          <div className="col-span-2 flex justify-end mt-1">
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              <div className="w-6 h-6 rounded-full bg-yellow-500 -ml-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Data-connected component that fetches from API
export const CreditCard: React.FC = () => {
  // Get auth state to check if user is logged in
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch user's credit card info
  const {
    data: creditCardData,
    isLoading,
    error
  } = useGetMyCreditCardQuery(undefined, {
    // Only fetch if user is authenticated
    skip: !user || (typeof user === 'object' && !(user as { _id?: string })?._id)
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-[340px] h-[200px] rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show no card state (both error and no data should show the same friendly UI)
  if (error || !creditCardData?.data) {
    return null; // Don't show anything when no card exists
  }

  const card = creditCardData.data;

  // Format card number for display (show all digits as provided by API)
  const formattedCardNumber = card.accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

  // Use the UI component with real data
  return (
    <CreditCardUI
      bankName={card.cardType}
      cardHolder={card.name}
      cardNumber={formattedCardNumber}
      cvv="***" 
      expiryDate="12/28" 
    />
  );
};