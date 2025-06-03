// QuizBuilderPage.tsx
'use client';
import React, { useState, useMemo, useCallback } from 'react';
import QuestionListSidebar from './QuestionListSidebar';
import InstructorQuestionEditor from './InstructorQuestionEditor';
import { QuestionData, QuestionSummary } from './types'; // Bỏ AnswerOptionData nếu không dùng trực tiếp ở đây

function getIconForQuestionType(type: QuestionData['questionType']): React.ReactNode {
  if (type === 'multiple-choice' || type === 'single-choice') {
    // Gộp icon cho cả hai
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
  return null; // Hoặc icon mặc định khác
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

  const handleSelectQuestion = (id: string) => {
    setSelectedQuestionId(id);
  };

  const handleAddQuestion = () => {
    const newQuestionNumber =
      questionsList.length > 0 ? Math.max(...questionsList.map(q => q.questionNumber)) + 1 : 1;
    const newQuestion: QuestionData = {
      id: `q_${Date.now()}`,
      questionNumber: newQuestionNumber,
      title: `New Question ${newQuestionNumber}`,
      questionType: 'single-choice', // Mặc định là single-choice
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
  };

  const handleQuestionDataUpdateFromEditor = useCallback((updatedData: QuestionData) => {
    setQuestionsList(prevList => prevList.map(q => (q.id === updatedData.id ? updatedData : q)));
  }, []); // Dependency array rỗng, hàm này ổn định

  const questionSummaries: QuestionSummary[] = useMemo(
    () =>
      questionsList.map(q => ({
        id: q.id,
        number: q.questionNumber,
        textPreview: q.title.substring(0, 40) + (q.title.length > 40 ? '...' : ''),
        type: q.questionType, // Lấy trực tiếp từ questionType
        typeIcon: getIconForQuestionType(q.questionType),
      })),
    [questionsList]
  );

  const activeQuestionData = useMemo(
    () => questionsList.find(q => q.id === selectedQuestionId),
    [questionsList, selectedQuestionId]
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <QuestionListSidebar
        questions={questionSummaries}
        selectedQuestionId={selectedQuestionId}
        activeQuestionNumber={activeQuestionData?.questionNumber}
        onSelectQuestion={handleSelectQuestion}
        onAddQuestion={handleAddQuestion}
      />
      <main className="flex-grow p-4 sm:p-6 overflow-y-auto">
        {activeQuestionData ? (
          <InstructorQuestionEditor
            key={selectedQuestionId} // Rất QUAN TRỌNG để reset component khi chọn câu hỏi khác
            questionToLoad={activeQuestionData}
            onQuestionDataChange={handleQuestionDataUpdateFromEditor}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">
              {questionsList.length > 0
                ? 'Select a question to edit.'
                : "No questions yet. Click '+' in the sidebar to add one!"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizBuilderPage;
