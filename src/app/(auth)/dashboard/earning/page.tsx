'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { WithdrawForm } from '@/components/instructor/revenue/WithdrawForm';
import { BalanceOverview } from '@/components/instructor/revenue/BalanceOverview';
import { CardSection } from '@/components/instructor/revenue/CardSection';
import { TransactionHistory } from '@/components/instructor/revenue/TransactionHistory';
import { useModal } from '@/context/ModalContext';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useGetRevenueDetailedMeQuery } from '@/lib/redux/features/income/incomeApi';

const WithdrawDashboard: React.FC = () => {
  const { showModal } = useModal();

  // Use detailed revenue endpoint to get total, submission, withdrawn, available
  const { data, isLoading, isError, refetch } = useGetRevenueDetailedMeQuery();
  const [refreshKey, setRefreshKey] = useState(0);

  // Map backend fields to UI fields according to new model
  const total = useMemo(() => data?.data?.total ?? 0, [data]);
  const submission = useMemo(() => data?.data?.submission ?? 0, [data]);
  const available = useMemo(() => data?.data?.available ?? 0, [data]);

  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.role;
  const [ready, setReady] = useState(false);

  // Mark as client-ready to avoid hydration flicker
  useEffect(() => setReady(true), []);

  // Redirect when not instructor
  useEffect(() => {
    if (!ready) return;
    if (role === undefined) return;
    if (role !== 'instructor') {
      router.replace('/'); // send non-instructor to home
    }
  }, [ready, role, router]);

  const errorMessage = isError ? 'Không thể lấy dữ liệu thu nhập' : null;

  const handleAddCard = () => {
    console.log('Add new card');
    showModal('addBankCard');
  };

  const handleWithdrawSuccess = async () => {
    try {
      await refetch();
    } catch { }
    setRefreshKey(prev => prev + 1);
  };

  // Hàm format tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  if (isLoading) {
    return <Loading message="Loading earnings..." className="min-h-screen" />;
  }
  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'instructor') return <Loading message="Redirecting..." className="min-h-screen" />;
  return (
    <div className="min-h-screen" >
      <main className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 items-start w-full">
          {/* Left Section */}
          <section className="flex-1 min-w-[400px]">
            <WithdrawForm
              totalRevenue={errorMessage ? errorMessage : formatCurrency(total)}
              maxWithdrawAmount={available}
              onSuccess={handleWithdrawSuccess}
            />

            <BalanceOverview
              totalIncome={formatCurrency(total)}
              serviceFee={formatCurrency(submission)}
              currentBalance={formatCurrency(available)}
            />
          </section>

          {/* Right Section */}
          <CardSection
            onAddCard={handleAddCard}
          />
        </div>

        <TransactionHistory refreshKey={refreshKey} />
      </main>
    </div>
  );
};

export default WithdrawDashboard;