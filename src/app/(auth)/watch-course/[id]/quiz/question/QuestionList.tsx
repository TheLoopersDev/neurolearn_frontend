// src/components/quiz/QuestionList.tsx
// NOTE: Adjust the Card import path if your folder differs.
// Mục tiêu: đồng bộ style với QuestionResultsList (grid auto-fill, chip 56px, bo góc lg).

import React, { memo, useId, useMemo } from 'react';
import { Card } from '../ui/Card';

type QuestionListProps = {
  totalQuestions: number;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  completedQuestions: Set<number>;
  className?: string;
};

/** Gộp className an toàn, không cần cài thêm lib */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/** Danh sách câu hỏi: responsive grid auto-fill, chip 56px, a11y */
export const QuestionList: React.FC<QuestionListProps> = memo(
  ({
    totalQuestions,
    currentQuestionIndex,
    onQuestionSelect,
    completedQuestions,
    className,
  }) => {
    const headingId = useId();

    // Tạo mảng số lượng câu hỏi (đảm bảo >= 0) — tránh tính lại mỗi render
    const items = useMemo(
      () => Array.from({ length: Math.max(0, totalQuestions) }),
      [totalQuestions]
    );

    return (
      <Card className={cn('p-6', className)}>
        {/* Wrapper dùng để gắn aria-labelledby, tránh lệch type của Card */}
        <div role="region" aria-labelledby={headingId}>
          <h2 id={headingId} className="text-2xl font-semibold leading-7 text-[#3858F8]">
            Question list
          </h2>

          {/* Responsive grid — auto-fill min 56px, khớp với ResultsList */}
          <ol className="mt-4 grid [grid-template-columns:repeat(auto-fill,minmax(56px,1fr))] gap-3 place-items-center">
            {items.map((_, i) => {
              const isCurrent = i === currentQuestionIndex;
              const isCompleted = completedQuestions.has(i);

              // Base style cho ô số (chip 56px, bo góc lg, a11y/focus)
              const base =
                'flex h-14 w-14 items-center justify-center rounded-lg text-xl font-medium ' +
                'transition-transform duration-150 focus:outline-none ' +
                'focus-visible:ring-2 focus-visible:ring-[#3858F8] focus-visible:ring-offset-2 ' +
                'hover:-translate-y-0.5 active:translate-y-0';

              // Style theo trạng thái (đồng bộ tone)
              const state = isCurrent
                ? 'bg-white text-[#3858F8] ring-2 ring-[#3858F8]'
                : isCompleted
                  ? 'bg-[#3858F8] text-white'
                  : 'bg-[#F7F8FA] text-[#6B6B6B] hover:bg-[#EDEFF5]';

              // Nhãn a11y mô tả trạng thái
              const a11yLabel = `Question ${i + 1}${isCurrent ? ', current' : isCompleted ? ', completed' : ''
                }`;

              return (
                <li key={i} className="list-none">
                  <button
                    type="button" // tránh submit form ngoài ý muốn
                    className={cn(base, state)}
                    onClick={() => onQuestionSelect(i)}
                    aria-label={a11yLabel}
                    aria-current={isCurrent ? 'true' : undefined}
                    title={a11yLabel}
                  >
                    {i + 1}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </Card>
    );
  }
);

QuestionList.displayName = 'QuestionList';
