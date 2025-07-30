'use client'

import React from 'react';
import { WithdrawForm } from '@/components/instructor/revenue/WithdrawForm';
import { BalanceOverview } from '@/components/instructor/revenue/BalanceOverview';
import { CardSection } from '@/components/instructor/revenue/CardSection';
import { TransactionHistory } from '@/components/instructor/revenue/TransactionHistory';
import { useModal } from '@/context/ModalContext';
import { useEffect, useState } from 'react';
import { getMyIncome } from '@/lib/services/revenue';

const WithdrawDashboard: React.FC = () => {
  const { showModal } = useModal();
  const [income, setIncome] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    setLoading(true);
    setError(null);
    try {
      const incomeValue = await getMyIncome();
      setIncome(incomeValue);
    } catch (err) {
      setError('Không thể lấy dữ liệu thu nhập');
      console.error('Error fetching income:', err);
    } finally {
      setLoading(false);
    }
  };

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
              totalRevenue={loading ? 'Đang tải...' : error ? error : formatCurrency(income)}
              maxWithdrawAmount={currentBalance}
            />

            <BalanceOverview
              totalIncome={loading ? 'Đang tải...' : formatCurrency(income)}
              serviceFee={loading ? 'Đang tải...' : formatCurrency(serviceFee)}
              currentBalance={loading ? 'Đang tải...' : formatCurrency(currentBalance)}
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