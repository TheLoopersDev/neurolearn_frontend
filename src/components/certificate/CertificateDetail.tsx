"use client"

import React from 'react';
import Image from 'next/image';
import ShareModal from "./ShareModal";

const CertificateDetail: React.FC = () => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <div className="relative">
            {/* Nền trắng phủ full ngang, cao đúng bằng component */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-screen h-full bg-white -z-10"></div>
            <div className="flex flex-row gap-8 items-start w-full mt-25">
                {/* Left Column */}
                <div className="flex-1 min-w-[350px]">
                    <div className="flex justify-center items-center text-xs text-white font-semibold my-4 bg-blue-700 rounded-xl w-36 h-7">
                        #1 Online Course 2025
                    </div>
                    <div className="text-3xl font-bold text-blue-700 my-4 leading-tight">
                        Graphic Design Mastercla Learn Great Design
                    </div>
                    <div className="flex items-start gap-4 my-4">
                        <div>
                            <Image
                                src="/assets/images/avatar-default.png"
                                alt="avatar"
                                width={88}
                                height={88}
                                className="rounded-full"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="text-xl font-semibold text-black">Completed by Đào Tuấn Kiệt</div>
                            <div className="text-lg mb-1 text-black">Jun 9, 2025</div>
                            <div className="text-lg mb-1 text-black">Duration: 33 hours (approximately)</div>
                            <div className="text-lg mb-1 text-black">Grade Achieved: <span className="font-bold">100%</span></div>
                            <div className="text-lg mb-4 text-gray-500">
                                Dao Tuan Kiet account is verified. Coursera certifies their successful completion of California Institute of the Arts UI UX Design Specialization.
                            </div>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">Typography</span>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">Graphic and Visual Design</span>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">Prototyping</span>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">Human Computer Interaction</span>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">User Flows</span>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">User Research</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Column */}
                <div className="flex-1 flex flex-col items-center -mt-19">
                    <Image
                        src="/assets/images/certificate-default.png"
                        alt="Certificate"
                        width={648}
                        height={456}
                        className="rounded-2xl shadow border"
                    />
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