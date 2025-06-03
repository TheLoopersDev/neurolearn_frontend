import CourseCard from '@/components/common/ui/CourseCard';
import CourseContent from '@/components/common/ui/CourseContent';
import CourseDetail from '@/components/common/ui/CourseDetail';
import InstructorInfo from '@/components/common/ui/InstuctorInfo';
import OverView from '@/components/common/ui/OverView';
import PublisherCard from '@/components/common/ui/PublisherCard';
import Rating from '@/components/common/ui/Rating';
import Review from '@/components/common/ui/Review';
import SuggestedCourse from '@/components/common/ui/SuggestedCourse';
import Image from 'next/image';
import React from 'react';

function page() {
  return (
    <div className="max-w-full mx-auto p-20 bg-[#F7F8FA]">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Nội dung chính khóa học */}
        <div className="w-full lg:w-[70%] space-y-10">
          {/* Banner */}
          <Image src="/assets/images/banner.png" alt="Banner" width={1200} height={480} />
          {/* Info: Giảng viên + Like + Share */}
          <div className="flex items-start">
            <InstructorInfo />
          </div>
          {/* Mô tả */}
          <CourseDetail />
          {/* Course Detail */}
          <CourseContent />
          {/* Review */}
          <Review />
        </div>
        {/* RIGHT: Sidebar */}
        <div className="w-full lg:w-[30%] space-y-15">
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
    </div>
  );
}

export default page;
