'use client'; // Nếu có state hoặc event handlers cần client-side
import React from 'react';
// Import IconAI từ đường dẫn chính xác của bạn

interface QuizBuilderHeaderProps {
  title: string;
  onCreateQuiz: () => void;
  onCreateQuizWithAI?: () => void; // Optional: nếu bạn có chức năng này
}

const QuizBuilderHeader: React.FC<QuizBuilderHeaderProps> = ({ title, onCreateQuiz }) => {
  return (
    <header className="bg-white rounded-2xl p-3 sm:p-4 flex items-center justify-between flex-shrink-0 z-20 shadow-sm">
      <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onCreateQuiz}
          className="bg-blue-500 rounded-2xl text-white px-8 sm:px-8  py-2  text-xs sm:text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Create
        </button>
      </div>
    </header>
  );
};

export default QuizBuilderHeader;
