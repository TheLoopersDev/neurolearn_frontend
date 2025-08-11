'use client';

import DiscountTable from '@/components/dashboard/DiscountTable';
import React, { useState, useEffect } from 'react';
import Loading from '@/components/common/Loading';

interface Discount {
  _id: string;
  name: string;
  code: string;
  amount: number;
  discountType: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

const ITEMS_PER_PAGE = 6;

export default function Page() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setIsLoading(true);
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/discount/available`,
                {
                  credentials: 'include',
                    cache: 'no-store',
                  }
                );

          if (!res.ok) throw new Error(`Failed to fetch discounts: ${res.statusText}`);

          const { discounts: fetchedDiscounts } = await res.json();
          setDiscounts(fetchedDiscounts || []);
        } catch (error) {
          console.error('Error fetching discounts:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDiscounts();
    }, []);

  const totalPages = Math.ceil(discounts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDiscounts = discounts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (isLoading) {
    return <Loading message="Loading discounts..." />;
  }

    return (
        <div className="flex h-screen w-full rounded-2xl">
            <div className="w-full overflow-y-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Discount Management</h1>
                </div>

                {/* Discount Table */}
                <div className="w-full">
            <DiscountTable discounts={currentDiscounts} />
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
            </div>
        </div>
    );
} 