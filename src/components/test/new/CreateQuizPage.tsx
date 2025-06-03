// src/components/CreateQuizPage.tsx
'use client';
import React from 'react';
import { QuestionList } from './QuestionList';
import { QuestionEditor } from './QuestionEditor';

export const CreateQuizPage: React.FC = () => {
  // This state would determine which question type to show in editor,
  // or which question is currently being edited.
  // For this example, defaulting to 'multiple-choice'.
  const [currentEditingQuestionType, setCurrentEditingQuestionType] = React.useState<
    'multiple-choice' | 'simple-answer' | 'free-answer'
  >('multiple-choice');

  return (
    <div className="w-[1120px] left-[284px] top-[103px] absolute flex-col justify-start items-start gap-6 inline-flex">
      <div className="self-stretch h-24 px-6 py-5 bg-white rounded-xl flex-col justify-start items-start gap-2.5 flex">
        <div className="w-[1072px] justify-between items-center inline-flex">
          <div className="text-black text-2xl font-semibold font-['Inter'] leading-7">
            Create Quiz
          </div>
          <button className="w-[200px] h-14 px-16 py-[18px] bg-[#3858F8] rounded-[40px] justify-center items-center gap-2.5 flex">
            <div className="text-white text-xl font-medium font-['Inter'] leading-6">Create</div>
          </button>
        </div>
      </div>

      <div className="self-stretch justify-start items-start gap-6 inline-flex">
        <QuestionList />
        <QuestionEditor questionType={currentEditingQuestionType} />
      </div>
    </div>
  );
};
