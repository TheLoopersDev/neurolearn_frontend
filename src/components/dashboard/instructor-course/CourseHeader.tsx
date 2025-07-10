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
        <header className="w-full">
            <div className="w-full text-xs font-medium leading-none text-blue-600">
                <Image
                    src={thumbnailImage}
                    alt="Course thumbnail"
                    width={306}
                    height={160}
                    className="object-contain w-full rounded-xl"
                />
                <div className="flex justify-between items-center w-full max-w-[323px] mt-2">
                    <div className="flex gap-2 items-center">
                        <Image src={tag} alt="Tag icon" width={16} height={16} />
                        <span className="text-[#3858F8] text-sm font-medium">{category}</span>
                    </div>

                    {/* Replace More icon with CardOption */}
                    <CardOption courseId={courseId} />
                </div>
            </div>
            <h2 className="w-full text-base font-semibold leading-5 text-stone-950">
                {title}
            </h2>
        </header>
    );
};
