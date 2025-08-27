import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';

interface AssignmentHeaderProps {
  progress: number;
  onBackClick?: () => void;
}

export const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({ progress, onBackClick }) => {
  return (
    <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: back + title */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={onBackClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <svg className="w-6 h-6 text-[#292D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="flex flex-col">
          <div className="text-xl font-medium text-[#3858F8] leading-6">Knowledge check</div>
          <div className="text-base font-medium text-[#6B6B6B] leading-5">Practice Assignment</div>
        </div>
      </div>

      {/* Right: progress */}
      <div className="w-full sm:max-w-[744px] sm:ml-6 flex flex-col items-stretch gap-2">
        <div className="w-full text-right text-xl font-medium text-[#3858F8] leading-6" aria-live="polite">
          {progress}%
        </div>
        <ProgressBar progress={progress} className="w-full" />
      </div>
    </div>
  );
};
