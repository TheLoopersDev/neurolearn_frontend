'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmployeeModal = ({ isOpen, onClose }: AddEmployeeModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // useEffect để đồng bộ trạng thái của dialog với prop `isOpen`
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal(); // Dùng phương thức tích hợp sẵn để mở modal
      } else {
        dialog.close(); // Dùng phương thức tích hợp sẵn để đóng modal
      }
    }
  }, [isOpen]);

  // Xử lý việc click vào lớp nền mờ (backdrop) để đóng modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    // Thẻ <dialog> là thành phần gốc, không cần thẻ div bao ngoài
    <dialog
      ref={dialogRef}
      onClose={onClose} // Tự động gọi khi người dùng nhấn phím Escape
      onClick={handleBackdropClick} // Xử lý khi click vào backdrop
      // Style cho dialog và lớp nền mờ bằng Tailwind
      className="w-full max-w-md rounded-lg bg-transparent p-0 shadow-xl backdrop:bg-black backdrop:bg-opacity-50"
    >
      {/* Nội dung trực quan của modal nằm trong một div riêng */}
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

        <EmailFileTabs />
      </div>
    </dialog>
  );
};

// Component con để quản lý các tab (giữ nguyên)
function EmailFileTabs() {
  const [activeTab, setActiveTab] = useState<'email' | 'file'>('email');

  return (
    <>
      <div className="flex mb-4 border-b">
        <button
          onClick={() => setActiveTab('email')}
          className={`py-2 px-4 hover:cursor-pointer ${
            activeTab === 'email' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'
          }`}
        >
          Add by Email
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`py-2 px-4 hover:cursor-pointer ${
            activeTab === 'file' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'
          }`}
        >
          Add by File (.xlsx)
        </button>
      </div>

      <div>
        {activeTab === 'email' && <div>Email tab content...</div>}
        {activeTab === 'file' && <div>File upload tab content...</div>}
      </div>
    </>
  );
}

export default AddEmployeeModal;
