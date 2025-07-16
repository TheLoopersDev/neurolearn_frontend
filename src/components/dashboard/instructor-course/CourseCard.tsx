import React from 'react';
import { CourseHeader } from './CourseHeader';
import { CourseDetails } from './CourseDetails';

import { Course } from '@/types/course';

interface CourseCardProps {
    course: Course;
}


export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const {
        _id,
        name,
        thumbnail,
        category,
        purchased,
        createdAt,
        estimatedPrice,
        price,
        isPublished,
    } = course;

    return (
        <article className="relative flex gap-2 p-3 w-[310px] h-[394px] bg-white rounded-[20px] shadow-md overflow-hidden">
            <div className="object-contain absolute inset-0 z-0 self-start aspect-[0.9] fill-white min-w-60 w-[330px]" />
            <div className="z-0 my-auto min-w-60 w-[332px]">
                <CourseHeader
                    courseId={_id.toString()}
                    thumbnailImage={thumbnail || ''}
                    category={typeof category === 'string' ? category : category?.title || 'Uncategorized'}
                    title={name}
                />
                <CourseDetails
                    memberCount={`Join ${purchased || 0}+ Member`}
                    creationDate={new Date(createdAt).toLocaleDateString('vi-VN')}
                    originalPrice={`${estimatedPrice || 0} VND`}
                    salePrice={`${price || 0} VND`}
                    status={isPublished ? 'Published' : 'Draft'}
                />
            </div>
        </article>
    );
};

