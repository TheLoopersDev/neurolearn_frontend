import React from 'react';
import { Plus } from 'lucide-react';
import { CreditCard } from '@/components/instructor/revenue/CreditCard';
import { CardInfo } from '@/components/instructor/revenue/CardInfo';
import { CardInfoProps } from '@/types/income';

interface CardSectionProps {
  cardData: CardInfoProps;
  onAddCard: () => void;
}

export const CardSection: React.FC<CardSectionProps> = ({ cardData, onAddCard }) => {
  return (
    <aside className="bg-white rounded-3xl p-6 min-h-[592px] w-[430px]">
      <div className="w-full">
        <header className="flex gap-10 justify-between items-center w-full">
          <h2 className="text-2xl font-semibold leading-none text-stone-950">My Card</h2>
          <button 
            onClick={onAddCard}
            className="flex gap-2 justify-center items-center px-3 py-1 text-base font-medium leading-none text-center text-blue-600 bg-slate-50 min-h-7 rounded-[40px] hover:bg-slate-100 transition-colors"
          >
            <Plus className="w-6 h-6 text-blue-600" />
            <span>Add Card</span>
          </button>
        </header>

        <div className="mt-3 w-full">
          <div className="relative w-full">
            <CreditCard {...cardData} />
          </div>

          {/* Card Pagination */}
          <div className="flex justify-center mt-3">
            <div className="flex gap-2 items-center">
              <div className="w-16 h-2 bg-blue-600 rounded-2xl"></div>
              <div className="w-2 h-2 bg-slate-50 rounded-2xl"></div>
              <div className="w-2 h-2 bg-slate-50 rounded-2xl"></div>
              <div className="w-2 h-2 bg-slate-50 rounded-2xl"></div>
            </div>
          </div>

          <CardInfo {...cardData} />
        </div>
      </div>
    </aside>
  );
};