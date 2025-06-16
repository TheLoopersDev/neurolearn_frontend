'use client';

import CourseDetail from '@/components/dashboard/CourseDetail';
import CourseStatus from '@/components/dashboard/CourseStatus';
import EvalueStatistic from '@/components/dashboard/EvalueStatistic';
import RevenueStatisticChart from '@/components/dashboard/RevenueStatisticChart';
import StudentStatisticChart from '@/components/dashboard/StudentStatisticChart';
import Image from 'next/image';
import React from 'react';

export default function DashboardLayout() {
  return (
    <div className="flex h-full ">
      {/* Sidebar chiếm 1/6 */}

      {/* Nội dung chiếm 5/6 */}
      <div className="w-full overflow-y-auto">
        <div className="rounded-2xl overflow-hidden w-full">
          <Image
            src="/assets/images/banner-dashboard.png"
            alt="avatar"
            width={1500}
            height={800}
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="mt-6 space-y-6">
          <CourseDetail />
          <CourseStatus />
          <StudentStatisticChart />
          <div className="flex gap-6">
            <div className="w-[70%]">
              <RevenueStatisticChart />
            </div>
            <div className="w-[30%]">
              <div className="bg-white rounded-2xl p-4 w-full h-full flex flex-col">
                <EvalueStatistic />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
