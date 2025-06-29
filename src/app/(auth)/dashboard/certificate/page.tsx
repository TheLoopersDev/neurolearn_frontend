import CertificateCard from '@/components/dashboard/certificate/CertificateCard';
import React from 'react';


export default function Page() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <CertificateCard id="1" />
            <CertificateCard id="2" />
            <CertificateCard id="3" />
            <CertificateCard id="4" />
            <CertificateCard id="5" />
            <CertificateCard id="6" />
        </div>
    );
}
