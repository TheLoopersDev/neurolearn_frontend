'use client';

import CourseContent from '@/components/instructor/CourseContent';
import TabMenu from '@/components/instructor/TabMenu';
import Image from 'next/image';
import React from 'react';


function page() {
  return (
    <div className="w-full bg-[#F7F8FA] py-20">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* LEFT: Nội dung chính khóa học */}
          <div className="w-full lg:w-[65%] space-y-10">
            {/* Banner */}
            <Image src="/assets/images/banner.png" alt="Banner" width={1200} height={480} />
            <TabMenu />
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-full lg:w-[35%] space-y-6">
            <CourseContent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
