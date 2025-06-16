'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen ">
      {/* Sidebar chiếm 1/6 */}
      <div className="w-1/6 mt-6">
        <Sidebar />
      </div>
      {/* Nội dung chiếm 5/6 */}
      <div className="w-5/6  p-6  overflow-y-auto">{children}</div>
    </div>
  );
}
