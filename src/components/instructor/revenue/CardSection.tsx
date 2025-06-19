import React from 'react';
import { Plus } from 'lucide-react';
import { CreditCard } from '@/components/instructor/revenue/CreditCard';
import { CardInfo } from '@/components/instructor/revenue/CardInfo';
import { CardInfoProps } from '@/types/income';
import { useModal } from '@/context/ModalContext';

interface CardSectionProps {
  cardData: CardInfoProps;
}

export const CardSection: React.FC<CardSectionProps> = ({ cardData }) => {
  const { showModal } = useModal();
  return (
    <aside className="bg-white rounded-2xl p-4 min-h-[480px] w-[360px]">
      <div className="w-full">
        <header className="flex gap-6 justify-between items-center w-full">
          <h2 className="text-lg font-semibold leading-none text-stone-950">My Card</h2>
          <button
            onClick={() => showModal('addBankCard')}
            className="flex gap-1 justify-center items-center px-2 py-1 text-sm font-medium leading-none text-center text-blue-600 bg-slate-50 min-h-6 rounded-[30px] hover:bg-slate-100 transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Add Card</span>
          </button>
        </header>

        <div className="mt-2 w-full">
          <div className="relative w-full">
            <CreditCard {...cardData} />
          </div>

          {/* Card Pagination */}
          <div className="flex justify-center mt-2">
            <div className="flex gap-1 items-center">
              <div className="w-8 h-1.5 bg-blue-600 rounded-xl"></div>
              <div className="w-1.5 h-1.5 bg-slate-50 rounded-xl"></div>
              <div className="w-1.5 h-1.5 bg-slate-50 rounded-xl"></div>
              <div className="w-1.5 h-1.5 bg-slate-50 rounded-xl"></div>
            </div>
          </div>

          <CardInfo {...cardData} />
        </div>
      </div>
    </aside>
  );
};