'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmployeeModal = ({ isOpen, onClose }: AddEmployeeModalProps) => {
  const [activeTab, setActiveTab] = useState<'email' | 'file'>('email');
  const dialogRef = useRef<HTMLDialogElement>(null);

  // useEffect để đồng bộ trạng thái của dialog với prop `isOpen`
  // Cách làm này là một quy ước phổ biến và dễ hiểu trong React.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  // THAY ĐỔI 1: Thêm hàm xử lý khi click vào lớp phủ (backdrop)
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // Chỉ đóng modal nếu người dùng click trực tiếp vào backdrop (thẻ dialog)
    // chứ không phải vào nội dung bên trong nó.
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose} // Tự động gọi khi nhấn phím Escape
      onClick={handleBackdropClick} // THAY ĐỔI 2: Gán hàm xử lý backdrop click
      className="w-full max-w-md rounded-lg bg-transparent p-0 shadow-xl backdrop:bg-black backdrop:bg-opacity-50"
    >
      <div className="rounded-lg bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="dialog-title" className="text-xl font-semibold text-gray-900">
            Add New Employee
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 hover:cursor-pointer"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

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

        {/* THAY ĐỔI 3: Xóa comment không cần thiết và thêm nội dung tab */}
        <div>
          {activeTab === 'email' && <div>Email tab content...</div>}
          {activeTab === 'file' && <div>File upload tab content...</div>}
        </div>
      </div>
    </dialog>
  );
};

export default AddEmployeeModal;
