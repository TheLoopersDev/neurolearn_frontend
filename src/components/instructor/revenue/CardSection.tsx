import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CreditCard } from '@/components/instructor/revenue/CreditCard';
import { CardInfo } from '@/components/instructor/revenue/CardInfo';
import { useModal } from '@/context/ModalContext';
import { useGetMyCreditCardQuery, useDeleteCreditCardMutation } from '@/lib/redux/features/bank/bankApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

interface CardSectionProps {
  onAddCard?: () => void;
}

export const CardSection: React.FC<CardSectionProps> = ({ onAddCard }) => {
  const { showModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  // Get auth state to check if user is logged in
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch user's credit card info để check có card hay không
  const {
    data: creditCardData,
    isLoading,
    error
  } = useGetMyCreditCardQuery(undefined, {
    // Only fetch if user is authenticated
    skip: !user || (typeof user === 'object' && !(user as { _id?: string })?._id)
  });

  // Delete card mutation
  const [deleteCreditCard] = useDeleteCreditCardMutation();

  // Check if user has a card
  const hasCard = !isLoading && !error && creditCardData?.data;

  const handleDeleteCard = async () => {
    if (!creditCardData?.data) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this credit card? This action cannot be undone.'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteCreditCard().unwrap();
      alert('Credit card deleted successfully!');
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete credit card. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <aside className="bg-white rounded-2xl p-4 min-h-[480px] w-[360px]">
      <div className="w-full">
        <header className="flex gap-6 justify-between items-center w-full">
          <h2 className="text-lg font-semibold leading-none text-stone-950">My Card</h2>

          {/* Conditional button: Add Card when no card, Delete Card when has card */}
          {hasCard ? (
            <button
              onClick={handleDeleteCard}
              disabled={isDeleting}
              className="flex gap-1 justify-center items-center px-2 py-1 text-sm font-medium leading-none text-center text-red-600 bg-red-50 min-h-6 rounded-[30px] hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>{isDeleting ? 'Deleting...' : 'Delete Card'}</span>
            </button>
          ) : (
            <button
              onClick={onAddCard ?? (() => showModal('addBankCard'))}
              className="flex gap-1 justify-center items-center px-2 py-1 text-sm font-medium leading-none text-center text-blue-600 bg-slate-50 min-h-6 rounded-[30px] hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Add Card</span>
            </button>
          )}
        </header>

        <div className="mt-2 w-full">
          <div className="relative w-full">
            <CreditCard />
          </div>
          <CardInfo />
        </div>
      </div>
    </aside>
  );
};