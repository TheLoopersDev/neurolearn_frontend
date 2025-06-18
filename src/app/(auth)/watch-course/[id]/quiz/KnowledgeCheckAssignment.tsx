// watch-course/[id]/quiz/KnowledgeCheckAssignment.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/Card';
import { AssignmentHeader } from './header/AssignmentHeader';
import { TimerDisplay } from './header/TimerDisplay';
import { QuestionList } from './question/QuestionList';
import { QuestionDisplay } from './question/QuestionDisplay';
import { QuestionNavigation } from './question/QuestionNavigation';
import { QuestionData, QuizResultsSummary, QuestionResultItemData, UserAnswer } from '@/types/quiz'; // Import types

import { QuizResultsPage } from './QuizResultsPage'; // Import màn hình kết quả

// Mock Data (Đảm bảo dữ liệu này khớp với interface QuestionData của bạn)
const mockQuestions: QuestionData[] = [
  {
    id: 'q1',
    questionNumber: 1,
    title: 'Which of these is NOT a primary color of light?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt1_a', text: 'Red' },
      { id: 'opt1_b', text: 'Green' },
      { id: 'opt1_c', text: 'Blue' },
      { id: 'opt1_d', text: 'Yellow' },
    ],
    correctAnswerIds: ['opt1_d'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'What is the capital of France?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt2_a', text: 'Berlin' },
      { id: 'opt2_b', text: 'Madrid' },
      { id: 'opt2_c', text: 'Paris' },
      { id: 'opt2_d', text: 'Rome' },
    ],
    correctAnswerIds: ['opt2_c'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q3',
    questionNumber: 3,
    title: 'Which planet is known as the Red Planet?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt3_a', text: 'Earth' },
      { id: 'opt3_b', text: 'Mars' },
      { id: 'opt3_c', text: 'Jupiter' },
      { id: 'opt3_d', text: 'Venus' },
    ],
    correctAnswerIds: ['opt3_b'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q4',
    questionNumber: 4,
    title:
      "In visual design principles, which rule helps create a sense of movement and guides the viewer's eye?",
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt4_a', text: 'Contrast' },
      { id: 'opt4_b', text: 'Balance' },
      { id: 'opt4_c', text: 'Rhythm' },
      { id: 'opt4_d', text: 'Proportion' },
    ],
    correctAnswerIds: ['opt4_c'], // Rhythm
    points: '10',
    isRequired: true,
  },
  {
    id: 'q5',
    questionNumber: 5,
    title: 'Which of the following are programming languages?',
    questionType: 'multiple-choice',
    choicesConfig: { isMultipleAnswer: true, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt5_a', text: 'JavaScript' },
      { id: 'opt5_b', text: 'Python' },
      { id: 'opt5_c', text: 'HTML' }, // HTML is a markup language, not strictly a programming language, for example
      { id: 'opt5_d', text: 'CSS' }, // CSS is a stylesheet language
    ],
    correctAnswerIds: ['opt5_a', 'opt5_b'],
    points: '20',
    isRequired: true,
  },
  {
    id: 'q6',
    questionNumber: 6,
    title: 'What is the largest ocean on Earth?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt6_a', text: 'Atlantic Ocean' },
      { id: 'opt6_b', text: 'Indian Ocean' },
      { id: 'opt6_c', text: 'Arctic Ocean' },
      { id: 'opt6_d', text: 'Pacific Ocean' },
    ],
    correctAnswerIds: ['opt6_d'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q7',
    questionNumber: 7,
    title: "Which animal is known as the 'king of the jungle'?",
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt7_a', text: 'Tiger' },
      { id: 'opt7_b', text: 'Lion' },
      { id: 'opt7_c', text: 'Bear' },
      { id: 'opt7_d', text: 'Wolf' },
    ],
    correctAnswerIds: ['opt7_b'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q8',
    questionNumber: 8,
    title: 'What is the smallest prime number?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt8_a', text: '0' },
      { id: 'opt8_b', text: '1' },
      { id: 'opt8_c', text: '2' },
      { id: 'opt8_d', text: '3' },
    ],
    correctAnswerIds: ['opt8_c'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q9',
    questionNumber: 9,
    title: 'Which famous scientist developed the theory of relativity?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt9_a', text: 'Isaac Newton' },
      { id: 'opt9_b', text: 'Galileo Galilei' },
      { id: 'opt9_c', text: 'Albert Einstein' },
      { id: 'opt9_d', text: 'Marie Curie' },
    ],
    correctAnswerIds: ['opt9_c'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q10',
    questionNumber: 10,
    title: 'What is the main function of the heart in the human body?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt10_a', text: 'Digestion' },
      { id: 'opt10_b', text: 'Respiration' },
      { id: 'opt10_c', text: 'Pumping blood' },
      { id: 'opt10_d', text: 'Filtration' },
    ],
    correctAnswerIds: ['opt10_c'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q11',
    questionNumber: 11,
    title: 'Which continent is the Amazon Rainforest primarily located in?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt11_a', text: 'Africa' },
      { id: 'opt11_b', text: 'Asia' },
      { id: 'opt11_c', text: 'South America' },
      { id: 'opt11_d', text: 'North America' },
    ],
    correctAnswerIds: ['opt11_c'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q12',
    questionNumber: 12,
    title: 'What is the largest land animal?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt12_a', text: 'Giraffe' },
      { id: 'opt12_b', text: 'Elephant' },
      { id: 'opt12_c', text: 'Rhinoceros' },
      { id: 'opt12_d', text: 'Hippopotamus' },
    ],
    correctAnswerIds: ['opt12_b'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q13',
    questionNumber: 13,
    title: 'Which gas do plants absorb from the atmosphere?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt13_a', text: 'Oxygen' },
      { id: 'opt13_b', text: 'Nitrogen' },
      { id: 'opt13_c', text: 'Carbon Dioxide' },
      { id: 'opt13_d', text: 'Hydrogen' },
    ],
    correctAnswerIds: ['opt13_c'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q14',
    questionNumber: 14,
    title: 'What is the process by which plants make their own food?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt14_a', text: 'Respiration' },
      { id: 'opt14_b', text: 'Transpiration' },
      { id: 'opt14_c', text: 'Photosynthesis' },
      { id: 'opt14_d', text: 'Germination' },
    ],
    correctAnswerIds: ['opt14_c'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q15',
    questionNumber: 15,
    title: 'Which instrument is used to measure temperature?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt15_a', text: 'Barometer' },
      { id: 'opt15_b', text: 'Thermometer' },
      { id: 'opt15_c', text: 'Hygrometer' },
      { id: 'opt15_d', text: 'Anemometer' },
    ],
    correctAnswerIds: ['opt15_b'],
    points: '10',
    isRequired: true,
  },
  {
    id: 'q16',
    questionNumber: 16,
    title: 'What is the chemical symbol for water?',
    questionType: 'single-choice',
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
    options: [
      { id: 'opt16_a', text: 'O2' },
      { id: 'opt16_b', text: 'CO2' },
      { id: 'opt16_c', text: 'H2O' },
      { id: 'opt16_d', text: 'NaCl' },
    ],
    correctAnswerIds: ['opt16_c'],
    points: '10',
    isRequired: true,
  },
];

