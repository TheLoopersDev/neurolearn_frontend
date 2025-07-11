'use client';

import React from 'react';
import { Users, Award, Clock } from 'lucide-react';
import Image from 'next/image';
import Book from '@/public/assets/business/book.svg'; // Adjust the path as necessary

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <div className="relative bg-white rounded-2xl p-6 h-[120px] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-100/70 to-transparent rounded-t-2xl"></div>

      <div className="relative z-10 flex items-start justify-between h-full">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 text-white">
          {icon}
        </div>
        <div className="text-right">
          <div className="text-4xl font-semibold text-blue-500 mb-1">{value}</div>
          <div className="text-gray-600 text-sm font-medium">{label}</div>
        </div>
      </div>
    </div>
  );
};

const StatisticsCards = () => {
  const stats = [
    {
      icon: <Image src={Book} width={24} height={24} alt="book" />,
      value: '12',
      label: 'Total Courses',
    },
    {
      icon: <Users size={24} />,
      value: '10',
      label: 'Total Learners',
    },
    {
      icon: <Award size={24} />,
      value: '10',
      label: 'Ongoing Courses',
    },
    {
      icon: <Clock size={24} />,
      value: '10',
      label: 'Completed Courses',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
};

export default StatisticsCards;
