'use client';

import Image from 'next/image';
import React from 'react';

interface ExamItem {
    courseName: string;
    thumbnail: string;
    exams: {
        name: string;
        duration: string; // ví dụ "30 Mins"
    }[];
}

interface UpcomingExamProps {
    items: ExamItem[];
}

export default function UpcomingExam({ items }: UpcomingExamProps) {
    return (
        <div className="bg-white rounded-xl p-6 w-[548px]">
            <div className="flex flex-col gap-3 w-full">
                <h2 className="text-[32px] font-medium text-black leading-[38px]">Upcoming Exam</h2>
                <span className="text-gray-500 text-[16px] font-medium">Course name</span>
            </div>

            <div className="mt-6 flex flex-col gap-6 w-full">
                {items.map((item, idx) => (
                    <div key={idx} className="w-full">
                        {/* Course info */}
                        <div className="flex items-end gap-3 bg-[#F7F8FA] p-3 rounded-t-xl">
                            <div className="w-[63px] h-[63px] rounded-lg overflow-hidden">
                                <Image
                                    src={item.thumbnail}
                                    alt={item.courseName}
                                    width={63}
                                    height={63}
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-[20px] font-medium text-black leading-[24px]">
                                {item.courseName}
                            </span>
                        </div>

                        {/* Exam list */}
                        {item.exams.map((exam, eIdx) => (
                            <div
                                key={eIdx}
                                className={`flex justify-between items-center bg-[#F7F8FA] px-3 py-2 ${eIdx === item.exams.length - 1 ? 'rounded-b-xl' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-2 text-black font-medium text-[16px]">
                                    <Image src="/assets/icons/calendar-edit.svg" alt="Calendar" width={24} height={24} />
                                    {exam.name}
                                </div>
                                <div className="flex items-center gap-2 text-black font-medium text-[16px]">
                                    <Image src="/assets/icons/timer-pause.svg" alt="Timer" width={24} height={24} />
                                    {exam.duration}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
