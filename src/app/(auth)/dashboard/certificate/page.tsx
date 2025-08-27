"use client"

import CertificateCard from '@/components/dashboard/certificate/CertificateCard';
import { useAllCertificates, useInstructorCertificates, useCurrentUser } from '@/hooks/useCertificate';
import Loading from '@/components/common/Loading';
import React, { useState } from 'react';
import { CommonPagination } from '@/components/common/ui';

const ITEMS_PER_PAGE = 6;

export default function Page() {
    const { user, loading: userLoading, error: userError } = useCurrentUser();
    const { certificates: allCertificates, loading: allCertificatesLoading, error: allCertificatesError } = useAllCertificates();
    const { certificates: instructorCertificates, loading: instructorCertificatesLoading, error: instructorCertificatesError } = useInstructorCertificates();
    const [currentPage, setCurrentPage] = useState(1);

    // Determine which certificates to use based on user role
    const isInstructor = user?.role === 'instructor';
    const certificates = isInstructor ? instructorCertificates : allCertificates;
    const loading = userLoading || (isInstructor ? instructorCertificatesLoading : allCertificatesLoading);
    const error = userError || (isInstructor ? instructorCertificatesError : allCertificatesError);

    const totalPages = Math.ceil((certificates?.length || 0) / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentCertificates = certificates?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];
    const placeholderCount = Math.max(0, ITEMS_PER_PAGE - currentCertificates.length);

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
                    <p className="text-sm text-gray-500">
                        {isInstructor
                            ? "No students have completed your courses yet"
                            : "Complete courses to earn certificates"
                        }
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div>
            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isInstructor ? 'Student Certificates' : 'My Certificates'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {isInstructor
                        ? 'Certificates earned by students in your courses'
                        : 'Certificates you have earned from completed courses'
                    }
                </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {currentCertificates.map((certificate) => (
                    <div key={certificate._id} className="min-h-[430px]">
                        <CertificateCard certificate={certificate} />
                    </div>
                ))}
                {Array.from({ length: placeholderCount }).map((_, idx) => (
                    <div key={`ph-${idx}`} className="min-h-[420px]" aria-hidden />
                ))}
            </div>
            {/* Pagination Controls */}
            <CommonPagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
