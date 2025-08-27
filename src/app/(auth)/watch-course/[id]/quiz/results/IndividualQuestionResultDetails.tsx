// watch-course/[id]/quiz/results/IndividualQuestionResultDetails.tsx
import React, { useMemo } from 'react';
import { QuestionResultItemData } from '@/types/quiz';
import Image from 'next/image';

interface IndividualQuestionResultDetailsProps {
  result: QuestionResultItemData;
}

const toId = (obj: any, fallback: string) =>
  obj?.id ?? obj?._id ?? obj?.questionId ?? fallback;

const toSet = (val: any): Set<string> => {
  if (!val) return new Set<string>();
  if (val instanceof Set) return new Set(Array.from(val).map(String));
  if (Array.isArray(val)) return new Set(val.map(String));
  return new Set<string>();
};

export const IndividualQuestionResultDetails: React.FC<IndividualQuestionResultDetailsProps> = ({ result }) => {
  // Safe destructuring
  const questionData: any = result?.questionData ?? null;
  const status = result?.status ?? 'skipped';
  const pointsEarned = Number(result?.pointsEarned ?? 0);
  const maxPoints = Number(result?.maxPoints ?? 0);
  const rationale = (result as any)?.rationale;

  const userSelectedSet: Set<string> = useMemo(
    () => toSet(result?.userAnswer?.selectedOptionIds),
    [result?.userAnswer?.selectedOptionIds]
  );

  // Nếu không có dữ liệu câu hỏi thì hiển thị placeholder nhẹ
  if (!questionData) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-semibold text-[#3858F8]">Question</div>
        <div className="text-gray-500">No question data available.</div>
      </div>
    );
  }

  // Safe fields
  const isMultipleAnswer: boolean = !!questionData?.choicesConfig?.isMultipleAnswer;
  const questionNumber: number = Number(questionData?.questionNumber ?? result?.questionNumber ?? 0);
  const points: number | undefined = questionData?.points != null ? Number(questionData.points) : undefined;
  const title: string = questionData?.title ?? '';
  const questionImage: string | null =
    typeof questionData?.questionImage === 'string' ? questionData.questionImage : null;

  const options: any[] = Array.isArray(questionData?.options) ? questionData.options : [];
  const correctAnswerIds: string[] = Array.isArray(questionData?.correctAnswerIds)
    ? questionData.correctAnswerIds.map(String)
    : (questionData?.correctAnswer != null ? [String(questionData.correctAnswer)] : []);

  // Feedback UI
  let feedbackBgColor = '';
  let feedbackTextColor = '';
  let feedbackText = '';
  let feedbackSubtext = '';
  let feedbackIcon = null as React.ReactNode;

  if (status === 'correct') {
    feedbackBgColor = 'bg-[#D4F6EE]';
    feedbackTextColor = 'text-[#00CE9C]';
    feedbackText = 'All correct';
    feedbackSubtext = 'Receive full point';
    feedbackIcon = (
      <div className="relative w-10 h-10 rounded-full bg-[#00CE9C] flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  } else if (status === 'incorrect') {
    feedbackBgColor = 'bg-[#FFE7D7]';
    feedbackTextColor = 'text-[#FF7410]';
    feedbackText = 'Wrong answer';
    feedbackSubtext = 'Receive 0% point';
    feedbackIcon = (
      <div className="relative w-10 h-10 rounded-full bg-[#FF7410] flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  } else {
    feedbackBgColor = 'bg-[#F7F8FA]';
    feedbackTextColor = 'text-[#6B6B6B]';
    feedbackText = 'Skipped';
    feedbackSubtext = 'No point received';
    feedbackIcon = (
      <div className="relative w-10 h-10 rounded-full bg-[#D9D9D9] flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Title + Points (wrap dài) */}
      <div className="flex items-baseline gap-2 min-w-0">
        <div className="text-2xl font-semibold text-[#3858F8] leading-7 break-words hyphens-auto">
          Question {questionNumber}
        </div>
        {points != null && (
          <div className="text-base font-normal text-[#6B6B6B] leading-5">( {points} points )</div>
        )}
      </div>

      {/* Question text + image */}
      <div className="flex flex-col gap-5 sm:gap-8">
        {title && (
          <div className="text-xl font-medium text-[#0D0D0D] leading-6 whitespace-pre-wrap break-words hyphens-auto">
            {title}
          </div>
        )}

        {questionImage && (
          <div className="w-full">
            <Image
              src={questionImage}
              alt="Question"
              width={800}
              height={450}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 800px"
              className="mx-auto max-w-full h-auto rounded-lg object-contain"
            />
          </div>
        )}

        {/* Options (read-only) */}
        <div className="flex flex-col gap-3 sm:gap-4" role="list" aria-label="Options">
          {options.map((option: any, idx: number) => {
            const optionId = String(toId(option, String(idx)));
            const isUserSelected = userSelectedSet.has(optionId);
            const isCorrectAnswer = correctAnswerIds.includes(optionId);

            const optionBgColor = 'bg-white';
            let optionTextColor = 'text-[#6B6B6B]';
            let leftBarColor = '';
            let radioColor = 'border-[#D9D9D9]';
            let radioDotColor = '';

            if (isCorrectAnswer) {
              leftBarColor = 'bg-[#00CE9C]';
              optionTextColor = 'text-[#00CE9C]';
              radioColor = 'border-[#00CE9C]';
              radioDotColor = 'bg-[#00CE9C]';
            }

            if (isUserSelected && !isCorrectAnswer) {
              leftBarColor = 'bg-[#FF7410]';
              optionTextColor = 'text-[#FF7410]';
              radioColor = 'border-[#FF7410]';
              radioDotColor = 'bg-[#FF7410]';
            }

            const label =
              (option?.text && String(option.text)) || `Option ${idx + 1}`;

            return (
              <div
                key={optionId}
                role="listitem"
                aria-label={label}
                className={`relative w-full min-h-14 pl-5 pr-4 py-3 rounded-xl ${optionBgColor} shadow-sm transition-colors duration-200`}
              >
                {/* Left color bar */}
                {leftBarColor && (
                  <div className={`absolute left-2 top-2 bottom-2 w-1.5 sm:w-2 rounded-full ${leftBarColor}`} />
                )}

                <div className="flex items-center justify-between gap-3 py-1 pl-2">
                  <div
                    className={`flex-grow text-base leading-5 ${optionTextColor} whitespace-pre-wrap break-words hyphens-auto`}
                  >
                    {label}
                  </div>

                  {/* Icon (checkbox/radio) */}
                  {isMultipleAnswer ? (
                    <div
                      className={`w-6 h-6 rounded border-[1.5px] flex-shrink-0 flex items-center justify-center ${radioColor}`}
                      aria-hidden="true"
                    >
                      {(isCorrectAnswer || isUserSelected) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ) : (
                      <div
                        className={`w-6 h-6 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center ${radioColor}`}
                        aria-hidden="true"
                      >
                      {(isCorrectAnswer || isUserSelected) && (
                          <div className={`w-4 h-4 rounded-full ${radioDotColor}`} />
                      )}
                    </div>
                  )}
                </div>

                {/* SR-only badges for screen readers */}
                <span className="sr-only">
                  {isCorrectAnswer ? 'Correct answer.' : isUserSelected ? 'Your selection.' : ''}
                </span>
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        <div
          className={`self-stretch ${feedbackBgColor} rounded-xl p-4 sm:px-6 lg:px-12 py-5`}
          aria-live="polite"
        >
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              {feedbackIcon}
              <div className="flex flex-col">
                <div className={`font-semibold text-base leading-5 ${feedbackTextColor}`}>{feedbackText}</div>
                <div className={`font-normal text-sm leading-4 ${feedbackTextColor}`}>{feedbackSubtext}</div>
              </div>
            </div>
            <div className={`font-semibold text-base leading-5 ${feedbackTextColor}`}>
              ({pointsEarned}/{maxPoints} Point)
            </div>
          </div>
        </div>

        {/* Rationale */}
        {rationale && (
          <div className="self-stretch bg-[#F7F8FA] rounded-xl p-4 sm:p-6 text-[#0D0D0D] text-base whitespace-pre-wrap break-words hyphens-auto">
            <h3 className="font-semibold text-lg mb-2">Explanation:</h3>
            <p>{rationale}</p>
          </div>
        )}
      </div>
    </div>
  );
};
