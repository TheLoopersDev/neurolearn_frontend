'use client';

// THAY ĐỔI 1: Import thêm useRef
import React, { useState, useEffect, useRef } from 'react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmployeeModal = ({ isOpen, onClose }: AddEmployeeModalProps) => {
  const [activeTab, setActiveTab] = useState<'email' | 'file'>('email');
  // THAY ĐỔI 2: Tạo một ref để tham chiếu đến element <dialog>
  const dialogRef = useRef<HTMLDialogElement>(null);

  // THAY ĐỔI 3: Dùng useEffect để điều khiển việc đóng/mở dialog
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal(); // Mở dialog dưới dạng modal
    } else {
      dialogRef.current?.close(); // Đóng dialog
    }
  }, [isOpen]);

  // THAY ĐỔI 4: Xử lý sự kiện khi dialog bị đóng (bằng phím Esc) để đồng bộ state
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // if (!isOpen) return null; // Không cần dòng này nữa vì dialog quản lý việc hiển thị

  return (
    // THAY ĐỔI 5: Sử dụng thẻ <dialog> và áp dụng ref
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="w-full max-w-md rounded-lg bg-transparent p-0 shadow-xl backdrop:bg-black backdrop:bg-opacity-50"
    >
      {/* Bao bọc nội dung trong một div để có nền trắng và padding */}
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

        <div>{/* Nội dung các tab ở đây (giữ nguyên) */}</div>
      </div>
    </dialog>
  );
};

export default AddEmployeeModal;
