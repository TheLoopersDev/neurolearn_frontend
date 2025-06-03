'use client';

import Sidebar from '@/components/instructor/Sidebar';
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar chiếm 1/6 */}
      <div className="w-1/6 bg-white">
        <Sidebar />
      </div>

      {/* Nội dung chiếm 5/6 */}
      <div className="w-5/6 bg-[#F7F8FA] p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4 text-gray-600">Nội dung chính hiển thị ở đây...</p>
      </div>
    </div>
  );
}
