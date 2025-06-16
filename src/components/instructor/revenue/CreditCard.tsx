import React from 'react';
import Image from 'next/image';
import { CardInfoProps } from '@/types/income';

interface CreditCardProps extends CardInfoProps {
  bankLogo?: string;
}

export const CreditCard: React.FC<CreditCardProps> = ({
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
          {bankLogo ? (
            <div className="relative h-6 w-20">
              <Image
                src={bankLogo}
                alt={bankName}
                fill
                className="object-contain"
                sizes="(max-width: 80px) 100vw, 80px"
              />
            </div>
          ) : (
              <div className="text-lg font-bold drop-shadow-md">{bankName}</div>
          )}

          {/* EMV Chip */}
          <div className="w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm flex items-center justify-center">
            <div className="w-5 h-2.5 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xs border border-yellow-700"></div>
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

          {/* Payment network - centered below */}
          <div className="col-span-2 text-center mt-1">
            <div className="text-sm font-bold inline-block px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm">
              NAPAS
            </div>
          </div>
        </div>
      </div>
      
      {/* Contactless payment icon */}
      <div className="absolute bottom-8 right-4 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
        <div className="flex flex-col gap-[2px]">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className={`h-[2px] bg-white rounded-full ${i === 0 ? 'w-2' : i === 1 ? 'w-3' : i === 2 ? 'w-4' : 'w-5'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};