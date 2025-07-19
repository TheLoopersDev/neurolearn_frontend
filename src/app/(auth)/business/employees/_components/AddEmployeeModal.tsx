'use client';

// THAY ĐỔI 1: Import thêm useEffect
import React, { useState, useEffect } from 'react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmployeeModal = ({ isOpen, onClose }: AddEmployeeModalProps) => {
  const [activeTab, setActiveTab] = useState<'email' | 'file'>('email');

  // THAY ĐỔI 2: Thêm hook để xử lý khi người dùng nhấn phím "Escape"
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Chỉ thêm event listener khi modal đang mở
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Dọn dẹp event listener khi component bị unmount hoặc khi modal đóng
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]); // Effect sẽ chạy lại nếu isOpen hoặc onClose thay đổi

  if (!isOpen) return null;

  return (
    // THAY ĐỔI 3: Thêm các thuộc tính role và aria-* để cải thiện accessibility
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true"></div>

      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          {/* THAY ĐỔI 4: Thêm id để aria-labelledby có thể tham chiếu đến */}
          <h2 id="dialog-title" className="text-xl font-semibold text-gray-900">
            Add New Employee
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 hover:cursor-pointer"
            aria-label="Close modal" // Thêm aria-label cho nút không có text
          >
            &times;
          </button>
        </div>

        {/* Phần còn lại của code không thay đổi */}
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setActiveTab('email')}
            className={`py-2 px-4 hover:cursor-pointer ${
              activeTab === 'email'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500'
            }`}
          >
            Add by Email
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`py-2 px-4 hover:cursor-pointer ${
              activeTab === 'file'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500'
            }`}
          >
            Add by File (.xlsx)
          </button>
        </div>

        <div>{/* ... Nội dung các tab ... */}</div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
