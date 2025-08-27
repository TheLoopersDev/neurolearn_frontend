// watch-course/[id]/quiz/header/TimerDisplay.tsx
import Image from 'next/image';
import React from 'react';
import clockIcon from '@/public/assets/create-quiz/timer-pause.svg';

interface TimerDisplayProps {
  timeLeft: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft }) => {
  return (
    <div
      className="flex items-center gap-2 sm:gap-3"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      title={`Time left: ${timeLeft}`}
    >
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F8E7EB] flex items-center justify-center overflow-hidden">
        <Image
          alt="Timer"
          src={clockIcon}
          fill
          sizes="(max-width: 640px) 36px, 40px"
          priority={false}
        />
      </div>
      <span className="text-lg sm:text-xl font-medium text-[#F02656] leading-6 tabular-nums">
        {timeLeft}
      </span>
    </div>
  );
};
