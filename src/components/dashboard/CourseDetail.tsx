'use client';

import Image from 'next/image';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetCourseStatsQuery } from '@/lib/redux/features/course/courseApi';

export default function CourseDetail() {
    const { user } = useSelector((state: any) => state.auth);

    const { data, isLoading } = useGetCourseStatsQuery(user?._id ?? skipToken);

    const stats = [
        {
            label: 'Total Courses',
            icon: '/assets/icons/blue-book.svg',
            value: data?.totalCourses ?? 0,
            width: 50,
            height: 50,
        },
        {
            label: 'Pending Courses',
            icon: '/assets/icons/hourglass.svg',
            value: data?.pendingCourses ?? 0,
            width: 35,
            height: 35,
        },
        {
            label: 'Courses Sold',
            icon: '/assets/icons/sold.svg',
            value: data?.coursesSold ?? 0,
            width: 50,
            height: 50,
        },
        {
            label: 'Published',
            icon: '/assets/icons/blue-completion.svg',
            value: data?.publishedCourses ?? 0,
            width: 50,
            height: 50,
        },
    ];

    return (
        <div className="text-3xl font-bold text-black max-w-full mx-auto bg-[#F7F8FA]">
            <div className="flex justify-between gap-8 w-full">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="flex-1 text-base h-[120px] bg-[#FFFFFF] text-[#6B6B6B] rounded-2xl p-6 flex flex-col justify-between"
                    >
                        <div className="flex flex-row items-center justify-between w-full">
                            <div className="flex items-center justify-center" style={{ width: 50, height: 50 }}>
                                <Image
                                    src={item.icon}
                                    alt={item.label}
                                    width={item.width}
                                    height={item.height}
                                />
                            </div>
                            <span className="text-4xl font-bold text-[#3858F8]">
                                {isLoading ? '...' : item.value}
                            </span>
                        </div>
                        <div className="flex justify-end">
                            <span className="text-base text-[#6B6B6B]">{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
