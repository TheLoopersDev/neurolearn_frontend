// watch-course/[id]/quiz/QuizResultsPage.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { QuizResultsSummary } from '@/types/quiz';
import { ResultsOverviewHeader } from './results/ResultsOverviewHeader';
import { QuestionResultsList } from './results/QuestionResultsList';
import { IndividualQuestionResultDetails } from './results/IndividualQuestionResultDetails';
import { Card } from './ui/Card';
import { Button } from '@/components/common/ui/Button2';

const getResultId = (
  item: QuizResultsSummary['resultsBreakdown'][number],
  idx: number
) => {
  const q = item.questionData as any;
  return (q?.id ?? q?._id ?? q?.questionId ?? `${item.questionNumber}-${item.status}-${idx}`).toString();
};

// Container & side width (đồng bộ với các trang khác)
const PAGE_CONTAINER = 'mx-auto w-full max-w-[1319px] px-4 md:px-6';
const SIDE_PANEL_WIDTH = 'shrink-0 w-full sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[400px]';

export const QuizResultsPage: React.FC<{
  resultsSummary: QuizResultsSummary;
  onRetakeQuiz?: () => void;
  onBackToCourses?: () => void;
}> = ({ resultsSummary, onRetakeQuiz, onBackToCourses }) => {
  const normalized = useMemo(() => {
    const list = resultsSummary.resultsBreakdown ?? [];
    return list.map((it, idx) => ({ ...it, __resultId: getResultId(it, idx) }));
  }, [resultsSummary.resultsBreakdown]);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    normalized.length ? normalized[0].__resultId : null
  );

  // Scroll đến chi tiết câu hỏi khi chọn ở panel trái
  useEffect(() => {
    if (!selectedQuestionId) return;
    const el = document.getElementById(`qr-${selectedQuestionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedQuestionId]);

  const handleBackToCourses = () => {
    onBackToCourses?.();
  };

  // Trường hợp không có dữ liệu
  if (!normalized.length) {
    return (
      <div className="relative min-h-screen bg-[#F7F8FA] overflow-hidden">
        <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[1172px] h-[467px] rounded-full bg-[radial-gradient(ellipse_105.86%_58.94%_at_50%_-5.86%,#5B78FF_0%,#F7F8FA_100%)]" />
        <ResultsOverviewHeader resultsSummary={resultsSummary} onBackToCourses={handleBackToCourses} />
        <div className={`relative z-10 ${PAGE_CONTAINER} mt-10`}>
          <Card className="p-8 text-center">
            <p className="text-gray-700">No results to display.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7F8FA] overflow-hidden">
      {/* background blob */}
      <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[1172px] h-[467px] rounded-full bg-[radial-gradient(ellipse_105.86%_58.94%_at_50%_-5.86%,#5B78FF_0%,#F7F8FA_100%)]" />

      <ResultsOverviewHeader resultsSummary={resultsSummary} onBackToCourses={handleBackToCourses} />

      {/* Main layout: panel trái cố định width, panel phải co giãn */}
      <div className={`relative z-10 ${PAGE_CONTAINER} mt-10 flex flex-col md:flex-row gap-8 lg:gap-10 items-start`}>
        {/* LEFT: Results list + actions */}
        <div className={`${SIDE_PANEL_WIDTH} flex flex-col gap-5`}>
          <QuestionResultsList
            results={normalized as any}
            onQuestionSelect={setSelectedQuestionId}
            selectedQuestionId={selectedQuestionId}
          />

          <div className="flex flex-col gap-4 mt-auto">
            {onRetakeQuiz && (
              <Button
                variant="default"
                size="lg"
                className="w-full flex items-center justify-center bg-[#3858F8] hover:bg-[#3858F8]/90"
                onClick={onRetakeQuiz}
              >
                Retake Quiz
              </Button>
            )}
            {onBackToCourses && (
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center border-[#3858F8] text-[#3858F8] hover:bg-[#3858F8]/10"
                onClick={handleBackToCourses}
              >
                Back to Courses
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT: All question details (co giãn, chống tràn) */}
        <Card className="flex-1 min-w-0 pt-4 pb-9 px-6 md:px-12">
          <div className="flex flex-col gap-8">
            {normalized.map((r) => (
              <section id={`qr-${r.__resultId}`} key={r.__resultId} className="scroll-mt-24">
                <IndividualQuestionResultDetails result={r as any} />
              </section>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