const TOTAL_TIME_MINUTES = 30; // 30 minutes for the assignment

const KnowledgeCheckAssignment: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(3); // Start at Question 4 (index 3) as per image
  const [answers, setAnswers] = useState<Map<number, Set<string>>>(
    new Map([
      // Ví dụ về cách lưu trữ các câu trả lời đã chọn ban đầu
      [0, new Set(['opt1_d'])], // Correct
      [1, new Set(['opt2_a'])], // Incorrect (Correct is 'opt2_c')
      [2, new Set(['opt3_b'])], // Correct
      [3, new Set(['opt4_a'])], // Incorrect (Correct is 'opt4_c')
      [4, new Set(['opt5_a', 'opt5_b'])], // Correct for multiple-choice
    ])
  );
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_TIME_MINUTES * 60);
  const [quizSubmitted, setQuizSubmitted] = useState(false); // State để quản lý hiển thị màn hình kết quả
  const [quizResults, setQuizResults] = useState<QuizResultsSummary | null>(null); // State để lưu trữ kết quả

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const progress = Math.min(100, Math.round((answers.size / mockQuestions.length) * 100));

  // Hàm tính toán kết quả (đã có useCallback)
  const calculateQuizResults = useCallback(
    (isTimeOut: boolean = false): QuizResultsSummary => {
      let correctQuestionsCount = 0;
      let incorrectQuestionsCount = 0;
      let skippedQuestionsCount = 0;
      let totalScore = 0;
      let maxPossibleScore = 0;
      let attemptedQuestions = 0;

      const resultsBreakdown: QuestionResultItemData[] = mockQuestions.map((question, index) => {
        const userAnswer: UserAnswer = {
          questionId: question.id,
          selectedOptionIds: answers.get(index) || new Set<string>(),
        };

        const maxPointsForQuestion = parseInt(question.points || '0', 10);
        maxPossibleScore += maxPointsForQuestion;

        let status: 'correct' | 'incorrect' | 'skipped' = 'skipped';
        let pointsEarned = 0;

        if (userAnswer.selectedOptionIds.size === 0) {
          skippedQuestionsCount++;
          status = 'skipped';
        } else {
          attemptedQuestions++;
          // Check if the user's selected answers match the correct answers
          const userSelectedSorted = Array.from(userAnswer.selectedOptionIds).sort();
          const correctAnswersSorted = [...question.correctAnswerIds].sort();

          const isCorrect =
            userSelectedSorted.length === correctAnswersSorted.length &&
            userSelectedSorted.every((val, idx) => val === correctAnswersSorted[idx]);

          if (isCorrect) {
            correctQuestionsCount++;
            status = 'correct';
            pointsEarned = maxPointsForQuestion;
          } else {
            incorrectQuestionsCount++;
            status = 'incorrect';
            pointsEarned = 0;
          }
          totalScore += pointsEarned;
        }

        return {
          questionNumber: question.questionNumber,
          status: status,
          questionData: question,
          userAnswer: userAnswer,
          pointsEarned: pointsEarned,
          maxPoints: maxPointsForQuestion,
          // rationale: "This is a sample rationale for " + question.title, // Add real rationale if available
        };
      });

      return {
        totalQuestions: mockQuestions.length,
        attemptedQuestions: attemptedQuestions,
        correctQuestions: correctQuestionsCount,
        incorrectQuestions: incorrectQuestionsCount,
        skippedQuestions: skippedQuestionsCount,
        totalScore: totalScore,
        maxPossibleScore: maxPossibleScore,
        overallStatus: isTimeOut ? 'time-out' : 'completed', // Or 'submitted' if not timed out
        resultsBreakdown: resultsBreakdown,
      };
    },
    [answers]
  ); // Dependency: answers state

  // Hàm xử lý submit (đã có useCallback)
  const handleSubmit = useCallback(
    (isTimeOut: boolean = false) => {
      const results = calculateQuizResults(isTimeOut);
      setQuizResults(results);
      setQuizSubmitted(true);
    },
    [calculateQuizResults]
  );

  // useEffect cho timer
  useEffect(() => {
    if (quizSubmitted) return;

    const timer = setInterval(() => {
      setSecondsLeft(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Gọi handleSubmit ở đây
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizSubmitted, handleSubmit]); // Đã thêm 'handleSubmit' vào dependency array

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} Min`;
  }, []);

  const handleSelectAnswer = useCallback(
    (optionId: string, isMultipleAnswer: boolean) => {
      setAnswers(prevAnswers => {
        const newAnswers = new Map(prevAnswers);
        let currentQuestionAnswers = newAnswers.get(currentQuestionIndex) || new Set<string>();

        if (isMultipleAnswer) {
          if (currentQuestionAnswers.has(optionId)) {
            currentQuestionAnswers.delete(optionId);
          } else {
            currentQuestionAnswers.add(optionId);
          }
        } else {
          currentQuestionAnswers = new Set([optionId]);
        }
        newAnswers.set(currentQuestionIndex, currentQuestionAnswers);
        return newAnswers;
      });
    },
    [currentQuestionIndex]
  );

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleQuestionSelect = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  const completedQuestions = new Set<number>(
    Array.from(answers.entries())
      .filter(([, selectedOptions]) => selectedOptions.size > 0)
      .map(([index]) => index)
  );

  const handleGoBack = () => {
    // Logic để quay lại màn hình trước đó, ví dụ: router.back();
    alert('Going back!');
  };

  const handleRetakeQuiz = () => {
    setQuizSubmitted(false);
    setQuizResults(null);
    setAnswers(new Map()); // Reset answers
    setCurrentQuestionIndex(0); // Reset to first question
    setSecondsLeft(TOTAL_TIME_MINUTES * 60); // Reset timer
  };

  // Render màn hình kết quả nếu đã submit
  if (quizSubmitted && quizResults) {
    return (
      <QuizResultsPage
        resultsSummary={quizResults}
        onRetakeQuiz={handleRetakeQuiz}
        onBackToCourses={handleGoBack}
      />
    );
  }

  // Render màn hình làm quiz nếu chưa submit
  return (
    <div className="relative min-h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[1172px] h-[467px] rounded-full bg-[radial-gradient(ellipse_105.86%_58.94%_at_50%_-5.86%,#5B78FF_0%,#F7F8FA_100%)]"></div>

      {/* Header Card */}
      <Card className="relative z-10 mx-auto w-full max-w-[1319px] p-6 flex items-center justify-between">
        <AssignmentHeader progress={progress} onBackClick={handleGoBack} />
        <TimerDisplay timeLeft={formatTime(secondsLeft)} />
      </Card>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full max-w-[1319px] mt-10 flex flex-col md:flex-row gap-10 items-stretch">
        {/* Left Section: Question List and Navigation */}
        <div className="w-full md:w-[312px] flex flex-col gap-5 flex-grow">
          <Card className="p-6 h-full">
            <QuestionList
              totalQuestions={mockQuestions.length}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              completedQuestions={completedQuestions}
            />
          </Card>
          <QuestionNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={() => handleSubmit(false)} // Pass false for manual submission
            canGoPrevious={currentQuestionIndex > 0}
            canGoNext={currentQuestionIndex < mockQuestions.length - 1}
          />
        </div>

        {/* Right Section: Question Details and Options */}
        <Card className="flex-grow w-full md:w-[983px] pt-4 pb-9 px-6 md:px-12">
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              selectedAnswers={answers.get(currentQuestionIndex) || new Set()}
              onSelectAnswer={handleSelectAnswer}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeCheckAssignment;