import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types/course';
import { useState } from 'react';


interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Hàm format: luôn sử dụng VND, đơn vị ở SAU số + loại bỏ thập phân thừa
  const formatPrice = (raw: number) => {
    const value = Math.round(raw); // VND không có thập phân

    const nf = new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const core = nf.format(value);
    const suffix = " VNĐ";
    return core + suffix;
  };

  return (
    <Link href={`/courses/${course._id}`} className="relative block w-[311px] sm:w-[280px] md:w-[300px] lg:w-[311px] mx-auto sm:mx-0">
      {/* Top Right Icons */}
      <div className="absolute top-0 right-0 z-30 flex space-x-1">
        {/* <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <Image src="/assets/home/Heart.svg" alt="Heart" width={20} height={20} />
        </div> */}
      </div>
      <div
        className="relative z-10 h-[280px] sm:h-[300px] md:h-[316px] rounded-[18px] sm:rounded-[19px] md:rounded-[20px] bg-white shadow-10xl transition-all duration-300 overflow-hidden p-2.5 sm:p-3 
                      mask-[url('/assets/home/Subtract.svg')] mask-no-repeat mask-size-cover
                      hover:shadow-xl hover:scale-[1.015]"
      >
        {/* Avatar + Instructor Info */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gray-300">
            <Image
              src={
                imageError
                  ? '/assets/images/placeholder-teacher.jpg'
                  : course.publisher?.avatar?.url || '/assets/images/teacher.jpg'
              }
              alt="Instructor"
              width={32}
              height={32}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="leading-tight text-xs sm:text-sm">
            <p className="text-gray-900 font-semibold line-clamp-1">{course?.publisher?.name}</p>
            <p className="text-[10px] sm:text-xs text-gray-700 line-clamp-1">{course?.publisher?.role || 'Instructor'}</p>
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="absolute top-[45px] sm:top-[48px] md:top-[50px] left-[2.5%] sm:left-[3%] w-[95%] sm:w-[94%] h-[36%] sm:h-[37%] md:h-[38%] rounded-[15px] sm:rounded-[16px] overflow-hidden">
          <Image
            src={imageError ? '/assets/images/placeholder-course.jpg' : course?.thumbnail?.url}
            alt={course?.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Title & Description */}
        <div className="absolute bottom-[75px] sm:bottom-[78px] md:bottom-[80px] left-[2.5%] sm:left-[3%] md:left-[3.5%] right-[2.5%] sm:right-[3%] md:right-[3.5%]">
          <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#0D0D0D] leading-[20px] sm:leading-[22px] line-clamp-2">
            {course?.name}
          </h3>
          <p className="text-[11px] sm:text-[12px] text-[#6B6B6B] leading-[14px] sm:leading-[15px] mt-1 line-clamp-2">
            {course?.description}
          </p>
        </div>

        {/* Ratings & Pricing */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-[2.5%] sm:left-[3%] md:left-[3.5%] right-[2.5%] sm:right-[3%] md:right-[3.5%] space-y-1">
          <div className="flex justify-between text-[10px] sm:text-xs text-[#0D0D0D]">
            <div className="flex items-center gap-1">
              <Image src="/assets/home/star.svg" alt="Star" width={10} height={10} className="sm:w-3 sm:h-3" />
              <span className="text-[10px] sm:text-xs">{course?.rating.toFixed(1)}</span>
              <span className="text-[#6B6B6B] ml-1 text-[9px] sm:text-[10px] sm:text-xs">({course?.purchased} reviews)</span>
            </div>
            <span className="text-[#6B6B6B] line-through text-[9px] sm:text-[10px] sm:text-xs">
              {typeof course?.estimatedPrice === "number"
                ? formatPrice(course.estimatedPrice)
                : ""}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] sm:text-[10px] sm:text-xs text-[#0D0D0D]">200 Review rating</span>
            <span className="text-[#3858F8] text-[15px] sm:text-[16px] font-semibold">
              {course?.isFree ? "Free" : formatPrice(course?.price || 0)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
