'use client';

import Image from 'next/image';

interface CourseCardProps {
  course: {
    price?: number;
    estimatedPrice?: number;
    isFree?: boolean;
    durationText?: string;
    totalLessons?: number;
    purchased?: number;
  };
}

export default function CourseCard({ course }: { course: CourseCardProps['course'] }) {
  const discount =
    typeof course.estimatedPrice === 'number' && typeof course.price === 'number'
      ? Math.round(((course.estimatedPrice - course.price) / course.estimatedPrice) * 100)
      : 0;

  return (
    <div className="w-[395px] bg-white rounded-2xl max-w-full mx-auto">
      <div className="flex justify-between items-start">
        {/* LEFT: Giá gốc và tên khóa */}
        <div className="bg-white rounded-t-2xl pl-4 pt-4">
          <div className="w-[250px] h-[50px] space-y-2">
            <p className="text-xl text-black">Full course</p>
            {course.estimatedPrice && (
              <div className="text-xl text-gray-400 line-through">
                {course.estimatedPrice.toLocaleString()} $
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Tag giảm giá */}
        {discount > 0 && (
          <div className="w-[145px] h-[75px] bg-[#F7F8FA] flex items-center justify-center rounded-bl-2xl">
            <span className="bg-[#3858F8] text-white text-base font-medium rounded-full w-[86px] h-[30px] flex items-center justify-center">
              {discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Course includes */}
      <div className="text-black pb-4">
        <div className="text-sm space-y-4 px-4">
          <div className="text-4xl text-[#3858F8] mt-2">
            {course.isFree
              ? 'Free'
              : `$${(course.price ?? 0).toLocaleString()}`}

          </div>

          <div className="text-black text-2xl">Course includes</div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/play.svg" alt="Play" width={20} height={20} />
            {course.durationText || '0h 0m'} video on-demand
          </div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/article.svg" alt="Article" width={20} height={20} />
            {course.totalLessons || 0} lessons
          </div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/download-file.svg" alt="Download" width={20} height={20} />
            Downloadable resources
          </div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/document.svg" alt="Document" width={20} height={20} />
            Practice test
          </div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/upload-file.svg" alt="Upload" width={20} height={20} />
            Practical sharing article
          </div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/completion.svg" alt="Certificate" width={20} height={20} />
            Certificate of Completion
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 px-4 h-[60px]">
        <button className="flex-1 h-14 bg-[#3858F8] text-white text-xl rounded-lg hover:bg-blue-700 transition">
          Add to cart
        </button>
        <Image
          src="/assets/icons/bookmark.svg"
          alt="Bookmark"
          className="bg-[#ECECEC] h-14 w-14 rounded-md p-2"
          width={30}
          height={30}
        />
      </div>

      <button className="w-[calc(100%-32px)] h-14 mx-4 my-4 text-center text-xl text-[#3858F8] font-bold rounded-lg bg-[#ECECEC] hover:bg-gray-200 transition">
        Buy now
      </button>
    </div>
  );
}
