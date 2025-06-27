import React from 'react';
import { CourseHeader } from './CourseHeader';
import { CourseDetails } from './CourseDetails';

interface CourseCardProps {
    courseId: string;
    thumbnailUrl: string;
    category: { title: string };
    name: string;
    purchased: number;
    createdAt: string;
    estimatedPrice: number;
    price: number;
    isPublished: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    courseId,
    thumbnailUrl,
    name,
    category,
    purchased,
    createdAt,
    estimatedPrice,
    price,
    isPublished
}) => {
    return (
        <article className="relative flex gap-2 p-3 w-[310px] h-[394px] bg-white rounded-[20px] shadow-md overflow-hidden">
            <div
                className="object-contain absolute inset-0 z-0 self-start aspect-[0.9] fill-white min-w-60 w-[330px]"
            />
            <div className="z-0 my-auto min-w-60 w-[332px]">
                <CourseHeader
                    courseId={courseId}
                    thumbnailImage={thumbnailUrl}
                    category={category?.title || 'Uncategorized'}
                    title={name}
                />
                <CourseDetails
                    memberCount={`Join ${purchased}+ Member`}
                    creationDate={createdAt}
                    originalPrice={`${estimatedPrice} VND`}
                    salePrice={`${price} VND`}
                    status={isPublished ? 'Published' : 'Draft'}
                />
            </div>
        </article>
    );
};
