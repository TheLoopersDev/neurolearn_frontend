import React from "react";
import Image from "next/image";
import Link from "next/link";

const CertificateCard: React.FC<{ id: string }> = ({ id }) => {
    return (
        <Link href={`/certificate/${id}`} className="block">
            <div className="bg-white rounded-2xl p-4 relative overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition">
                {/* Certificate Image */}
                <Image
                    src="/assets/images/certificate.png"
                    alt="Certificate"
                    width={332}
                    height={233}
                    className="w-full object-cover rounded-xl mb-4"
                    priority
                />

                {/* Course Info Card */}
                <div className="">
                    <div className="flex items-center justify-between text-blue-600">
                        <div className="flex items-center gap-2">
                            <Image src="/assets/icons/tag.svg" alt="Tag" width={30} height={30} />
                            <span className="text-base font-semibold">Grapic Design</span>
                        </div>
                        <div className="h-10 w-10 bg-[#F7F8FA] flex items-center justify-center rounded-xl">
                            <Image src="/assets/icons/menu.svg" alt="Menu" width={30} height={30} />
                        </div>
                    </div>
                    <div className="font-bold text-gray-800 text-xl my-3 leading-tight">USER INTERFACE DESIGN COURSE (APP/ WEBSITE)</div>
                    <div className="flex justify-between items-start text-xs text-gray-500">
                        <div className="flex flex-col">
                            <span className="text-sm mb-2">Certified Students</span>
                            <div className="flex items-center">
                                <Image src='/assets/images/avatar.png' alt="avatar" width={30} height={30} className="rounded-full ring-2 ring-white" />
                                <Image src='/assets/images/avatar.png' alt="avatar" width={30} height={30} className="rounded-full ring-2 ring-white -ml-2" />
                                <Image src='/assets/images/avatar.png' alt="avatar" width={30} height={30} className="rounded-full ring-2 ring-white -ml-2" />
                                <span className="font-bold text-black ml-2">+125 Students</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm mb-4">Date received</span>
                            <span className="font-bold text-black">13 Jan, 2025</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CertificateCard;
