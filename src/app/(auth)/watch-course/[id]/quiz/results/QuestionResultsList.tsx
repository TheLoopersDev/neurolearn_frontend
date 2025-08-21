// watch-course/[id]/quiz/results/QuestionResultsList.tsx
import React from 'react';
import { QuestionResultItemData } from '@/types/quiz';
import { Card } from '../ui/Card';

type ResultWithId = QuestionResultItemData & { __resultId: string };

interface QuestionResultsListProps {
  results: ResultWithId[];
  onQuestionSelect: (questionId: string) => void;
  selectedQuestionId: string | null; // giữ nguyên chữ ký props (không dùng đến trong UI này)
}

export const QuestionResultsList: React.FC<QuestionResultsListProps> = ({
  results,
  onQuestionSelect,
}) => {
  const rawNumbers = results.map((it) =>
    Number((it as any)?.questionData?.questionNumber ?? it?.questionNumber)
  );
  const freq = new Map<number, number>();
  for (const n of rawNumbers) if (Number.isFinite(n) && n > 0) freq.set(n, (freq.get(n) || 0) + 1);

  const getDisplayNumber = (idx: number) => {
    const n = rawNumbers[idx];
    if (!Number.isFinite(n) || n <= 0) return idx + 1;
    if ((freq.get(n) || 0) > 1) return idx + 1;
    return n;
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-semibold text-[#3858F8] leading-7">Question list</div>

        <div className="grid grid-cols-4 gap-3">
          {results.map((item, idx) => {
            const itemId = item.__resultId;
            const displayNumber = getDisplayNumber(idx);

            // Màu nền / chữ theo status giống cách bạn đang làm
            let bg = '';
            let txt = 'text-white';
            switch (item.status) {
              case 'correct':
                bg = 'bg-[#00CE9C]';
                break;
              case 'incorrect':
                bg = 'bg-[#FF7410]';
                break;
              default:
                bg = 'bg-[#F7F8FA]';
                txt = 'text-[#6B6B6B]';
            }

            return (
              <div
                key={itemId}
                role="button"
                tabIndex={0}
                aria-label={`Question ${displayNumber}`}
                title={`Q${displayNumber} - ${item.status}`}
                onClick={() => onQuestionSelect(itemId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onQuestionSelect(itemId);
                }}
                className={`
                  flex items-center justify-center
                  w-14 h-14 rounded-lg text-xl font-medium leading-6
                  cursor-pointer transition-all duration-200 ease-in-out
                  hover:opacity-80
                  ${bg} ${txt}
                `}
              >
                {displayNumber}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
