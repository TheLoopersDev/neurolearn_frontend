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
      <div className="grid grid-cols-4 gap-20"> {/* Tăng gap từ 3 lên 4 */}
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const isCurrentQuestion = i === currentQuestionIndex;
          const isCompleted = completedQuestions.has(i);

          // Định nghĩa các class cơ bản
          let itemClasses = `
            flex items-center justify-center
            w-16 h-16 rounded-xl text-xl font-medium leading-6
            cursor-pointer transition-all duration-200 ease-in-out
            hover:opacity-90 hover:scale-105
          `;

          // Áp dụng style dựa trên trạng thái
          if (isCompleted && !isCurrentQuestion) {
            itemClasses += ' bg-[#3858F8] text-white shadow-md';
          } else if (isCurrentQuestion) {
            itemClasses += ' bg-white text-[#3858F8] border-2 border-[#3858F8] shadow-md';
          } else {
            itemClasses += ' bg-[#F7F8FA] text-[#6B6B6B] hover:bg-[#EDEFF5]';
          }

          return (
            <div
              key={i}
              className={itemClasses}
              onClick={() => onQuestionSelect(i)}
              aria-label={`Question ${i + 1}`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};