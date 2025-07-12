// watch-course/[id]/quiz/question/QuestionNavigation.tsx
import React from 'react';
import { Button } from '@/components/common/ui/Button2'; // Đảm bảo đây là đường dẫn đúng đến Button của bạn

interface QuestionNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  canGoPrevious,
  canGoNext,
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between gap-5">
        {/* Nút Previous */}
        <Button
          variant="ghost" // Sử dụng variant "ghost" cho nền trong suốt và chữ màu
          size="default" // Kích thước default phù hợp
          className="w-1/2 flex items-center justify-center" // Giữ các class căn giữa
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          {/* Previous Icon - Sử dụng SVG trực tiếp để dễ dàng tùy chỉnh màu và kích thước */}
          <svg className="w-5 h-5 text-[#3858F8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Previous
        </Button>

        {/* Nút Next */}
        <Button
          variant="ghost" // Sử dụng variant "ghost"
          size="default" // Kích thước default
          className="w-1/2 flex items-center justify-center" // Giữ các class căn giữa
          onClick={onNext}
          disabled={!canGoNext}
        >
          Next
          {/* Next Icon - Sử dụng SVG trực tiếp */}
          <svg className="w-5 h-5 text-[#3858F8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </Button>
      </div>

      {/* Nút Submit */}
      <Button
        variant="default" // Sử dụng variant "default" cho nút chính
        size="lg" // Kích thước lớn hơn một chút để trông nổi bật
        className="w-full flex items-center justify-center" // Căn giữa nội dung
        onClick={onSubmit}
      >
        {/* Submit Icon - Icon Checkmark */}
        <svg className="w-6 h-6 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Submit
      </Button>
    </div>
  );
};