'use client'

import React from 'react';
import { WithdrawForm } from '@/components/instructor/revenue/WithdrawForm';
import { BalanceOverview } from '@/components/instructor/revenue/BalanceOverview';
import { CardSection } from '@/components/instructor/revenue/CardSection';
import { TransactionHistory } from '@/components/instructor/revenue/TransactionHistory';
import { useModal } from '@/context/ModalContext';

const WithdrawDashboard: React.FC = () => {
  const { showModal } = useModal();

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
            />

            <BalanceOverview
              totalWithdraw="84.900 VND"
              serviceFee="100.000 VND"
              currentBalance="200.000 VND"
            />
          </section>

          {/* Right Section */}
          <CardSection
            onAddCard={handleAddCard}
          />
        </div>

        <TransactionHistory />
      </main>
    </div>
  );
};

export default WithdrawDashboard;