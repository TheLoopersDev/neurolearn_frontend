// watch-course/[id]/quiz/results/IndividualQuestionResultDetails.tsx
import React from 'react';
import { QuestionResultItemData } from '@/types/quiz';
import Image from 'next/image'; // Đảm bảo Image được import nếu bạn dùng nó cho questionImage

interface IndividualQuestionResultDetailsProps {
  result: QuestionResultItemData;
}

export const IndividualQuestionResultDetails: React.FC<IndividualQuestionResultDetailsProps> = ({ result }) => {
  const { questionData, userAnswer, status, pointsEarned, maxPoints, rationale } = result;
  const isMultipleAnswer = questionData.choicesConfig.isMultipleAnswer;

  let feedbackBgColor = '';
  let feedbackTextColor = '';
  let feedbackText = '';
  let feedbackSubtext = '';
  let feedbackIcon = null;

  if (status === 'correct') {
    feedbackBgColor = 'bg-[#D4F6EE]'; // Light Green
    feedbackTextColor = 'text-[#00CE9C]'; // Green
    feedbackText = 'All correct';
    feedbackSubtext = 'Receive full point';
    feedbackIcon = (
      <div className="relative w-10 h-10 rounded-full bg-[#00CE9C] flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
    );
  } else if (status === 'incorrect') {
    feedbackBgColor = 'bg-[#FFE7D7]'; // Light Orange
    feedbackTextColor = 'text-[#FF7410]'; // Orange
    feedbackText = 'Wrong answer';
    feedbackSubtext = 'Receive 0% point';
    feedbackIcon = (
      <div className="relative w-10 h-10 rounded-full bg-[#FF7410] flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
    );
  } else { // skipped
    feedbackBgColor = 'bg-[#F7F8FA]'; // Light Gray
    feedbackTextColor = 'text-[#6B6B6B]'; // Gray
    feedbackText = 'Skipped';
    feedbackSubtext = 'No point received';
    feedbackIcon = (
      <div className="relative w-10 h-10 rounded-full bg-[#D9D9D9] flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
        </svg>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-8">
      {/* Question Title and Points */}
      <div className="flex items-baseline gap-2 question-title-clip">
        <div className="text-2xl font-semibold text-[#3858F8] leading-7">
          Question {questionData.questionNumber}
        </div>
        {questionData.points && (
          <div className="text-base font-normal text-[#6B6B6B] leading-5">
            ({questionData.points} points)
          </div>
        )}
      </div>

      {/* Question Text and Image */}
      <div className="flex flex-col gap-8">
        <div className="text-xl font-medium text-[#0D0D0D] leading-6">{questionData.title}</div>
        {questionData.questionImage && typeof questionData.questionImage === 'string' && (
          <Image src={questionData.questionImage} alt="Question" className="max-w-full h-auto rounded-lg" />
        )}

        {/* Options with correctness indicators */}
        <div className="flex flex-col gap-4">
          {questionData.options.map((option) => {
            const isUserSelected = userAnswer.selectedOptionIds?.has(option.id);
            const isCorrectAnswer = questionData.correctAnswerIds.includes(option.id);

            // Đã đổi 'let' thành 'const' cho optionBgColor
            const optionBgColor = 'bg-white'; // Mặc định nền trắng cho mọi option
            let optionTextColor = 'text-[#6B6B6B]'; // Mặc định chữ xám
            let leftBarColor = '';
            let radioColor = 'border-[#D9D9D9]'; // Mặc định viền radio/checkbox
            let radioDotColor = '';

            if (isCorrectAnswer) {
              leftBarColor = 'bg-[#00CE9C]'; // Thanh xanh lá
              optionTextColor = 'text-[#00CE9C]'; // Chữ xanh lá
              radioColor = 'border-[#00CE9C]'; // Viền radio xanh lá
              radioDotColor = 'bg-[#00CE9C]'; // Chấm/nền radio xanh lá
            }

            if (isUserSelected && !isCorrectAnswer) {
              leftBarColor = 'bg-[#FF7410]'; // Thanh cam
              optionTextColor = 'text-[#FF7410]'; // Chữ cam
              radioColor = 'border-[#FF7410]'; // Viền radio cam
              radioDotColor = 'bg-[#FF7410]'; // Chấm/nền radio cam
            }

            return (
              <div
                key={option.id}
                className={`relative w-full py-1 pl-4 pr-6 rounded-xl cursor-pointer
                  ${optionBgColor} shadow-sm transition-colors duration-200`}
              >
                {/* Thanh màu bên trái */}
                {leftBarColor && (
                  <div className={`absolute left-2 top-1/2 -translate-y-1/2 h-[calc(100%-8px)] w-3 rounded-xl ${leftBarColor}`}></div>
                )}
                <div className={`flex items-center justify-between py-1 px-4`}>
                  <div className={`flex-grow flex items-center h-12 text-base font-medium leading-5 ${optionTextColor}`}>
                    {option.text}
                  </div>
                  {isMultipleAnswer ? (
                    // Checkbox
                    <div className={`w-6 h-6 rounded border-[1.5px] flex-shrink-0 flex items-center justify-center ${radioColor}`}>
                      {/* Checkmark chỉ hiển thị nếu là đáp án đúng hoặc được người dùng chọn */}
                      {(isCorrectAnswer || isUserSelected) && (
                        <svg className={`w-4 h-4 ${radioDotColor ? 'text-white' : 'text-[#3858F8]'}`} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                  ) : (
                    // Radio button
                    <div className={`w-6 h-6 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center ${radioColor}`}>
                      {/* Chấm tròn chỉ hiển thị nếu là đáp án đúng hoặc được người dùng chọn */}
                      {(isCorrectAnswer || isUserSelected) && (
                        <div className={`w-4 h-4 rounded-full ${radioDotColor}`}></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback/Rationale Section */}
        <div className={`self-stretch h-20 px-12 py-5 ${feedbackBgColor} rounded-xl flex flex-col justify-center items-start gap-2`}>
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-3">
              {feedbackIcon}
              <div className={`flex flex-col justify-start items-start gap-1`}>
                <div className={`font-semibold text-base leading-5 ${feedbackTextColor}`}>{feedbackText}</div>
                <div className={`font-normal text-sm leading-4 ${feedbackTextColor}`}>{feedbackSubtext}</div>
              </div>
            </div>
            <div className={`font-semibold text-base leading-5 ${feedbackTextColor}`}>
              ({pointsEarned}/{maxPoints} Point)
            </div>
          </div>
        </div>

        {/* Rationale (Explanation) - if any */}
        {rationale && (
          <div className="self-stretch bg-[#F7F8FA] rounded-xl p-6 text-[#0D0D0D] text-base">
            <h3 className="font-semibold text-lg mb-2">Explanation:</h3>
            <p>{rationale}</p>
          </div>
        )}
      </div>
    </div>
  );
};