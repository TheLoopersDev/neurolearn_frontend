// app/(auth)/dashboard/create-quiz/_components/QuizCard.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { Quiz } from './types';

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const handleMoreOptionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('More options for quiz:', quiz._id);
    // TODO: Implement dropdown menu
  };

  const numberOfQuestions = quiz.totalQuestions ?? quiz.questions?.length ?? 0;

  return (
    <Link
      href={`/dashboard/create-quiz/builder/${quiz._id}`}
      className="block bg-white rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden group "
      // Bỏ flex flex-col ở đây vì chúng ta sẽ dùng grid cho phần nội dung
    >
      {/* Phần nội dung của card giờ sẽ được chia bằng CSS Grid mới */}
      {/* Chúng ta cần một container chung cho cả ảnh và text để áp dụng grid chính */}
      <div className="p-3 grid grid-cols-3 grid-rows-auto  gap-x-3 gap-y-1 min-h-[160px]">
        {' '}
        {/* grid-rows-auto cho phép nội dung quyết định chiều cao hàng, gap-x, gap-y */}
        {/* 1. Ảnh (Cột 1, chiếm 2 hàng nếu có không gian, hoặc điều chỉnh) */}
        <div className="relative w-full h-full row-span-2 sm:row-span-2 aspect-square sm:aspect-auto bg-gray-200 rounded-md overflow-hidden self-start">
          {' '}
          {/* self-start để ảnh không bị kéo giãn quá mức */}
          <Image
            // src={quiz.imageUrl || '/assets/create-quiz/thumbnail.png'}
            src={'/assets/create-quiz/thumbnail.png'}
            alt={quiz.name || 'Quiz thumbnail'}
            fill
            sizes="(max-width: 768px) 30vw, 100px" // Điều chỉnh sizes cho phù hợp với kích thước ảnh trong card
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {/* 2. Category (Cột 2, Hàng 1) */}
        {quiz.category && (
          <div className="col-start-2 row-start-1 flex items-center">
            <span
              className={`inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap ${
                quiz.category === 'Grapic Design'
                  ? 'bg-blue-100 text-blue-700'
                  : quiz.category === 'Web Development'
                    ? 'bg-emerald-100 text-emerald-700'
                    : quiz.category === 'Data Science'
                      ? 'bg-amber-100 text-amber-700'
                      : quiz.category === 'UX Design'
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {quiz.category}
            </span>
          </div>
        )}
        {/* 3. Dấu 3 chấm (Cột 3, Hàng 1, căn phải) */}
        <div className="col-start-3  row-start-1 flex justify-end items-center">
          <button
            className="p-1 bg-white/50 hover:bg-gray-100 rounded-full transition-opacity"
            onClick={handleMoreOptionsClick}
            title="More options"
          >
            <MoreHorizontal size={16} className="text-gray-500 font-bold " />
          </button>
        </div>
        {/* 4. Title (Cột 2 & 3, Hàng 2) */}
        <h3 className="col-span-2 col-start-2 pr-30 row-start-2 text-sm sm:text-[15px] font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {quiz.name}
        </h3>
        {/* 5. Thông tin chi tiết (Exam Title, Question, Duration - Cột 1 đến 3, Hàng 3) */}
        <div className="col-span-3 flex gap-6 row-start-3 text-xs text-gray-500 space-y-0.5 mt-1">
          <div className="flex items-center gap-1.5">
            <Image
              src="/assets/create-quiz/sort.svg"
              alt="Exam Title Icon"
              width={11}
              height={11}
            />
            <p className="truncate">
              Exam Title:{' '}
              <span className="font-medium text-blue-600">{quiz.examTitle || quiz.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Image
              src="/assets/create-quiz/element-equal.svg"
              alt="Questions Icon"
              width={11}
              height={11}
            />
            <p>
              Questions:{' '}
              <span className="font-medium text-blue-600">{numberOfQuestions} Sentences</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Image src="/assets/create-quiz/timer.svg" alt="Duration Icon" width={11} height={11} />
            <p>
              Duration: <span className="font-medium text-blue-600">{quiz.duration || 'N/A'}</span>
            </p>
          </div>
        </div>
        {/* 6. Thanh Progress (Cột 1 & 2, Hàng 4) */}
        {quiz.progress !== undefined && (
          <div className="col-span-2 row-start-4 flex items-center mt-1">
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-2.5 bg-blue-500" style={{ width: `${quiz.progress}%` }}></div>
            </div>
          </div>
        )}
        {/* 7. Phần trăm Progress (Cột 3, Hàng 4, căn phải) */}
        {quiz.progress !== undefined && (
          <div className="col-start-3 row-start-4 flex justify-end items-center mt-1">
            <p className="text-md font-bold pr-5 text-blue-500">{quiz.progress}%</p>
          </div>
        )}
        {/* 8. Creation Date (Cột 1 & 2, Hàng 5) */}
        <div className="col-span-3 sm:col-span-2 row-start-5 flex items-start mt-1">
          {' '}
          {/* items-end để đẩy xuống cuối hàng nếu hàng cao hơn */}
          <p className="text-[11px] font-semibold sm:text-[11px] text-gray-400 flex gap-1">
            Creation Date: <p className="text-blue-600">{quiz.createdAt || 'N/A'}</p>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default QuizCard;
