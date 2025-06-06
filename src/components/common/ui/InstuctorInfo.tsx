'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function InstructorInfo({ instructor, courseName }: { instructor: any, courseName: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="max-w-full rounded-2xl">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-black mb-6 leading-snug">
        {courseName || 'Graphic Design Master – Learn GREAT Design'}
      </h1>

      {/* Profile and Stats Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Profile Info */}
        <div className="flex items-center gap-4 flex-1 min-w-[250px]">
          <Image
            src={
              imageError
                ? '/assets/images/placeholder-teacher.jpg'
                : instructor?.avatar?.url || '/assets/images/teacher.jpg'
            }
            alt="Instructor"
            width={50}
            height={50}
            className="rounded-full object-cover"
            onError={() => setImageError(true)}
          />
          <div>
            <div className="text-black font-semibold text-lg">{instructor?.name || 'Unknown Instructor'}</div>
            <div className="text-gray-600 text-sm">{instructor?.profession || 'Expert'}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-black">
            <Image src="/assets/icons/heart.svg" alt="Heart Icon" width={20} height={20} />
            <span>{instructor?.likes || 300} Likes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-black">
            <Image src="/assets/icons/upload-file.svg" alt="Share Icon" width={20} height={20} />
            <span>Share</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
      <div className="text-gray-700 text-base leading-relaxed space-y-4 mb-6">
        <p>{instructor?.introduce || 'No introduction provided by instructor.'}</p>
        <a href="#" className="inline-block text-blue-600 font-medium hover:underline">
          View all &gt;
        </a>
      </div>
    </div>
  );
}
