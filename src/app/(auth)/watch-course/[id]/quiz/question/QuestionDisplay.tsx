// watch-course/[id]/quiz/question/QuestionDisplay.tsx
import React from 'react';
import { QuestionData } from '@/types/quiz'; // Đảm bảo đường dẫn này chính xác
import { OptionItem } from './OptionItem';
import Image from 'next/image';

interface QuestionDisplayProps {
  question: QuestionData;
  selectedAnswers: Set<string>;
  onSelectAnswer: (optionId: string, isMultipleAnswer: boolean) => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswers,
  onSelectAnswer,
}) => {
  const isMultipleAnswer = question.choicesConfig.isMultipleAnswer;

  return (
    <div className="flex flex-col gap-8">
      {/* Hiển thị questionNumber và points */}
      <div className="flex items-baseline gap-2">
        {' '}
        {/* Sử dụng flex và items-baseline để căn chỉnh "Question 4" và "(10 points)" */}
        <div className="text-2xl font-semibold text-[#3858F8] leading-7  ">
          Question {question.questionNumber}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {' '}
        {/* Giữ nguyên gap-8 giữa tiêu đề và các tùy chọn */}
        {/* Hiển thị title của câu hỏi */}
        <div className="text-xl font-medium text-[#0D0D0D] leading-6">{question.title}</div>
        {/* Hiển thị hình ảnh nếu có */}
        {question.questionImage && typeof question.questionImage === 'string' && (
          <Image
            src={question.questionImage}
            alt="Question"
            className="max-w-full h-auto rounded-lg"
          />
        )}
        <div className="flex flex-col gap-4">
          {question.options.map(option => (
            <OptionItem
              key={option.id}
              option={option}
              isSelected={selectedAnswers.has(option.id)}
              onSelect={id => onSelectAnswer(id, isMultipleAnswer)}
              isMultipleAnswer={isMultipleAnswer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};