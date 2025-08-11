"use client"

import CertificateCard from '@/components/dashboard/certificate/CertificateCard';
import { useAllCertificates } from '@/hooks/useCertificate';
import Loading from '@/components/common/Loading';
import React, { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 6;

export default function Page() {
    const { certificates, loading, error } = useAllCertificates();
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil((certificates?.length || 0) / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentCertificates = certificates?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

    if (loading) {
        return <Loading message="Loading certificates..." />;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-red-600 text-center">
                    <p className="text-lg font-semibold mb-2">Error loading certificates</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!certificates || certificates.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2 text-gray-600">No certificates found</p>
                    <p className="text-sm text-gray-500">Complete courses to earn certificates</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {currentCertificates.map((certificate) => (
                    <CertificateCard
                        key={certificate._id}
                        certificate={certificate}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-3">
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
    );
}
