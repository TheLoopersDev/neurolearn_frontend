"use client"

import React from 'react';
import Image from 'next/image';
import ShareModal from "./ShareModal";
import { Certificate } from '@/types/certificate';
import { format } from 'date-fns';
import { getUserById } from '@/lib/services/user';

interface CertificateDetailProps {
    certificate?: Certificate | null;
}

const CertificateDetail: React.FC<CertificateDetailProps> = ({ certificate }) => {
    const [showModal, setShowModal] = React.useState(false);
    const [userAvatar, setUserAvatar] = React.useState<string>('/assets/images/avatar-default.png');

    React.useEffect(() => {
        const fetchUserAvatar = async () => {
            if (!certificate?.user?._id) return;

            try {
                const userData = await getUserById(certificate.user._id);
                const user = userData.user || userData;
                if (user?.avatar?.url) {
                    setUserAvatar(user.avatar.url);
                }
            } catch (error) {
                console.error('Failed to fetch user avatar:', error);
            }
        };

        fetchUserAvatar();
    }, [certificate?.user?._id]);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return 'Invalid date';
        }
    };

    // If no certificate data, show a placeholder or loading state
    if (!certificate) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2 text-gray-600">Certificate not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-screen h-full bg-white -z-10"></div>
            <div className="flex flex-row gap-8 items-start w-full mt-25">
                {/* Left Column */}
                <div className="flex-1 min-w-[350px]">
                    <div className="flex justify-center items-center text-xs text-white font-semibold my-4 bg-blue-700 rounded-xl w-36 h-7">
                        Course Certificate
                    </div>
                    <div className="text-3xl font-bold text-blue-700 my-4 leading-tight">
                        {certificate.courseName}
                    </div>
                    <div className="flex items-start gap-4 my-4">
                        <div>
                            <Image
                                src={userAvatar}
                                alt="avatar"
                                width={88}
                                height={88}
                                className="rounded-full ring-2 ring-white object-cover w-22 h-22"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="text-xl font-semibold text-black">Completed by {certificate.userName}</div>
                            <div className="text-lg mb-1 text-black">{formatDate(certificate.completedAt)}</div>
                            <div className="text-lg mb-1 text-black">Duration: Completed</div>
                            <div className="text-lg mb-1 text-black">Grade Achieved: <span className="font-bold">100%</span></div>
                            <div className="text-lg mb-4 text-gray-500">
                                {certificate.userName} has successfully completed the {certificate.courseName} course. This certificate is issued by {certificate.issuedBy}.
                            </div>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">Course Completion</span>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">Certificate</span>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">Achievement</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Column */}
                <div className="flex-1 flex flex-col items-center -mt-19">
                    <div className="relative">
                        <Image
                            src="/assets/images/certificate.png"
                            alt="Certificate"
                            width={648}
                            height={456}
                            className="rounded-2xl shadow border"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-black font-semibold text-4xl drop-shadow-lg mt-8">
                                {certificate.userName}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-20 mt-6 w-full justify-between">
                        <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 transition w-1/2">
                            <Image src="/assets/icons/share.svg" alt='Share' width={30} height={30} /> Share certificate
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-gray-200 text-blue-700 px-5 py-2 rounded-xl font-semibold shadow hover:bg-gray-200 transition w-1/2">
                            <Image src="/assets/icons/download.svg" alt='Download' width={30} height={30} /> Download Certificate
                        </button>
                    </div>
                </div>
            </div>
            {showModal && (
                <ShareModal open={showModal} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
};

export default CertificateDetail;