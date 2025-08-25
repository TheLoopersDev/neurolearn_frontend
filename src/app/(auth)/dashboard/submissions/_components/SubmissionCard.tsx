'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, DollarSign, TrendingUp, Wallet, CreditCard, Calendar, User } from 'lucide-react';

interface SubmissionData {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  total: number;
  submission: number;
  netIncome: number;
  withdrawn: number;
  available: number;
  updatedAt: string;
}

interface SubmissionCardProps {
  submission: SubmissionData;
  index: number;
  formatCurrency: (amount: number) => string;
}

export default function SubmissionCard({ submission, index, formatCurrency }: SubmissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubmissionPercentage = () => {
    if (submission.total === 0) return 0;
    return ((submission.submission / submission.total) * 100).toFixed(1);
  };

  const getStatusColor = (amount: number) => {
    if (amount > 1000000) return 'text-green-600';
    if (amount > 500000) return 'text-blue-600';
    if (amount > 100000) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className={`border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
    }`}>
      {/* Main Row */}
      <div className="grid grid-cols-12 gap-8 px-8 py-8 items-start hover:bg-gray-50 transition-colors">
        {/* User Info */}
        <div className="col-span-3 flex items-center gap-4">
          {submission.userAvatar ? (
            <Image
              src={submission.userAvatar}
              alt="user avatar"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
              {submission.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <div className="font-semibold text-gray-900 text-base leading-6">{submission.userName}</div>
            <div className="text-sm text-gray-500">{submission.userEmail}</div>
            <div className="text-xs text-blue-600 font-medium">Instructor</div>
          </div>
        </div>

        {/* Submission & Revenue Info */}
        <div className="col-span-4 flex items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-base">
                {formatCurrency(submission.submission)}
              </span>
              <span className="text-xs text-gray-500">
                ({getSubmissionPercentage()}% of total)
              </span>
            </div>
            <div className="text-sm text-gray-500 line-clamp-1">
              Total: {formatCurrency(submission.total)}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2 font-medium"
            >
              {isExpanded ? 'Show less' : 'Show more'}
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Available & Withdrawn */}
        <div className="col-span-3 flex items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-base ${getStatusColor(submission.available)}`}>
                {formatCurrency(submission.available)}
              </span>
              <span className="text-xs text-gray-500">Available</span>
            </div>
            <div className="text-sm text-gray-500">
              Withdrawn: {formatCurrency(submission.withdrawn)}
            </div>
          </div>
        </div>

        {/* Updated Date */}
        <div className="col-span-2 flex items-center">
          <span className="text-gray-700 font-medium text-sm">
            {formatDate(submission.updatedAt)}
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-8 pb-8 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {/* User Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Instructor Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Name: {submission.userName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Email:</span>
                  <span>{submission.userEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">User ID:</span>
                  <span className="font-mono text-xs">{submission.userId}</span>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Revenue Breakdown</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>Total Revenue: {formatCurrency(submission.total)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Submission (10%): {formatCurrency(submission.submission)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wallet className="w-4 h-4 text-purple-600" />
                  <span>Net Income: {formatCurrency(submission.netIncome)}</span>
                </div>
              </div>
            </div>

            {/* Financial Status */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Financial Status</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  <span>Available: {formatCurrency(submission.available)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Withdrawn:</span>
                  <span>{formatCurrency(submission.withdrawn)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span>Updated: {formatDate(submission.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 text-base">Financial Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Total Revenue</div>
                <div className="font-semibold text-lg text-green-600">{formatCurrency(submission.total)}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Submission (10%)</div>
                <div className="font-semibold text-lg text-blue-600">{formatCurrency(submission.submission)}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Available</div>
                <div className={`font-semibold text-lg ${getStatusColor(submission.available)}`}>
                  {formatCurrency(submission.available)}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Withdrawn</div>
                <div className="font-semibold text-lg text-gray-600">{formatCurrency(submission.withdrawn)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 