import React from 'react';
import { QuizResultsSummary } from '@/types/quiz';
import { Card } from '../ui/Card';

interface ResultsOverviewHeaderProps {
  resultsSummary: QuizResultsSummary;
  onBackToCourses?: () => void;
}

export const ResultsOverviewHeader: React.FC<ResultsOverviewHeaderProps> = ({ resultsSummary, onBackToCourses }) => {
  return (
    <Card className="relative z-10 mx-auto w-full max-w-[1319px] p-4 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: back + title */}
      <div className="flex items-center gap-4 sm:gap-6">
        {onBackToCourses && (
          <button
            onClick={onBackToCourses}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to courses"
          >
            <svg className="w-6 h-6 text-[#292D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}

        <div className="flex flex-col">
          <div className="text-xl font-medium text-[#3858F8] leading-6">Knowledge check</div>
          <div className="text-base font-medium text-[#6B6B6B] leading-5">Practice Assignment</div>
        </div>
      </div>

      {/* Middle: metrics */}
      <div className="flex flex-wrap items-center gap-6 sm:gap-10">
        <div className="flex flex-col items-start sm:items-center gap-1 min-w-[160px]">
          <div className="text-xl font-medium text-[#3858F8] leading-6">Total Assignment</div>
          <div className="text-base font-semibold text-[#6B6B6B] leading-5">
            {resultsSummary.attemptedQuestions}/{resultsSummary.totalQuestions}
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-center gap-1 min-w-[140px]">
          <div className="text-xl font-medium text-[#3858F8] leading-6">Total Score</div>
          <div className="text-base font-semibold text-[#6B6B6B] leading-5">
            {resultsSummary.totalScore}/{resultsSummary.maxPossibleScore}
          </div>
        </div>
      </div>

      {/* Right: status */}
      <div className="flex flex-col items-start sm:items-center gap-2">
        <div className="text-xl font-medium text-[#3858F8] leading-6">Status</div>
        <div className="h-7 px-5 sm:px-7 py-1 bg-[#3858F8] rounded-xl flex items-center justify-center">
          <div className="text-white text-base font-medium leading-5">
            {String(resultsSummary.overallStatus).toUpperCase()}
          </div>
        </div>
      </div>
    </Card>
  );
};
