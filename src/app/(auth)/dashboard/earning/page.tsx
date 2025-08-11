'use client'

import React from 'react';
import { WithdrawForm } from '@/components/instructor/revenue/WithdrawForm';
import { BalanceOverview } from '@/components/instructor/revenue/BalanceOverview';
import { CardSection } from '@/components/instructor/revenue/CardSection';
import { TransactionHistory } from '@/components/instructor/revenue/TransactionHistory';
import { useModal } from '@/context/ModalContext';
import { useMemo } from 'react';
import { useGetTotalIncomeQuery } from '@/lib/redux/features/income/incomeApi';

const WithdrawDashboard: React.FC = () => {
  const { showModal } = useModal();

  const { data, isLoading, isError } = useGetTotalIncomeQuery();

  const income = useMemo(() => {
    return data?.income ?? 0;
  }, [data]);

  const errorMessage = isError ? 'Không thể lấy dữ liệu thu nhập' : null;

  const handleAddCard = () => {
    console.log('Add new card');
    showModal('addBankCard');
  };

  // Tính toán các giá trị
  const serviceFee = income * 0.1; // 10% của total income
  const currentBalance = income - serviceFee; // Số tiền có thể rút

  // Hàm format tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <div className="min-h-screen" >
      <main className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 items-start w-full">
          {/* Left Section */}
          <section className="flex-1 min-w-[400px]">
            <WithdrawForm
              totalRevenue={isLoading ? 'Đang tải...' : errorMessage ? errorMessage : formatCurrency(income)}
              maxWithdrawAmount={currentBalance}
            />

            <BalanceOverview
              totalIncome={isLoading ? 'Đang tải...' : formatCurrency(income)}
              serviceFee={isLoading ? 'Đang tải...' : formatCurrency(serviceFee)}
              currentBalance={isLoading ? 'Đang tải...' : formatCurrency(currentBalance)}
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