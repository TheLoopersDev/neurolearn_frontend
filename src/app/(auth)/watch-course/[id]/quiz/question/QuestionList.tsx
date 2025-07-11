// watch-course/[id]/quiz/question/QuestionList.tsx
import React from 'react';

interface QuestionListProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  completedQuestions: Set<number>;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  totalQuestions,
  currentQuestionIndex,
  onQuestionSelect,
  completedQuestions,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl font-semibold text-[#3858F8] leading-7">Question list</div>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const isCurrentQuestion = i === currentQuestionIndex;
          const isCompleted = completedQuestions.has(i);

          // Định nghĩa các class cơ bản
          let itemClasses = `
            flex items-center justify-center
            w-14 h-14 rounded-lg text-xl font-medium leading-6
            cursor-pointer transition-all duration-200 ease-in-out
            hover:opacity-80
          `;

          // Áp dụng style dựa trên trạng thái
          if (isCompleted && !isCurrentQuestion) {
            // Câu hỏi đã hoàn thành (nhưng không phải câu hiện tại)
            itemClasses += ' bg-[#3858F8] text-white';
          } else if (isCurrentQuestion) {
            // Câu hỏi đang được chọn (hiện tại)
            itemClasses += ' bg-[#F7F8FA] text-[#6B6B6B] outline outline-2 outline-[#3858F8] outline-offset-[-1px]';
          } else {
            // Câu hỏi chưa hoàn thành và không phải câu hiện tại
            itemClasses += ' bg-[#F7F8FA] text-[#6B6B6B]';
          }

          return (
            <div
              key={i}
              className={itemClasses} // Sử dụng biến đã xây dựng các class
              onClick={() => onQuestionSelect(i)}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};