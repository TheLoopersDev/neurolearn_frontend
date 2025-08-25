'use client'

import React, { useState, useEffect } from 'react';
import { ReviewHeader } from "@/components/review-common";
import { CommonPagination } from '@/components/common/ui';
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/common/Loading";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SubmissionCard from './_components/SubmissionCard';
import SubmissionStats from './_components/SubmissionStats';

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

interface StatisticsData {
  totalRevenue: number;
  totalSubmission: number;
  totalWithdrawn: number;
  totalAvailable: number;
  activeInstructors: number;
  totalInstructors: number;
  averageSubmission: number;
}

// These interfaces are for future use when real API is implemented
// interface SubmissionsResponse {
//   success: boolean;
//   data: {
//     submissions: SubmissionData[];
//     pagination: {
//       currentPage: number;
//       totalPages: number;
//       totalItems: number;
//       itemsPerPage: number;
//       hasNextPage: boolean;
//       hasPrevPage: boolean;
//     };
//   };
//   message: string;
// }

// interface StatisticsResponse {
//   success: boolean;
//   data: StatisticsData;
//   message: string;
// }

// Mock data for development
const mockSubmissions: SubmissionData[] = [
  {
    userId: '1',
    userName: 'Nguyễn Văn A',
    userEmail: 'nguyenvana@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    total: 5000000,
    submission: 500000,
    netIncome: 4500000,
    withdrawn: 2000000,
    available: 2500000,
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    userId: '2',
    userName: 'Trần Thị B',
    userEmail: 'tranthib@example.com',
    total: 3000000,
    submission: 300000,
    netIncome: 2700000,
    withdrawn: 1000000,
    available: 1700000,
    updatedAt: '2024-01-14T15:45:00Z'
  },
  {
    userId: '3',
    userName: 'Lê Văn C',
    userEmail: 'levanc@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    total: 8000000,
    submission: 800000,
    netIncome: 7200000,
    withdrawn: 3000000,
    available: 4200000,
    updatedAt: '2024-01-13T09:20:00Z'
  },
  {
    userId: '4',
    userName: 'Phạm Thị D',
    userEmail: 'phamthid@example.com',
    total: 2000000,
    submission: 200000,
    netIncome: 1800000,
    withdrawn: 500000,
    available: 1300000,
    updatedAt: '2024-01-12T14:15:00Z'
  },
  {
    userId: '5',
    userName: 'Hoàng Văn E',
    userEmail: 'hoangvane@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    total: 12000000,
    submission: 1200000,
    netIncome: 10800000,
    withdrawn: 4000000,
    available: 6800000,
    updatedAt: '2024-01-11T11:30:00Z'
  }
];

const mockStatistics: StatisticsData = {
  totalRevenue: 30000000,
  totalSubmission: 3000000,
  totalWithdrawn: 10500000,
  totalAvailable: 16500000,
  activeInstructors: 5,
  totalInstructors: 8,
  averageSubmission: 600000
};

const SubmissionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('submission');
  const [sortOrder, setSortOrder] = useState('desc');
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.role;
  const [ready, setReady] = useState(false);

  // Mark as client-ready to avoid hydration flicker
  useEffect(() => setReady(true), []);

  // Redirect when not admin
  useEffect(() => {
    if (!ready) return;
    if (role !== 'admin') {
      router.replace('/');
    }
  }, [ready, role, router]);

  useEffect(() => {
    if (ready && role === 'admin') {
      fetchSubmissions();
      fetchStatistics();
    }
  }, [ready, role, currentPage, sortBy, sortOrder]);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter by search term
      const filteredData = mockSubmissions.filter(submission => 
        submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort data
      filteredData.sort((a, b) => {
        let aValue: number, bValue: number;
        
        switch (sortBy) {
          case 'submission':
            aValue = a.submission;
            bValue = b.submission;
            break;
          case 'total':
            aValue = a.total;
            bValue = b.total;
            break;
          case 'available':
            aValue = a.available;
            bValue = b.available;
            break;
          case 'withdrawn':
            aValue = a.withdrawn;
            bValue = b.withdrawn;
            break;
          default:
            aValue = a.submission;
            bValue = b.submission;
        }

        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });

      // Pagination
      const itemsPerPage = 10;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setSubmissions(paginatedData);
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      setTotalItems(filteredData.length);

    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSubmissions([]);
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      setIsLoadingStats(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      setStatistics(mockStatistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSort = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (isLoading && !ready) {
    return <Loading message="Loading submissions..." className="min-h-screen" />;
  }

  if (!ready || role !== 'admin') {
    return <Loading message="Redirecting..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <ReviewHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory=""
          setSelectedCategory={() => { }}
          categories={[]}
          activeTab="submissions"
          onTabChange={() => { }}
          tabOptions={[
            { value: 'submissions', label: 'Submissions' }
          ]}
        />

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Submissions</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              📊 Manage all instructor revenue submissions
            </div>
            <div className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
              🔧 Using mock data - Backend API pending
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        {!isLoadingStats && statistics && (
          <SubmissionStats statistics={statistics} />
        )}

        {/* Sort Controls */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="flex gap-2">
                {[
                  { key: 'submission', label: 'Submission' },
                  { key: 'total', label: 'Total Revenue' },
                  { key: 'available', label: 'Available' },
                  { key: 'withdrawn', label: 'Withdrawn' }
                ].map((sortOption) => (
                  <button
                    key={sortOption.key}
                    onClick={() => handleSort(sortOption.key)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === sortOption.key
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {sortOption.label}
                    {sortBy === sortOption.key && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Total: {totalItems} instructors
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Loading message="Loading submissions..." />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
              {searchTerm ? `No submissions found matching "${searchTerm}"` : 'No submissions found'}
            </div>
          ) : (
            submissions.map((submission, index) => (
              <SubmissionCard
                key={submission.userId}
                submission={submission}
                index={index}
                formatCurrency={formatCurrency}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <CommonPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage; 