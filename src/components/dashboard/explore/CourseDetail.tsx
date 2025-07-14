'use client';

import Image from "next/image";


export default function CourseDetail() {
  return (
    <div className="text-3xl font-bold text-black max-w-full mx-auto bg-[#F7F8FA] rounded-xl">
  <div className="pb-4">Course detail</div>
  <div className="flex justify-between gap-4 w-full">
    <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
      Lession
      <div className="flex items-center gap-2 text-black mt-2">
        <Image src="/assets/icons/play.svg" alt="Play Icon" width={24} height={24} />
        <span>128</span>
      </div>
    </div>
    <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
      Duration
      <div className="flex items-center gap-2 text-black mt-2">
        <Image src="/assets/icons/clock.svg" alt="Clock Icon" width={24} height={24} />
        <span>56h 28m</span>
      </div>
    </div>
    <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
      Skill level
      <div className="flex items-center gap-2 text-black mt-2">
        <Image src="/assets/icons/sort.svg" alt="Sort Icon" width={24} height={24} />
        <span>Beginner</span>
      </div>
    </div>
    <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
      View
      <div className="flex items-center gap-2 text-black mt-2">
        <Image src="/assets/icons/eye.svg" alt="Eye Icon" width={24} height={24} />
        <span>12,450</span>
      </div>
    </div>
  </div>
</div>

  );
}