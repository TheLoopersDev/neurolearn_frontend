// app/(auth)/dashboard/create-quiz/_components/QuizBuilderHeader.tsx
'use client';
import React from 'react';

interface QuizBuilderHeaderProps {
  title?: string; // Sẽ là "Name Quiz" hoặc tên của quiz đang sửa
  onSaveQuiz: () => void; // Đổi tên từ onCreateQuiz cho rõ ràng hơn
  isEditing: boolean; // Để biết nút nên là "Create" hay "Update"
  // onCreateWithAI?: () => void; // Tùy chọn
}

const QuizBuilderHeader: React.FC<QuizBuilderHeaderProps> = ({
  onSaveQuiz,
  isEditing,
  // onCreateWithAI,
}) => {
  return (
    <header className="p-3 sm:p-4 flex items-center justify-between flex-shrink-0 z-10">
      <h1 className=" text-lg sm:text-xl font-semibold text-gray-800 truncate"></h1>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onSaveQuiz}
          className="bg-blue-500 text-white px-5 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Create Quiz'}
        </button>
      </div>
    </header>
  );
};

export default QuizBuilderHeader;
