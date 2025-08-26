'use client';

import React from 'react';
import { DollarSign, TrendingUp, Users, Wallet, CreditCard, BarChart3 } from 'lucide-react';

interface StatisticsData {
  totalRevenue: number;
  totalSubmission: number;
  totalWithdrawn: number;
  totalAvailable: number;
  activeInstructors: number;
  totalInstructors: number;
  averageSubmission: number;
}

interface SubmissionStatsProps {
  statistics: StatisticsData;
}

export default function SubmissionStats({ statistics }: SubmissionStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const getSubmissionPercentage = () => {
    if (statistics.totalRevenue === 0) return '0';
    return ((statistics.totalSubmission / statistics.totalRevenue) * 100).toFixed(1);
  };

  const getActivePercentage = () => {
    if (statistics.totalInstructors === 0) return 0;
    return ((statistics.activeInstructors / statistics.totalInstructors) * 100).toFixed(1);
  };

  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(statistics.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Total revenue from all instructors'
    },
    {
      title: 'Total Submission',
      value: formatCurrency(statistics.totalSubmission),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: `10% of total revenue (${getSubmissionPercentage()}%)`
    },
    {
      title: 'Total Available',
      value: formatCurrency(statistics.totalAvailable),
      icon: Wallet,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Available for withdrawal'
    },
    {
      title: 'Total Withdrawn',
      value: formatCurrency(statistics.totalWithdrawn),
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Already withdrawn by instructors'
    },
    {
      title: 'Active Instructors',
      value: `${formatNumber(statistics.activeInstructors)} / ${formatNumber(statistics.totalInstructors)}`,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      description: `${getActivePercentage()}% of total instructors`
    },
    {
      title: 'Average Submission',
      value: formatCurrency(statistics.averageSubmission),
      icon: BarChart3,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      description: 'Average submission per instructor'
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl border ${card.bgColor} ${card.borderColor} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Platform Fee</div>
                  <div className="text-xs font-medium text-gray-700">10%</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">{card.title}</h3>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </div>
                <p className="text-xs text-gray-500">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(statistics.totalSubmission)}
            </div>
            <div className="text-sm text-gray-600">Platform Revenue</div>
            <div className="text-xs text-gray-500 mt-1">
              {getSubmissionPercentage()}% of total revenue
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(statistics.totalRevenue - statistics.totalSubmission)}
            </div>
            <div className="text-sm text-gray-600">Instructor Revenue</div>
            <div className="text-xs text-gray-500 mt-1">
              {((100 - parseFloat(getSubmissionPercentage())).toFixed(1))}% of total revenue
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {formatNumber(statistics.activeInstructors)}
            </div>
            <div className="text-sm text-gray-600">Active Instructors</div>
            <div className="text-xs text-gray-500 mt-1">
              {getActivePercentage()}% of total instructors
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 