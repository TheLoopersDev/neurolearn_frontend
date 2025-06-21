'use client'

import React from 'react';
import { WithdrawForm } from '@/components/instructor/revenue/WithdrawForm';
import { BalanceOverview } from '@/components/instructor/revenue/BalanceOverview';
import { CardSection } from '@/components/instructor/revenue/CardSection';
import { TransactionHistory } from '@/components/instructor/revenue/TransactionHistory';
import { Transaction, CardInfoProps } from '@/types/income';
import { useModal } from '@/context/ModalContext';

const WithdrawDashboard: React.FC = () => {
  const transactions: Transaction[] = [
    {
      id: 1,
      note: 'Payment for course sales to instructors (3)',
      bank: 'MB bank',
      amount: '400.000 VNĐ',
      date: '22 May,2025',
      status: 'Pending'
    },
    {
      id: 2,
      note: 'Payment for course sales to instructors (2)',
      bank: 'MB bank',
      amount: '400.000 VNĐ',
      date: '22 May,2025',
      status: 'Completed'
    },
    {
      id: 3,
      note: 'Payment for course sales to instructors (1)',
      bank: 'MB bank',
      amount: '400.000 VNĐ',
      date: '22 May,2025',
      status: 'Completed'
    }
  ];

  const cardData: CardInfoProps = {
    bankName: 'MB Bank',
    cardHolder: 'DAO TUAN KIET',
    cardNumber: '123 123 123 123 456',
    cvv: '***',
    expiryDate: '12/28'
  };

  const { showModal } = useModal();

  const handleWithdraw = (amount: string, reason: string) => {
    console.log('Withdraw:', { amount, reason });
  };

  const handleAddCard = () => {
    console.log('Add new card');
    showModal('addBankCard');
  };

  return (
    <div className="min-h-screen" >
      <main className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 items-start w-full">
          {/* Left Section */}
          <section className="flex-1 min-w-[400px]">
            <WithdrawForm
              totalRevenue="350.000 VND"
              onWithdraw={handleWithdraw}
            />

            <BalanceOverview
              totalWithdraw="84.900 VND"
              serviceFee="100.000 VND"
              currentBalance="200.000 VND"
            />
          </section>

          {/* Right Section */}
          <CardSection
            cardData={cardData}
            onAddCard={handleAddCard}
          />
        </div>

        <TransactionHistory transactions={transactions} />
      </main>
    </div>
  );
};

export default WithdrawDashboard;