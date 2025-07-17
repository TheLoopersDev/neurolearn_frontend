'use client'; // Component này giờ sử dụng state, nên cần 'use client'

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { ILearner } from '@/types/leaner';
import LearnerRow from './LearnerRow';
import TestStatisticsList from './TestStatisticsList'; // Import component thống kê

interface LearnerListProps {
  learners: ILearner[];
}

const LearnerList: React.FC<LearnerListProps> = ({ learners }) => {
  // 1. Quản lý state ngay bên trong component
  const [view, setView] = useState<'overview' | 'statistics'>('overview');
  const isOverview = view === 'overview';

  return (
    <div className="bg-white p-6 rounded-2xl flex flex-col gap-6">
      {/* 2. Header với logic chuyển đổi được đặt ở đây */}
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-medium text-black">Learner</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('overview')}
            disabled={isOverview}
            className="disabled:text-gray-300 hover:text-[#3858F8] transition-colors"
          >
            <ArrowLeft className="w-6 h-6 hover:cursor-pointer text-gray-900" />
          </button>
          <span className="text-lg font-medium w-48 text-center text-gray-900">
            {isOverview ? '1/2 Overview' : '2/2 Test Statistics'}
          </span>
          <button
            onClick={() => setView('statistics')}
            disabled={!isOverview}
            className="disabled:text-gray-300 hover:text-[#3858F8] transition-colors"
          >
            <ArrowRight className="w-6 h-6 hover:cursor-pointer text-gray-900" />
          </button>
        </div>
      </div>

      {/* 3. Dựa vào state để render giao diện tương ứng */}
      {isOverview ? (
        // Giao diện Overview (như cũ)
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-12 gap-6 pb-4 text-gray-500 font-medium">
              <div className="col-span-3 pl-10">Full Name</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Last opened content</div>
              <div className="col-span-2">Start Date</div>
              <div className="col-span-2">Progress</div>
            </div>
            <div className="flex flex-col gap-4">
              {learners.map((learner, index) => (
                <LearnerRow key={learner._id} learner={learner} index={index + 1} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Giao diện Test Statistics
        <TestStatisticsList learners={learners} />
      )}
    </div>
  );
};

export default LearnerList;
