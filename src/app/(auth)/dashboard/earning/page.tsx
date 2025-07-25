'use client'

import React from 'react';
import { WithdrawForm } from '@/components/instructor/revenue/WithdrawForm';
import { BalanceOverview } from '@/components/instructor/revenue/BalanceOverview';
import { CardSection } from '@/components/instructor/revenue/CardSection';
import { TransactionHistory } from '@/components/instructor/revenue/TransactionHistory';
import { useModal } from '@/context/ModalContext';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getMyIncome } from '@/lib/services/revenue';
import { Session } from 'next-auth';
import { useGetWithdrawHistoryQuery } from '@/lib/redux/features/bank/bankApi';

const WithdrawDashboard: React.FC = () => {
  const { showModal } = useModal();
  const { data: sessionData, status } = useSession();
  type SessionWithToken = Session & { accessToken?: string };
  const session = sessionData as SessionWithToken;
  const [income, setIncome] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncome = async () => {
      if (status === 'authenticated' && session?.accessToken) {
        setLoading(true);
        setError(null);
        try {
          const incomeValue = await getMyIncome(session.accessToken as string);
          setIncome(incomeValue);
        } catch (err) {
          setError('Không thể lấy dữ liệu thu nhập');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchIncome();
  }, [session, status]);

  const handleAddCard = () => {
    console.log('Add new card');
    showModal('addBankCard');
  };

  const { data: withdrawData, isLoading: isWithdrawLoading } = useGetWithdrawHistoryQuery();
  const transactions = withdrawData?.data || [];
  const totalWithdraw = transactions.reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : Number(t.amount)), 0);

  // Tính phí dịch vụ 10% tổng thu nhập
  const serviceFee = income ? income * 0.1 : 0;
  // Số dư hiện tại = income - totalWithdraw - serviceFee
  const currentBalance = income !== null ? income - totalWithdraw - serviceFee : 0;

  // Hàm format tiền tệ
  const formatCurrency = (value: number | string | null) => {
    if (value === null || isNaN(Number(value))) return '0 VND';
    return Number(value).toLocaleString('vi-VN') + ' VND';
  };

  return (
    <div className="min-h-screen" >
      <main className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 items-start w-full">
          {/* Left Section */}
          <section className="flex-1 min-w-[400px]">
            <WithdrawForm
              totalRevenue={loading ? 'Đang tải...' : error ? error : income !== null ? `${income.toLocaleString()} VND` : '0 VND'}
            />

            <BalanceOverview
              totalWithdraw={isWithdrawLoading ? 'Đang tải...' : formatCurrency(totalWithdraw)}
              serviceFee={loading ? 'Đang tải...' : formatCurrency(serviceFee)}
              currentBalance={loading || isWithdrawLoading ? 'Đang tải...' : formatCurrency(currentBalance)}
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