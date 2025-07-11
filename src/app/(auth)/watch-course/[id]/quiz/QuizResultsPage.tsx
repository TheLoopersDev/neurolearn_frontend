// watch-course/[id]/quiz/QuizResultsPage.tsx
import React, { useState } from 'react';
import { QuizResultsSummary } from '@/types/quiz';
import { ResultsOverviewHeader } from './results/ResultsOverviewHeader';
import { QuestionResultsList } from './results/QuestionResultsList';
import { IndividualQuestionResultDetails } from './results/IndividualQuestionResultDetails';
import { Card } from './ui/Card';

interface QuizResultsPageProps {
  resultsSummary: QuizResultsSummary;
  onRetakeQuiz?: () => void; // Optional: Function to retake the quiz
  onBackToCourses?: () => void; // Optional: Function to go back to courses
}

export const QuizResultsPage: React.FC<QuizResultsPageProps> = ({ resultsSummary, onRetakeQuiz, onBackToCourses }) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    resultsSummary.resultsBreakdown.length > 0 ? resultsSummary.resultsBreakdown[0].questionData.id : null
  );

  const selectedQuestionResult = resultsSummary.resultsBreakdown.find(
    (item) => item.questionData.id === selectedQuestionId
  );

  // You might want to remove this or make it conditional based on design
  const handleBackToCourses = () => {
    alert('Navigating back to courses!');
    if (onBackToCourses) onBackToCourses();
  };

  return (
    <div className="relative min-h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[1172px] h-[467px] rounded-full bg-[radial-gradient(ellipse_105.86%_58.94%_at_50%_-5.86%,#5B78FF_0%,#F7F8FA_100%)]"></div>

      {/* Results Overview Header */}
      <ResultsOverviewHeader resultsSummary={resultsSummary} onBackToCourses={handleBackToCourses} />

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full  mt-10 flex flex-col md:flex-row gap-10 items-stretch">
        {/* Left Section: Question List and Action Buttons */}
        <div className="w-2/5 flex flex-col gap-5 flex-grow">
          <QuestionResultsList
            results={resultsSummary.resultsBreakdown}
            onQuestionSelect={setSelectedQuestionId}
            selectedQuestionId={selectedQuestionId}
          />
          {/* Action Buttons: Retake Quiz, Back to Courses */}
          <div className="flex flex-col gap-5 mt-auto"> {/* mt-auto to push to bottom */}
            {onRetakeQuiz && (
              <button
                onClick={onRetakeQuiz}
                className="w-full py-4 px-6 bg-[#3858F8] text-white rounded-xl text-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Retake Quiz
              </button>
            )}
            {onBackToCourses && (
              <button
                onClick={handleBackToCourses}
                className="w-full py-4 px-6 bg-white text-[#3858F8] border border-[#3858F8] rounded-xl text-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Back to Courses
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Individual Question Result Details */}
        <Card className="flex-grow w-3/5 md:w-[983px] pt-4 pb-9 px-6 md:px-12">
          {selectedQuestionResult ? (
            <IndividualQuestionResultDetails result={selectedQuestionResult} />
          ) : (
            <div className="text-center text-gray-500 py-10">Select a question to view details.</div>
          )}
        </Card>
      </div>
    </div>
  );
};