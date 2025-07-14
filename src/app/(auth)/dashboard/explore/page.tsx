'use client';

import CourseCard from '@/components/dashboard/explore/CourseCard';
import CourseContent from '@/components/dashboard/explore/CourseContent';
import CourseDetail from '@/components/dashboard/explore/CourseDetail';
import CourseGrid from '@/components/dashboard/explore/CourseGrid';
import InstructorInfo from '@/components/dashboard/explore/InstructorInfo';
import OverView from '@/components/dashboard/explore/OverView';
import PublisherCard from '@/components/dashboard/explore/PublisherCard';
import Rating from '@/components/dashboard/explore/Rating';
import Review from '@/components/dashboard/explore/Review';
import SuggestedCourse from '@/components/dashboard/explore/SuggestedCourse';
import Image from 'next/image';
import React from 'react';

function page() {
  return (
    <div className="max-w-full mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Nội dung chính */}
        <div className="w-full lg:w-[70%] space-y-10">
          {/* Banner */}
          <Image src="/assets/images/banner.png" alt="Banner" width={1200} height={480} />
          {/* Info: Giảng viên + Like + Share */}
          <div className="flex items-start">
            <InstructorInfo />
          </div>
          {/* Mô tả */}
          <CourseDetail />
          {/* Nội dung khóa học */}
          <CourseContent />
          {/* Review */}
          <Review />
        </div>  {/* ← Đóng div của LEFT ở đây */}
        {/* RIGHT: Sidebar */}
        <div className="w-full lg:w-[30%] space-y-6">
          {/* Hộp giá tiền + nút mua */}
          <CourseCard />
          {/* Đánh giá Rating */}
          <Rating />
          {/* Publisher Info */}
          <PublisherCard />
          {/* Overview */}
          <OverView />
          {/* Suggested Course */}
          <SuggestedCourse />
        </div>
      </div>
      <CourseGrid title="Learners are viewing" />
    </div>
  );
}


export default page;