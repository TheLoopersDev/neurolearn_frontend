'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen px-30">
      {/* Sidebar chiếm 1/6 */}
      <div className="w-1/6 bg-white">
        <Sidebar />
      </div>
      {/* Nội dung chiếm 5/6 */}
      <div className="w-5/6 bg-[#F7F8FA] p-6  overflow-y-auto">{children}</div>
    </div>
  );
}
