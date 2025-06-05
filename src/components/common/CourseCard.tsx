// "use client";

// import Image from 'next/image';
// import Link from 'next/link';
// import { Course } from '@/types/course';
// import { StarIcon } from '@heroicons/react/24/solid';
// import { useState } from 'react';

// interface CourseCardProps {
//   course: Course;
// }

// const CourseCard = ({ course }: CourseCardProps) => {
//   const [imageError, setImageError] = useState(false);

//   return (
//     <Link href={`/courses/${course._id}`} className="block h-full">
//       <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
//         <div className="relative h-48 w-full">
//           <Image
//             src={imageError ? '/assets/images/placeholder-course.jpg' : course.thumbnail.url}
//             alt={course.name}
//             fill
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             className="object-cover transition-transform duration-300 hover:scale-105"
//             onError={() => setImageError(true)}
//           />
//         </div>
//         <div className="p-4 flex flex-col flex-grow">
//           <h3 className="text-lg font-semibold mb-2 line-clamp-2 h-14">{course.name}</h3>
//           <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">{course.description}</p>
//           <div className="flex items-center justify-between mt-auto">
//             <div className="flex items-center">
//               <StarIcon className="h-5 w-5 text-yellow-400" />
//               <span className="ml-1 text-sm text-gray-600">{course.rating.toFixed(1)}</span>
//               <span className="mx-2 text-gray-300">|</span>
//               <span className="text-sm text-gray-600">{course.purchased} students</span>
//             </div>
//             <div className="text-lg font-semibold text-primary">
//               {course.isFree ? 'Free' : `$${course.price}`}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default CourseCard;
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Course } from '@/types/course';
import { HeartIcon } from '@heroicons/react/24/outline';
import { BellIcon, StarIcon } from '@heroicons/react/24/solid';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/courses/${course._id}`} className="block">
      <div className="relative w-[311px] h-[316px] bg-white rounded-[20px] shadow-md p-3 overflow-hidden group transition hover:shadow-lg hover:-translate-y-1 duration-300">

        {/* Top Right Icons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow">
            <HeartIcon className="h-5 w-5 text-gray-700" />
          </div>
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow">
            <BellIcon className="h-5 w-5 text-gray-700" />
          </div>
        </div>

        {/* Avatar + Name */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <Image
              src="/assets/images/teacher.jpg"
              alt="avatar"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div className="text-sm leading-tight">
            <div className="font-semibold text-gray-900">Đào Tuấn Kiệt</div>
            <div className="text-xs text-gray-700">Instructional Expert</div>
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="absolute top-[50px] left-[3%] w-[94%] h-[38%] rounded-[16px] overflow-hidden">
          <Image
            src={imageError ? '/assets/images/placeholder-course.jpg' : course.thumbnail.url}
            alt={course.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Title + Description */}
        <div className="absolute bottom-[80px] left-[3.5%] right-[3.5%] text-right">
          <h3 className="text-[16px] font-semibold text-[#0D0D0D] leading-[22px] line-clamp-2">
            {course.name}
          </h3>
          <p className="text-[12px] text-[#6B6B6B] leading-[15px] mt-1 line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-3 left-[3.5%] right-[3.5%] text-right space-y-2">
          <div className="flex items-center justify-between text-sm text-[#0D0D0D]">
            <div className="flex items-center gap-1">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <span className="text-xs">{course.rating.toFixed(1)}</span>
              <span className="text-xs text-[#6B6B6B] ml-2">({course.purchased} reviews)</span>
            </div>
            {/* <div className="text-xs text-[#6B6B6B] line-through">{course.originalPrice} VNĐ</div> */}
            <div className="text-xs text-[#6B6B6B] line-through">1000 VNĐ</div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#6B6B6B]">200 đánh giá</span>
            <span className="text-primary text-[16px] font-semibold">{course.isFree ? 'Free' : `${course.price} VNĐ`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
