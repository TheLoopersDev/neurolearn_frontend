// QuizBuilderPage.tsx
'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import QuestionListSidebar from './QuestionListSidebar';
import InstructorQuestionEditor from './InstructorQuestionEditor';
import QuizBuilderHeader from './QuizBuilderHeader'; // <<-- IMPORT COMPONENT HEADER MỚI
import { QuestionData, QuestionSummary } from './types';

// ... (Hàm getIconForQuestionType và initialQuizQuestions giữ nguyên như trước) ...
function getIconForQuestionType(type: QuestionData['questionType']): React.ReactNode {
  if (type === 'multiple-choice' || type === 'single-choice') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return null;
}
const initialQuizQuestions: QuestionData[] = [
  {
    id: 'q1',
    questionNumber: 1,
    title: 'Which planet is known as the Red Planet?',
    questionType: 'single-choice',
    questionImage: null,
    choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: true },
    options: [
      { id: 'q1_opt1', text: 'Mars' },
      { id: 'q1_opt2', text: 'Jupiter' },
      { id: 'q1_opt3', text: 'Venus' },
    ],
    correctAnswerIds: ['q1_opt1'],
    points: '01',
    isRequired: true,
  },
  {
    id: 'q2',
    questionNumber: 2,
    title: 'Select all prime numbers from the list:',
    questionType: 'multiple-choice',
    questionImage: null,
    choicesConfig: { isMultipleAnswer: true, isAnswerWithImageEnabled: false },
    options: [
      { id: 'q2_opt1', text: '2' },
      { id: 'q2_opt2', text: '4' },
      { id: 'q2_opt3', text: '7' },
      { id: 'q2_opt4', text: '9' },
    ],
    correctAnswerIds: ['q2_opt1', 'q2_opt3'],
    points: '02',
    isRequired: true,
  },
];

const QuizBuilderPage: React.FC = () => {
  const [questionsList, setQuestionsList] = useState<QuestionData[]>(initialQuizQuestions);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    initialQuizQuestions.length > 0 ? initialQuizQuestions[0].id : null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSelectQuestion = (id: string) => {
    setSelectedQuestionId(id);
    if (window.innerWidth < 768 && isSidebarOpen) {
      // setIsSidebarOpen(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestionNumber =
      questionsList.length > 0 ? Math.max(...questionsList.map(q => q.questionNumber)) + 1 : 1;
    const newQuestion: QuestionData = {
      id: `q_${Date.now()}`,
      questionNumber: newQuestionNumber,
      title: `New Question ${newQuestionNumber}`,
      questionType: 'single-choice',
      questionImage: null,
      choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
      options: [
        { id: `nqo_${Date.now()}_1`, text: 'Option A' },
        { id: `nqo_${Date.now()}_2`, text: 'Option B' },
      ],
      correctAnswerIds: [],
      points: '01',
      isRequired: true,
    };
    const newList = [...questionsList, newQuestion].sort(
      (a, b) => a.questionNumber - b.questionNumber
    );
    setQuestionsList(newList);
    setSelectedQuestionId(newQuestion.id);
    if (!isSidebarOpen && window.innerWidth >= 768) setIsSidebarOpen(true);
    else if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleQuestionDataUpdateFromEditor = useCallback((updatedData: QuestionData) => {
    setQuestionsList(prevList => prevList.map(q => (q.id === updatedData.id ? updatedData : q)));
  }, []);

  const questionSummaries: QuestionSummary[] = useMemo(
    () =>
      questionsList.map(q => ({
        id: q.id,
        number: q.questionNumber,
        textPreview: q.title.substring(0, 40) + (q.title.length > 40 ? '...' : ''),
        type: q.questionType,
        typeIcon: getIconForQuestionType(q.questionType),
      })),
    [questionsList]
  );

  const activeQuestionData = useMemo(
    () => questionsList.find(q => q.id === selectedQuestionId),
    [questionsList, selectedQuestionId]
  );

  const handleCreateQuiz = () => {
    console.log('Quiz Data to be created:', questionsList);
    alert('Create button clicked! (Check console for quiz data)');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 ">
      <QuizBuilderHeader title="Name Quiz" onCreateQuiz={handleCreateQuiz} />
      <div className="flex flex-grow overflow-hidden pt-6 gap-4 sm:gap-6 ">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="md:hidden fixed top-[calc(var(--header-height,64px)+1rem)] left-3 z-40 p-2 bg-white rounded-full shadow-lg text-blue-600 hover:bg-blue-50" // Điều chỉnh top dựa trên chiều cao header
            aria-label="Open sidebar"
            style={{ top: 'calc(4rem + 1rem)' }} // Ví dụ: header cao 4rem (64px)
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        <QuestionListSidebar
          questions={questionSummaries}
          selectedQuestionId={selectedQuestionId}
          activeQuestionNumber={activeQuestionData?.questionNumber}
          onSelectQuestion={handleSelectQuestion}
          onAddQuestion={handleAddQuestion}
        />
        {/* Main content area không cần padding nữa nếu container cha đã có */}
        <main className={`flex-grow overflow-y-auto transition-all duration-300 ease-in-out`}>
          {/* Div này không cần padding nếu QuizBuilderPage đã có padding cho khu vực này */}
          <div className="h-full">
            {activeQuestionData ? (
              <InstructorQuestionEditor
                key={selectedQuestionId}
                questionToLoad={activeQuestionData}
                onQuestionDataChange={handleQuestionDataUpdateFromEditor}
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[calc(100vh-150px)]">
                <p className="text-xl text-gray-500">
                  {questionsList.length > 0
                    ? 'Select a question to edit.'
                    : "No questions yet. Click '+' in the sidebar to add one!"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizBuilderPage;
