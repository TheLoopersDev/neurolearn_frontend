'use client';

import Rating from '@/components/learner/course-detail/Rating';
import CourseDetail from '@/components/instructor/CourseDetail';
import TabMenu from '@/components/instructor/TabMenu';
import Image from 'next/image';
import React from 'react';

function page() {
  return (
    <div className="w-full bg-[#F7F8FA] px-4 sm:px-6 lg:px-20 py-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* LEFT: Nội dung chính khóa học */}
          <div className="w-full lg:w-[70%] space-y-10">
            {/* Banner */}
            <Image src="/assets/images/banner.png" alt="Banner" width={1200} height={480} />
            <TabMenu />
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-full lg:w-[30%] space-y-6">
            <CourseDetail />
            <Rating />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
