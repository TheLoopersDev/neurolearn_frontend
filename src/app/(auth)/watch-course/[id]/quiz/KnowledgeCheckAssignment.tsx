// ✅ Updated KnowledgeCheckAssignment.tsx with integrated API
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';

import { Card } from './ui/Card';
import { AssignmentHeader } from './header/AssignmentHeader';
import { TimerDisplay } from './header/TimerDisplay';
import { QuestionList } from './question/QuestionList';
import { QuestionDisplay } from './question/QuestionDisplay';
import { QuestionNavigation } from './question/QuestionNavigation';
import { QuizResultsPage } from './QuizResultsPage';
import { QuestionResultItemData, QuizResultsSummary, UserAnswer } from '@/types/quiz';
import { useGetQuizByIdQuery } from '@/lib/redux/features/quiz/quizApi';

const TOTAL_TIME_MINUTES = 30;

const KnowledgeCheckAssignment = () => {
  const { quizId } = useParams();
  const { data } = useGetQuizByIdQuery(quizId as string);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, Set<string>>>(new Map());
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_TIME_MINUTES * 60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResultsSummary | null>(null);

  const questions = useMemo(() => data?.quiz?.questions || [], [data?.quiz?.questions]);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = Math.min(100, Math.round((answers.size / questions.length) * 100));

  const calculateQuizResults = useCallback((isTimeOut: boolean = false): QuizResultsSummary => {
    let correctQuestionsCount = 0;
    let incorrectQuestionsCount = 0;
    let skippedQuestionsCount = 0;
    let totalScore = 0;
    let maxPossibleScore = 0;
    let attemptedQuestions = 0;

    const resultsBreakdown: QuestionResultItemData[] = questions.map((question: any, index: number) => {
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
      } else {
        attemptedQuestions++;
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
        }
        totalScore += pointsEarned;
      }

      return {
        questionNumber: question.questionNumber,
        status,
        questionData: question,
        userAnswer,
        pointsEarned,
        maxPoints: maxPointsForQuestion,
      };
    });

    return {
      totalQuestions: questions.length,
      attemptedQuestions,
      correctQuestions: correctQuestionsCount,
      incorrectQuestions: incorrectQuestionsCount,
      skippedQuestions: skippedQuestionsCount,
      totalScore,
      maxPossibleScore,
      overallStatus: isTimeOut ? 'time-out' : 'completed',
      resultsBreakdown,
    };
  }, [answers, questions]);

  const handleSubmit = useCallback((isTimeOut: boolean = false) => {
    const results = calculateQuizResults(isTimeOut);
    setQuizResults(results);
    setQuizSubmitted(true);
  }, [calculateQuizResults]);

  useEffect(() => {
    if (quizSubmitted) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizSubmitted, handleSubmit]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} Min`;
  };

  const handleSelectAnswer = useCallback((optionId: string, isMultipleAnswer: boolean) => {
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      let selected = newAnswers.get(currentQuestionIndex) || new Set<string>();
      if (isMultipleAnswer) {
        selected.has(optionId) ? selected.delete(optionId) : selected.add(optionId);
      } else {
        selected = new Set([optionId]);
      }
      newAnswers.set(currentQuestionIndex, selected);
      return newAnswers;
    });
  }, [currentQuestionIndex]);

  const handleNext = () => setCurrentQuestionIndex(i => Math.min(i + 1, questions.length - 1));
  const handlePrevious = () => setCurrentQuestionIndex(i => Math.max(i - 1, 0));
  const handleQuestionSelect = (index: number) => setCurrentQuestionIndex(index);

  const completedQuestions = new Set<number>(
    Array.from(answers.entries())
      .filter(([, selected]) => selected.size > 0)
      .map(([index]) => index)
  );

  const handleGoBack = () => alert('Going back!');
  const handleRetakeQuiz = () => {
    setQuizSubmitted(false);
    setQuizResults(null);
    setAnswers(new Map());
    setCurrentQuestionIndex(0);
    setSecondsLeft(TOTAL_TIME_MINUTES * 60);
  };

  if (quizSubmitted && quizResults) {
    return (
      <QuizResultsPage
        resultsSummary={quizResults}
        onRetakeQuiz={handleRetakeQuiz}
        onBackToCourses={handleGoBack}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7F8FA] overflow-hidden">
      <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[1172px] h-[467px] rounded-full bg-[radial-gradient(ellipse_105.86%_58.94%_at_50%_-5.86%,#5B78FF_0%,#F7F8FA_100%)]"></div>
      <Card className="relative z-10 mx-auto w-full max-w-[1319px] p-6 flex items-center justify-between">
        <AssignmentHeader progress={progress} onBackClick={handleGoBack} />
        <TimerDisplay timeLeft={formatTime(secondsLeft)} />
      </Card>
      <div className="relative z-10 mx-auto w-full max-w-[1319px] mt-10 flex flex-col md:flex-row gap-10 items-stretch">
        <div className="w-full md:w-[312px] flex flex-col gap-5 flex-grow">
          <Card className="p-6 h-full">
            <QuestionList
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              completedQuestions={completedQuestions}
            />
          </Card>
          <QuestionNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={() => handleSubmit(false)}
            canGoPrevious={currentQuestionIndex > 0}
            canGoNext={currentQuestionIndex < questions.length - 1}
          />
        </div>
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