import React from 'react';
import { Button } from '@/components/common/ui/Button2';

interface QuestionNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isSubmitting?: boolean;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  canGoPrevious,
  canGoNext,
  isSubmitting = false,
}) => {
  const disableAll = isSubmitting;

  return (
    <nav className="flex flex-col gap-3 sm:gap-5" aria-label="Question navigation">
      {/* Prev / Next: 2 cột trên mobile, giữ cân đối */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <Button
          variant="ghost"
          size="default"
          className="w-full min-h-[44px] flex items-center justify-center gap-2"
          onClick={onPrevious}
          disabled={disableAll || !canGoPrevious}
          aria-disabled={disableAll || !canGoPrevious}
          aria-label="Previous question"
        >
          <svg className="w-5 h-5 text-[#3858F8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Previous
        </Button>

        <Button
          variant="ghost"
          size="default"
          className="w-full min-h-[44px] flex items-center justify-center gap-2"
          onClick={onNext}
          disabled={disableAll || !canGoNext}
          aria-disabled={disableAll || !canGoNext}
          aria-label="Next question"
        >
          Next
          <svg className="w-5 h-5 text-[#3858F8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>

      {/* Submit: full-width */}
      <Button
        variant="default"
        size="lg"
        className="w-full min-h-[48px] flex items-center justify-center gap-2"
        onClick={onSubmit}
        disabled={disableAll}
        aria-busy={isSubmitting}
        aria-label="Submit quiz"
      >
        <svg className="w-6 h-6 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </nav>
  );
};
