import Sidebar from '@/components/instructor/Sidebar';
import QuizBuilderPage from '@/app/(auth)/dashboard/create-quiz/_components/QuizBuilderPage';
import React from 'react';

export default function Page() {
  return (
    <div>
      <div className="flex">
        <div className="w-1/6 bg-gray-100">
          <Sidebar />
        </div>
        <div className="w-5/6 bg-gray-100 p-6 overflow-y-auto">
          <QuizBuilderPage />
        </div>
      </div>
    </div>
  );
}
