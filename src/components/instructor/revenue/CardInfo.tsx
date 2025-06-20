import React from 'react';
import { Copy } from 'lucide-react';
import { CardInfoProps } from '@/types/income';

export const CardInfo: React.FC<CardInfoProps> = ({
  bankName,
  cardHolder,
  cardNumber,
  cvv
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="mt-6 w-full">
      <h3 className="text-2xl font-semibold leading-none text-stone-950">Card Information</h3>
      <div className="bg-white rounded-xl shadow-md p-5 mt-3">
        <div className="w-full space-y-6">
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <p className="text-xs font-medium leading-none text-neutral-500">Bank</p>
              <p className="mt-2 text-base font-semibold leading-none text-black">{bankName}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium leading-none text-neutral-500">Card name</p>
              <p className="mt-2 text-base font-semibold leading-none text-black">{cardHolder}</p>
            </div>
          </div>
          
          <div className="flex gap-6 items-end">
            <div className="flex-1">
              <p className="text-xs font-medium leading-none text-neutral-500">Card number</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-base font-semibold leading-none text-black">{cardNumber}</p>
                <button 
                  onClick={() => copyToClipboard('123123123123456')}
                  className="flex items-center gap-1 py-1 px-2 text-xs font-medium text-blue-600 bg-white rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <div>
                <p className="text-xs font-medium leading-none text-neutral-500">CVV</p>
                <p className="mt-2 text-base font-semibold leading-none text-black">{cvv}</p>
              </div>
              <button 
                onClick={() => copyToClipboard('123')}
                className="flex items-center gap-1 py-1 px-2 text-xs font-medium text-blue-600 bg-white rounded border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
