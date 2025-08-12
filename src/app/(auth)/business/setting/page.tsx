'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Loading from '@/components/common/Loading';

const BusinessSettingPage = () => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);

  // Redirect to business dashboard
  useEffect(() => {
    if (user?.businessInfo?.businessId) {
      router.push(`/business/dashboard/${user.businessInfo.businessId}`);
    }
  }, [user?.businessInfo?.businessId, router]);

  return <Loading message="Redirecting..." className="min-h-screen" />;
};

export default BusinessSettingPage;
