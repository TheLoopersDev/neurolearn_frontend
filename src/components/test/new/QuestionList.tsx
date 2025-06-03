// src/components/QuestionList.tsx
import React from 'react';
import { QuestionListItem } from './QuestionListItem';
// import { PlusIcon } from './icons';

interface Question {
  id: string;
  number: number;
  title: string;
  type: 'Multiple choice' | 'Simple answer' | 'Free answer';
}

const mockQuestions: Question[] = [
  { id: '1', number: 1, title: 'In visual design principle...', type: 'Multiple choice' },
  { id: '2', number: 2, title: 'In visual design principle...', type: 'Multiple choice' },
  { id: '3', number: 3, title: 'In visual design principle...', type: 'Simple answer' },
  { id: '4', number: 4, title: 'In visual design principle...', type: 'Free answer' },
];

export const QuestionList: React.FC = () => {
  const [selectedQuestionId, setSelectedQuestionId] = React.useState<string | null>('1');

  return (
    <div className="w-[312px] h-[599px] p-6 bg-white rounded-[20px] flex justify-start items-start gap-2.5">
      <div className="w-[282px] flex-col justify-start items-start gap-6 inline-flex">
        <div className="w-[264px] justify-between items-center inline-flex">
          <div className="text-black text-2xl font-semibold font-['Inter'] leading-7">
            Question ({mockQuestions.length})
          </div>
          <div className="w-10 h-10 p-3 bg-[#F7F8FA] rounded-full justify-center items-center gap-3 flex">
            {/* <PlusIcon colorClass="bg-[#3858F8]" /> */}
            ccoongj
          </div>
        </div>
        <div className="self-stretch flex justify-start items-start gap-2.5">
          <div className="w-[264px] h-[488px] overflow-y-auto rounded-xl flex-col justify-start items-start gap-3 inline-flex pr-1">
            {mockQuestions.map(q => (
              <QuestionListItem
                key={q.id}
                number={q.number}
                title={q.title}
                type={q.type}
                isActive={selectedQuestionId === q.id}
                onClick={() => setSelectedQuestionId(q.id)}
              />
            ))}
          </div>
          <div className="w-2 h-24 bg-[#D9D9D9] rounded-[22px]"></div>
        </div>
      </div>
    </div>
  );
};
