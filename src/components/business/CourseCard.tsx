'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import InviteModal from './InviteModal';



export default function CourseCard({ course }: any) {

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [totalLicenses, setTotalLicenses] = useState(course?.totalLicenses);

    return (
        <>
            <Link
                href={`/business/mycourses/${course?.course._id}`}
                className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
                {/* HEADER: Thumbnail + (Category + Title) */}
                <div className="flex items-start p-5 gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-40 h-20 flex-shrink-0">
                        <Image
                            src={course?.course?.thumbnail?.url}
                            alt={course?.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col w-full ">
                        {/* Row 1: Category (left) + Invite Icon (right) */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <span className=" text-lg font-semibold text-black leading-snug">
                                    {course?.course.name
                                        ?.split(' ')
                                        .slice(0, 4)
                                        .join(' ') + (course?.course.name?.split(' ').length > 4 ? '...' : '')}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsInviteOpen(true);
                                }}
                                className="flex-shrink-0"
                            >
                                <Image
                                    src="/assets/icons/invite.svg"
                                    alt="Invite Icon"
                                    height={40}
                                    width={40}
                                />
                            </button>
                        </div>
                        {/* Row 2: Course Name */}
                        <h3 className="text-sm text-gray-400 leading-snug">
                            {course?.course.description
                                ?.split(' ')
                                .slice(0, 10)
                                .join(' ') + (course?.course.description?.split(' ').length > 10 ? '...' : '')}
                        </h3>

                    </div>
                </div>
                {/* BODY: Info Row, Avatars, Progress */}
                <div className="px-5 pb-5 flex flex-col gap-4">
                    {/* Info Row */}
                    <div className="flex items-center justify-between text-sm text-gray-500 gap-2">
                        {/* Date / Courses / Count */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>Total Licenses: {totalLicenses}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <InviteModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                course={course?.course}
                totalLicenses={totalLicenses}
                setTotalLicenses={setTotalLicenses}
            />
        </>
    );
}
