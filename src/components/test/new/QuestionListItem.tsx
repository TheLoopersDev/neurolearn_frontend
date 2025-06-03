// src/components/QuestionListItem.tsx
import React from 'react';

interface QuestionListItemProps {
  number: number;
  title: string;
  type: string;
  isActive?: boolean;
  onClick?: () => void;
}

// Placeholder icons for question types
const MultipleChoiceIcon = () => (
  <div className="w-5 h-5 relative">
    <div className="w-[12.92px] h-[12.92px] left-[6.04px] top-[1.04px] absolute bg-[#6B6B6B]"></div>
    <div className="w-[12.92px] h-[12.92px] left-[1.04px] top-[6.04px] absolute bg-[#6B6B6B]"></div>
    <div className="w-[6.11px] h-[4.49px] left-[4.44px] top-[10.26px] absolute bg-[#6B6B6B]"></div>
  </div>
);
const SimpleAnswerIcon = () => (
  <div className="w-5 h-5 relative">
    <div className="w-[14.58px] h-[15.08px] left-[2.71px] top-[1.19px] absolute bg-[#6B6B6B]"></div>
    <div className="w-[5.79px] h-[5.54px] left-[9.29px] top-[3.58px] absolute bg-[#6B6B6B]"></div>
    <div className="w-[16.25px] h-[1.25px] left-[1.88px] top-[17.71px] absolute bg-[#6B6B6B]"></div>
  </div>
);
const FreeAnswerIcon = () => (
  <div className="w-5 h-5 relative">
    <div className="w-[17.92px] h-[17.92px] left-[1.04px] top-[1.04px] absolute bg-[#6B6B6B]"></div>
    <div className="w-[7.93px] h-[7.92px] left-[10.83px] top-[0.83px] absolute bg-[#6B6B6B]"></div>
    <div className="w-[3.41px] h-[3.41px] left-[14.29px] top-[1.89px] absolute bg-[#6B6B6B]"></div>
  </div>
);
const ThreeDotsIconBlue = () => (
  <div className="w-5 h-5 relative">
    <div className="w-[4.58px] h-[4.58px] left-[1.88px] top-[7.71px] absolute bg-[#3858F8]"></div>
    <div className="w-[4.58px] h-[4.58px] left-[13.54px] top-[7.71px] absolute bg-[#3858F8]"></div>
    <div className="w-[4.58px] h-[4.58px] left-[7.71px] top-[7.71px] absolute bg-[#3858F8]"></div>
  </div>
);

const getQuestionTypeIcon = (type: string) => {
  if (type.toLowerCase().includes('multiple')) return <MultipleChoiceIcon />;
  if (type.toLowerCase().includes('simple')) return <SimpleAnswerIcon />;
  if (type.toLowerCase().includes('free')) return <FreeAnswerIcon />;
  return <MultipleChoiceIcon />;
};

export const QuestionListItem: React.FC<QuestionListItemProps> = ({
  number,
  title,
  type,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`self-stretch h-[92px] p-3 rounded-xl flex-col justify-start items-start gap-2.5 flex cursor-pointer
                  ${isActive ? 'bg-white shadow-[0px_0px_12px_rgba(0,0,0,0.08)]' : 'bg-[#F7F8FA]'}`}
      onClick={onClick}
    >
      <div className="w-[240px] flex-col justify-start items-start gap-1 flex">
        <div className="self-stretch justify-start items-center gap-2 inline-flex">
          <div className="w-7 h-7 relative">
            <div className="w-7 h-7 left-0 top-0 absolute">
              <div className="w-[22.17px] h-[22.17px] left-[2.92px] top-[3px] absolute outline outline-[1.5px] -outline-offset-[0.75px] outline-[#0D0D0D]"></div>
            </div>
            <div className="left-[10px] top-[2px] absolute text-[#0D0D0D] text-xs font-medium font-['Inter'] leading-6">
              {number}
            </div>
          </div>
          <div className="w-[205px] text-center text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
            {title}
          </div>
        </div>
        <div className="self-stretch justify-start items-center gap-[72px] inline-flex">
          {' '}
          {/* Adjust gap as needed */}
          <div className="pl-1 pr-1 justify-start items-center gap-3 flex">
            {getQuestionTypeIcon(type)}
            <div className="text-[#6B6B6B] text-xs font-medium font-['Inter'] leading-none">
              {type}
            </div>
          </div>
          <div className="w-9 h-9 p-4 bg-white rounded-xl justify-center items-center gap-2.5 flex">
            <ThreeDotsIconBlue />
          </div>
        </div>
      </div>
    </div>
  );
};
