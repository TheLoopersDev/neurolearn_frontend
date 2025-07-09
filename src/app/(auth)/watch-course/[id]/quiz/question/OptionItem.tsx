// watch-course/[id]/quiz/question/OptionItem.tsx
import React from 'react';
import { AnswerOptionData } from '@/types/quiz'; // Đảm bảo đường dẫn này chính xác

interface OptionItemProps {
  option: AnswerOptionData;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
  isMultipleAnswer?: boolean; // Vẫn giữ prop này cho trường hợp checkbox
}

export const OptionItem: React.FC<OptionItemProps> = ({ option, isSelected, onSelect, isMultipleAnswer = false }) => {
  return (
    <div
      // Thay đổi padding dọc của container chính
      // Giảm py-2, tăng pl-4 pr-6 để giữ khoảng cách ngang
      className={`relative w-full py-1 pl-4 pr-6 rounded-xl cursor-pointer transition-colors duration-200
        bg-white shadow-sm hover:bg-gray-50`} // Nền trắng, bóng nhẹ, hover xám nhạt
      onClick={() => onSelect(option.id)}
    >
      {/* Thanh màu xanh bên trái khi được chọn */}
      {isSelected && (
        <div
          // Điều chỉnh chiều cao của thanh xanh để khớp với chiều cao mới của option
          // Đảm bảo nó vẫn nằm trong container và có thể sử dụng h-full hoặc một giá trị cụ thể
          className="absolute left-2 top-1/2 -translate-y-1/2 h-[calc(100%-8px)] w-2.5 rounded-xl bg-[#3858F8]"
          // h-[calc(100%-8px)] để chừa 4px padding trên và 4px padding dưới của div cha
        ></div>
      )}

      <div
        // Giảm padding dọc của container nội dung
        className={`flex items-center justify-between py-1 px-4`} // Điều chỉnh padding nội dung
      >
        <div
          // Giảm chiều cao của div chứa text
          className={`flex-grow flex items-center h-12
            ${isSelected ? 'text-[#0D0D0D]' : 'text-[#6B6B6B]'}
            text-base font-medium leading-5`}
        >
          {option.text}
        </div>

        {/* Custom Radio/Checkbox Button */}
        {isMultipleAnswer ? (
          // Checkbox cho multiple-choice (giữ nguyên)
          <div
            className={`w-6 h-6 rounded border-[1.5px] flex-shrink-0 flex items-center justify-center
              ${isSelected ? 'border-[#3858F8] bg-[#3858F8]' : 'border-[#D9D9D9] bg-white'}`}
          >
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        ) : (
          // Radio button cho single-choice (giữ nguyên)
          <div
            className={`w-6 h-6 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center
              ${isSelected ? 'border-[#3858F8]' : 'border-[#D9D9D9]'}`}
          >
            {isSelected && (
              <div className="w-4 h-4 rounded-full bg-[#3858F8]"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};