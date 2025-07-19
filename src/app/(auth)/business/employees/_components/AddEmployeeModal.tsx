'use client';

import React, { useEffect, useRef } from 'react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmployeeModal = ({ isOpen, onClose }: AddEmployeeModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="presentation"
      tabIndex={-1}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <dialog
        ref={dialogRef}
        className="w-full max-w-md rounded-lg bg-transparent p-0 shadow-xl open:block"
        open
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={e => e.stopPropagation()}
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

          <EmailFileTabs />

          {/* Phần nội dung form hoặc upload file của bạn */}
        </div>
      </dialog>
    </div>
  );
};

function EmailFileTabs() {
  const [activeTab, setActiveTab] = React.useState<'email' | 'file'>('email');

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
