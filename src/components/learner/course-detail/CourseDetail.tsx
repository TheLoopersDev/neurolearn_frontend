'use client';

import Image from 'next/image';

export default function CourseDetail({ course }: { course: any }) {
  return (
    <div className="text-3xl font-bold text-black max-w-full mx-auto bg-[#F7F8FA] rounded-xl">
      <div className="pb-4">Course detail</div>
      <div className="flex justify-between gap-4 w-full">
        <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
          Lesson
          <div className="flex items-center gap-2 text-black mt-2">
            <Image src="/assets/icons/play.svg" alt="Play Icon" width={24} height={24} />
            <span>{course?.totalLessons ?? 0}</span>
          </div>
        </div>
        <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
          Duration
          <div className="flex items-center gap-2 text-black mt-2">
            <Image src="/assets/icons/clock.svg" alt="Clock Icon" width={24} height={24} />
            <span>{course?.durationText || 'N/A'}</span>
          </div>
        </div>
        <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
          Skill level
          <div className="flex items-center gap-2 text-black mt-2">
            <Image src="/assets/icons/sort.svg" alt="Sort Icon" width={24} height={24} />
            <span>{course?.level ?? 'All levels'}</span>
          </div>
        </div>
        <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
          Purchased
          <div className="flex items-center gap-2 text-black mt-2">
            <Image src="/assets/icons/eye.svg" alt="Eye Icon" width={24} height={24} />
            <span>{course?.purchased ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
