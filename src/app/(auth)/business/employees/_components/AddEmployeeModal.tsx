'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmployeeModal = ({ isOpen, onClose }: AddEmployeeModalProps) => {
  const [activeTab, setActiveTab] = useState<'email' | 'file'>('email');
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Đồng bộ trạng thái mở/đóng dialog
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

  // Ngăn sự kiện click vào nội dung bên trong đóng modal
  const handleDialogClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    isOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onKeyDown={e => {
          if (e.key === 'Escape') onClose();
        }}
      >
        <dialog
          ref={dialogRef}
          className="w-full max-w-md rounded-lg bg-transparent p-0 shadow-xl open:block"
          open
        >
          <div className="rounded-lg bg-white p-6" onClick={handleDialogClick}>
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

            <div>
              {activeTab === 'email' && <div>Email tab content...</div>}
              {activeTab === 'file' && <div>File upload tab content...</div>}
            </div>
          </div>
        </dialog>
      </div>
    )
  );
};

export default AddEmployeeModal;
