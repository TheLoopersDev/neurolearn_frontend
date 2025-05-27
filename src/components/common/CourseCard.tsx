"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types/course';
import { StarIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/courses/${course._id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
        <div className="relative h-48 w-full">
          <Image
            src={imageError ? '/assets/images/placeholder-course.jpg' : course.thumbnail.url}
            alt={course.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 h-14">{course.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">{course.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-sm text-gray-600">{course.rating.toFixed(1)}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm text-gray-600">{course.purchased} students</span>
            </div>
            <div className="text-lg font-semibold text-primary">
              {course.isFree ? 'Free' : `$${course.price}`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
