// app/(auth)/dashboard/create-quiz/_components/CreateQuizModal.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronDown, UploadCloud, Plus, ArrowLeft, Minus } from 'lucide-react';
import { ManualCreationDetails, AICreationDetails } from '../../../../../types/quiz'; // Đảm bảo đường dẫn đúng

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: ManualCreationDetails | AICreationDetails) => void;
}

type ModalStep = 'initialStep' | 'aiForm'; // Chỉ cần 2 bước chính

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('initialStep');

  // States chung cho bước đầu, cũng có thể dùng cho tên quiz ở bước AI
  const [examTitle, setExamTitle] = useState('');
  const [duration, setDuration] = useState('');
  // State để lưu lựa chọn chế độ ở bước đầu tiên
  const [creationModeSelection, setCreationModeSelection] = useState<'manual' | 'ai'>('manual');

  // States riêng cho Form AI (Bước 2)
  const [aiScannedFile, setAiScannedFile] = useState<File | null>(null);
  const [aiDifficultyLevel, setAiDifficultyLevel] = useState('Easy');
  const [aiTopic, setAiTopic] = useState('');
  const [aiQuestionTypes, setAiQuestionTypes] = useState([{ type: 'multiple-choice', count: 1 }]);

  // Reset form khi modal mở hoặc khi quay lại bước đầu
  const resetInitialStepFields = () => {
    setExamTitle('');
    setDuration('');
    setCreationModeSelection('manual');
  };

  const resetAiFormFields = () => {
    setAiScannedFile(null);
    setAiDifficultyLevel('Easy');
    setAiTopic('');
    setAiQuestionTypes([{ type: 'multiple-choice', count: 1 }]);
  };

  const resetForms = useCallback(() => {
    resetInitialStepFields();
    resetAiFormFields();
  }, []); // Empty dependency array since these functions are stable

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('initialStep');
      resetForms(); // Reset all when modal opens
    }
  }, [isOpen, resetForms]);

  const handleClose = () => {
    setCurrentStep('initialStep'); // Luôn quay về bước chọn khi đóng hoàn toàn
    resetForms();
    onClose();
  };

  // Xử lý khi nhấn nút chính ở Bước 1 ("Create Test" hoặc "Next")
  const handleInitialStepSubmit = () => {
    if (!examTitle.trim()) {
      alert('Please enter an Exam Title.'); // Cân nhắc dùng toast
      return;
    }
    // Duration có thể không bắt buộc

    if (creationModeSelection === 'manual') {
      onSubmit({
        mode: 'manual',
        examTitle: examTitle,
        duration: duration,
      });
      handleClose(); // Đóng modal và reset
    } else if (creationModeSelection === 'ai') {
      // Không reset examTitle ở đây vì có thể muốn dùng nó cho form AI
      setCurrentStep('aiForm');
    }
  };

  // Xử lý khi nhấn "Generate" ở Bước 2 (AI Form)
  const handleAiFormSubmit = () => {
    if (!examTitle.trim() && !aiScannedFile && !aiTopic.trim()) {
      alert('Please provide an Exam Title, scan a document, or enter a topic for AI mode.');
      return;
    }
    if (aiQuestionTypes.reduce((sum, qt) => sum + qt.count, 0) === 0) {
      alert('Please specify the number of questions to generate.');
      return;
    }
    onSubmit({
      mode: 'ai',
      examTitle: examTitle, // Sử dụng examTitle đã nhập ở bước 1 (hoặc người dùng có thể sửa)
      documentFile: aiScannedFile,
      difficultyLevel: aiDifficultyLevel,
      topic: aiTopic,
      questionConfigs: aiQuestionTypes,
    });
    handleClose(); // Đóng modal và reset
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('File is too large! Maximum 10MB.');
        event.target.value = ''; // Reset input file
        return;
      }
      setAiScannedFile(file);
    }
  };
  const handleAiQuestionTypeChange = (
    index: number,
    field: 'type' | 'count',
    value: string | number
  ) => {
    const newTypes = [...aiQuestionTypes];
    const currentConfig = { ...newTypes[index] }; // Tạo bản sao để tránh mutate trực tiếp

    if (field === 'type') {
      currentConfig.type = value as string;
    } else if (field === 'count') {
      const count = Math.max(1, Number(value));
      currentConfig.count = count;
    }
    newTypes[index] = currentConfig;
    setAiQuestionTypes(newTypes);
  };

  const addAiQuestionTypeConfig = () => {
    if (aiQuestionTypes.length < 3) {
      setAiQuestionTypes([...aiQuestionTypes, { type: 'multiple-choice', count: 1 }]);
    } else {
      alert('Maximum of 3 question type configurations reached.');
    }
  };

  if (!isOpen) {
    return null;
  }

  // --- Giao diện cho Bước 1: Nhập thông tin cơ bản và Chọn chế độ ---
  const renderInitialStep = () => (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create A Test</h2>

        <div className="w-[390px] h-[160px] mx-auto rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                      {/* Replace with icon suitable for "Create A Test" more general */}
          <Image
            src="/assets/create-quiz/Rectangle 576.png"
            alt="Create Test Icon"
            width={390}
            height={160}
          />
        </div>
      </div>
      <div className="space-y-5">
        <div>
          <label htmlFor="modalExamTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Exam Title
          </label>
          <input
            type="text"
            id="modalExamTitle"
            value={examTitle}
            onChange={e => setExamTitle(e.target.value)}
            placeholder="Your course title"
            className="w-full text-gray-700 px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <label htmlFor="modalDuration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <div className="relative">
            <select
              id="modalDuration"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full text-gray-700 appearance-none px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            >
              <option value="" disabled>
                Select timer
              </option>
              <option value="15 Min">15 Minutes</option>
              <option value="30 Min">30 Minutes</option>
              <option value="45 Min">45 Minutes</option>
              <option value="60 Min">1 Hour</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
        {/* Lựa chọn cách tạo */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {/* Create Manually */}
          <button
            onClick={() => setCreationModeSelection('manual')}
            className={`
                p-4 border rounded-xl text-left transition-all duration-200
                ${creationModeSelection === 'manual' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-white'}
              `}
          >
            <div className="flex items-start justify-between mb-1">
              <div className={` mb-4 rounded-md ${creationModeSelection === 'manual'}`}>
                <Image
                  src="/assets/create-quiz/message-edit.svg"
                  alt="Create Test"
                  width={65}
                  height={65}
                />
              </div>
              {/* Radio button giả */}
              <div
                className={`w-5 h-5 justify-center rounded-full border-2 flex items-center  ${creationModeSelection === 'manual' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}
              >
                {creationModeSelection === 'manual' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-sm text-gray-800">Create manually</h3>
            <p className="text-xs text-gray-500">Build your test the way you want</p>
          </button>

          {/* Create with AI */}
          <button
            onClick={() => setCreationModeSelection('ai')}
            className={`
                p-4 border rounded-xl text-left transition-all duration-200
                ${creationModeSelection === 'ai' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-white'}
              `}
          >
            <div className="flex items-start justify-between mb-1">
              <div className={`rounded-md mb-4 ${creationModeSelection === 'ai'}`}>
                <Image
                  src="/assets/create-quiz/magicpen.svg"
                  alt="Create Test"
                  width={65}
                  height={65}
                />
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${creationModeSelection === 'ai' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}
              >
                {creationModeSelection === 'ai' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-sm text-gray-800">Create with AI</h3>
            <p className="text-xs text-gray-500">Auto-generate your test with AI assistance</p>
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleClose}
          className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleInitialStepSubmit}
          className="w-full sm:w-1/2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {creationModeSelection === 'manual' ? 'Create Test' : 'Next'}
        </button>
      </div>
    </>
  );

  // --- Giao diện cho Bước 2: Form AI (Hình 2) ---
  const renderAiForm = () => (
    <>
      <div className="flex items-center mb-6">
        <button
          onClick={() => {
            setCurrentStep('initialStep');
            resetAiFormFields(); /* Giữ lại examTitle và duration nếu muốn */
          }}
          className="p-1.5 mr-2 text-gray-500 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Create with AI</h2>
      </div>
      <div className="space-y-4 max-h-[calc(100vh-280px)] sm:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {' '}
        {/* Điều chỉnh max-h */}
        <div>
          {' '}
          {/* Giữ lại Exam Title từ bước 1, có thể cho phép sửa */}
          <label htmlFor="aiFormExamTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Exam Title
          </label>
          <input
            type="text"
            id="aiFormExamTitle"
            value={examTitle}
            onChange={e => setExamTitle(e.target.value)}
            placeholder="e.g., Mid-term UI/UX Exam"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scan From document <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <label
            htmlFor="aiScanDoc"
            className="mt-1 flex justify-center px-4 py-5 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 bg-gray-50 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <UploadCloud size={28} className="mx-auto text-gray-400" />
              <div className="flex flex-col text-sm text-gray-600 mt-1">
                <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>{aiScannedFile ? aiScannedFile.name : 'Choose folder/File'}</span>
                </span>
                {!aiScannedFile && <span className="text-gray-500">or drag and drop</span>}
              </div>
              {!aiScannedFile && (
                <p className="text-xs text-gray-500 mt-0.5">PDF, DOCX, TXT up to 10MB</p>
              )}
            </div>
            <input
              id="aiScanDoc"
              name="aiScanDoc"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
            />
          </label>
          {aiScannedFile && (
            <p className="mt-1 text-xs text-green-600">Selected: {aiScannedFile.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="aiDifficultyLevel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Difficulty Level
          </label>
          <div className="relative">
            <select
              id="aiDifficultyLevel"
              value={aiDifficultyLevel}
              onChange={e => setAiDifficultyLevel(e.target.value)}
              className="w-full appearance-none px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="aiTopic" className="block text-sm font-medium text-gray-700 mb-1">
            Topic <span className="text-gray-400 text-xs">(Required if no document)</span>
          </label>
          <input
            type="text"
            id="aiTopic"
            value={aiTopic}
            onChange={e => setAiTopic(e.target.value)}
            placeholder="e.g., History of Ancient Rome, JavaScript Basics"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        {aiQuestionTypes.map((config, index) => (
          <div key={index} className="space-y-1 p-3 border border-gray-200 rounded-lg bg-white">
            <label className="block text-xs font-medium text-gray-600">
              Question Type #{index + 1}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <select
                  value={config.type}
                  onChange={e => handleAiQuestionTypeChange(index, 'type', e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="multiple-choice">Multiple choice</option>
                  <option value="single-choice">Single choice</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleAiQuestionTypeChange(index, 'count', config.count - 1)}
                  className="p-1.5 px-2.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  disabled={config.count <= 1}
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={config.count}
                  readOnly
                  className="w-10 text-center border-l border-r border-gray-300 text-sm py-1.5 focus:outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleAiQuestionTypeChange(index, 'count', config.count + 1)}
                  className="p-1.5 px-2.5 text-gray-600 hover:bg-gray-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addAiQuestionTypeConfig}
          className="flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium py-1.5 px-2 rounded-md hover:bg-blue-50"
        >
          <Plus size={14} className="mr-1" /> Add type quiz
        </button>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => {
            setCurrentStep('initialStep'); /* Không reset AI form ở đây để user có thể quay lại */
          }}
          className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleAiFormSubmit}
          className="w-full sm:w-1/2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Generate
        </button>
      </div>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-7 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {currentStep === 'initialStep' && renderInitialStep()}
        {currentStep === 'aiForm' && renderAiForm()}
      </div>
    </div>
  );
};

export default CreateQuizModal;
