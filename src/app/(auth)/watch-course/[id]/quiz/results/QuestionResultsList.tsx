// watch-course/[id]/quiz/results/QuestionResultsList.tsx
import React from 'react';
import { QuestionResultItemData } from '@/types/quiz';
import { Card } from '../ui/Card'; // Assuming Card is in '../ui/Card'

interface QuestionResultsListProps {
  results: QuestionResultItemData[];
  onQuestionSelect: (questionId: string) => void;
  selectedQuestionId: string | null;
}

export const QuestionResultsList: React.FC<QuestionResultsListProps> = ({
  results,
  onQuestionSelect,
  selectedQuestionId,
}) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-semibold text-[#3858F8] leading-7">Question list</div>
        <div className="grid grid-cols-4 gap-3">
          {results.map((item) => {
            const isSelected = item.questionData.id === selectedQuestionId;
            let bgColor = '';
            let textColor = 'text-white'; // Default text color for colored backgrounds
            let borderColor = 'border-transparent'; // Default border color

            switch (item.status) {
              case 'correct':
                bgColor = 'bg-[#00CE9C]'; // Green
                break;
              case 'incorrect':
                bgColor = 'bg-[#FF7410]'; // Orange
                break;
              case 'skipped':
              default:
                bgColor = 'bg-[#F7F8FA]'; // Light gray
                textColor = 'text-[#6B6B6B]'; // Gray text for skipped/default
                break;
            }

            if (isSelected) {
              // Override colors if selected
              bgColor = 'bg-[#F7F8FA]'; // Light gray for selected
              textColor = 'text-[#6B6B6B]'; // Gray text for selected
              borderColor = 'border-2 border-[#3858F8]'; // Blue border for selected
            }

            return (
              <div
                key={item.questionData.id}
                className={`
                  flex items-center justify-center
                  w-12 h-12 rounded-lg text-xl font-medium leading-6
                  cursor-pointer transition-all duration-200 ease-in-out
                  hover:opacity-80
                  ${bgColor} ${textColor} ${borderColor}
                `}
                onClick={() => onQuestionSelect(item.questionData.id)}
              >
                {item.questionNumber}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};