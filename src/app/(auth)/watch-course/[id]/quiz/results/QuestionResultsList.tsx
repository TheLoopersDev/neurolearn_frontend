import React from 'react';
import { QuestionResultItemData } from '@/types/quiz';
import { Card } from '../ui/Card';

type ResultWithId = QuestionResultItemData & { __resultId: string };

interface QuestionResultsListProps {
  results: ResultWithId[];
  onQuestionSelect: (questionId: string) => void;
  selectedQuestionId: string | null;
}

/** Width chuẩn giống QuestionList */
const SIDE_PANEL_WIDTH =
  'shrink-0 w-full sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[400px]';

export const QuestionResultsList: React.FC<QuestionResultsListProps> = ({
  results,
  onQuestionSelect,
  selectedQuestionId,
}) => {
  // Gom số câu, tránh đè số duplicate
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
    <Card className={`p-6 ${SIDE_PANEL_WIDTH}`}>
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-semibold leading-7 text-[#3858F8]">Question list</div>

        {/* Responsive grid — auto-fill min 56px, không cần dropdown */}
        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(56px,1fr))] gap-3 place-items-center">
          {results.map((item, idx) => {
            const itemId = item.__resultId;
            const displayNumber = getDisplayNumber(idx);
            const isSelected = selectedQuestionId === itemId;

            // Màu nền / chữ theo status
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
              <button
                type="button"
                key={itemId}
                aria-label={`Question ${displayNumber}`}
                title={`Q${displayNumber} - ${item.status}`}
                onClick={() => onQuestionSelect(itemId)}
                className={[
                  'flex h-14 w-14 items-center justify-center rounded-lg text-xl font-medium',
                  'transition-all duration-150 ease-in-out hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3858F8] focus-visible:ring-offset-2',
                  bg,
                  txt,
                  isSelected ? 'ring-2 ring-[#3858F8] ring-offset-2' : '',
                ].join(' ')}
              >
                {displayNumber}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
