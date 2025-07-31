"use client";

import Image from "next/image";
import React from "react";
import CardOption from "@/components/dashboard/instructor-course/CardOption";
import tag from "@/public/assets/dashboard/course/tag.svg";

interface CourseHeaderProps {
    thumbnailImage: string;
    category: string;
    title: string;
    courseId: string; // Thêm courseId
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
    thumbnailImage,
    category,
    title,
    courseId
}) => {
    return (
        <header className="w-full flex flex-col justify-between h-full">
            <div className="w-full text-xs font-medium leading-none text-blue-600">
                <Image
                    src={thumbnailImage || '/assets/business/book.svg'}
                    alt="Course thumbnail"
                    width={600} // gấp 2 lần hiển thị để retina không mờ
                    height={320}
                    className="w-full h-[160px] object-cover rounded-2xl"
                    priority
                />
                <div className="flex justify-between items-center w-full max-w-[323px] mt-2">
                    <div className="flex gap-2 items-center">
                        <Image src={tag} alt="Tag icon" width={16} height={16} />
                        <span className="text-[#3858F8] text-sm font-medium">{category}</span>
                    </div>
                    <CardOption courseId={courseId} />
                </div>
            </div>
            <h2 className="w-full text-base font-semibold leading-5 text-stone-950 line-clamp-2 min-h-[40px]">
                {title}
            </h2>
        </header>
    );
};
