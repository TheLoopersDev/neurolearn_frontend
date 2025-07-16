import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types/course';
import { useState } from 'react';


interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);




  return (
    <Link href={`/courses/${course._id}`} className="relative block w-[311px]">
      {/* Top Right Icons */}
      <div className="absolute top-0 right-0 z-30 flex space-x-1 ">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <Image src="/assets/home/Heart.svg" alt="Heart" width={20} height={20} />
        </div>
      </div>
      <div
        className="relative z-10 h-[316px] rounded-[20px] bg-white shadow-10xl transition-all duration-300 overflow-hidden p-3 
                      mask-[url('/assets/home/Subtract.svg')] mask-no-repeat mask-size-cover
                      hover:shadow-xl hover:scale-[1.015]"
      >
        {/* Avatar + Instructor Info */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
            <Image
              src={
                imageError
                  ? '/assets/images/placeholder-teacher.jpg'
                  : course.author?.avatar?.url || '/assets/images/teacher.jpg'
              }
              alt="Instructor"
              width={32}
              height={32}
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="leading-tight text-sm">
            <p className="text-gray-900 font-semibold">{course?.author?.name}</p>
            <p className="text-xs text-gray-700">{course?.author?.profession || 'Instructor'}</p>
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="absolute top-[50px] left-[3%] w-[94%] h-[38%] rounded-[16px] overflow-hidden">
          <Image
            src={imageError ? '/assets/images/placeholder-course.jpg' : course?.thumbnail}
            alt={course?.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Title & Description */}
        <div className="absolute bottom-[80px] left-[3.5%] right-[3.5%]">
          <h3 className="text-[16px] font-semibold text-[#0D0D0D] leading-[22px] line-clamp-2">
            {course?.name}
          </h3>
          <p className="text-[12px] text-[#6B6B6B] leading-[15px] mt-1 line-clamp-2">
            {course?.description}
          </p>
        </div>

        {/* Ratings & Pricing */}
        <div className="absolute bottom-3 left-[3.5%] right-[3.5%] space-y-1">
          <div className="flex justify-between text-xs text-[#0D0D0D]">
            <div className="flex items-center gap-1">
              <Image src="/assets/home/star.svg" alt="Star" width={12} height={12} />
              <span>{course?.rating.toFixed(1)}</span>
              <span className="text-[#6B6B6B] ml-1">({course?.purchased} reviews)</span>
            </div>
            <span className="text-[#6B6B6B] line-through">{course?.estimatedPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#0D0D0D]">200 Review rating</span>
            <span className="text-[#3858F8] text-[16px] font-semibold">
              {course?.isFree ? 'Free' : `${course?.price} $`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
