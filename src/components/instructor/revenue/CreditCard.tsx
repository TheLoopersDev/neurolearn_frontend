import React from 'react';
import Image from 'next/image';
import { CardInfoProps } from '@/types/income';
import { useGetMyCreditCardQuery, useGetBankInfoQuery } from '@/lib/redux/features/bank/bankApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

interface CreditCardProps extends CardInfoProps {
  bankLogo?: string;
}

const CreditCardUI: React.FC<CreditCardProps> = ({
  bankName,
  bankLogo,
  cardHolder,
  cardNumber,
  expiryDate 
}) => {
  return (
    <div className="w-full max-w-[340px] h-[200px] rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
      {/* Background - Blue gradient like MB Bank card */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col p-5 text-white">
        {/* Top row: Bank name on left, contactless icon on right */}
        <div className="flex justify-between items-start mb-4">
          {/* Bank name */}
          <div className="text-xl font-bold drop-shadow-sm">{bankName}</div>

          {/* Contactless payment icon - positioned at top right */}
          <div className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center">
            <div className="flex flex-col gap-[1px]">
              <div className="h-[1px] bg-white/80 rounded-full w-2"></div>
              <div className="h-[1px] bg-white/80 rounded-full w-3"></div>
              <div className="h-[1px] bg-white/80 rounded-full w-4"></div>
            </div>
          </div>
        </div>

        {/* Bank logo - positioned below bank name */}
        {bankLogo && (
          <div className="mb-6">
            <div className="relative h-10 w-20">
              <Image
                src={bankLogo}
                alt={bankName}
                fill
                className="object-contain object-left"
                sizes="(max-width: 80px) 100vw, 80px"
              />
            </div>
          </div>
        )}

        {/* Card number - positioned in middle */}
        <div className="flex-grow flex items-center">
          <div className="text-lg font-mono tracking-[0.2em] font-medium drop-shadow-sm">
            {cardNumber}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-end">
          {/* Card holder */}
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider opacity-90 mb-1 font-medium">
              {cardHolder}
            </div>
          </div>

          {/* Expiry date */}
          <div className="text-right">
            <div className="text-sm font-mono font-medium">
              {expiryDate}
            </div>
          </div>
        </div>

        {/* Payment network - Mastercard logo positioned at bottom right */}
        <div className="absolute bottom-4 right-5">
          <div className="flex">
            <div className="w-7 h-7 rounded-full bg-red-500"></div>
            <div className="w-7 h-7 rounded-full bg-orange-400 -ml-3"></div>
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

  // Fetch bank info để map shortName thành fullName và lấy logo
  const { data: bankInfoData } = useGetBankInfoQuery();

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-[340px] h-[200px] rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show no card state - hiển thị UI thân thiện khi chưa có card
  if (error || !creditCardData?.data) {
    return (
      <div className="w-full max-w-[340px] h-[200px] rounded-2xl overflow-hidden shadow-lg relative bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300">
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-gray-500">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-1">No Card Added</p>
            <p className="text-xs text-gray-500">Add your first card to get started</p>
          </div>
        </div>
      </div>
    );
  }

  const card = creditCardData.data;

  // Format card number for display (show all digits as provided by API)
  const formattedCardNumber = card.accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

  // Lấy logo từ bank info nếu có
  const getBankLogo = (shortName: string): string | undefined => {
    if (!bankInfoData?.data) return undefined;

    const bank = bankInfoData.data.find(b => b.shortName === shortName);
    return bank ? bank.bankLogoUrl : undefined;
  };

  // Use the UI component with real data - hiển thị shortName trực tiếp
  return (
    <CreditCardUI
      bankName={card.cardType} // Hiển thị shortName trực tiếp
      bankLogo={getBankLogo(card.cardType)}
      cardHolder={card.name}
      cardNumber={formattedCardNumber}
      cvv="***"
      expiryDate="12/28"
    />
  );
};