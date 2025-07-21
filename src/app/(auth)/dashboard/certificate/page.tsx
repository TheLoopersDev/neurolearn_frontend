"use client"

import CertificateCard from '@/components/dashboard/certificate/CertificateCard';
import { useAllCertificates } from '@/hooks/useCertificate';
import React from 'react';

export default function Page() {
    const { certificates, loading, error } = useAllCertificates();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {certificates.map((certificate) => (
                <CertificateCard
                    key={certificate._id}
                    certificate={certificate}
                />
            ))}
        </div>
    );
}
