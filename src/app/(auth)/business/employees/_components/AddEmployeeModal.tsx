'use client';

import React, { useState } from 'react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmployeeModal = ({ isOpen, onClose }: AddEmployeeModalProps) => {
  const [activeTab, setActiveTab] = useState<'email' | 'file'>('email');

  if (!isOpen) return null;

  return (
    // THAY ĐỔI 1: Thêm onClick={onClose} vào lớp phủ (overlay)
    <div className="fixed inset-0 z-[999] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* THAY ĐỔI 2: Ngăn sự kiện click lan ra ngoài khi nhấn vào content */}
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Employee</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 hover:cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Tab Buttons */}
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

        {/* Tab Content */}
        <div>
          {activeTab === 'email' && (
            <div className="space-y-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Employee Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="e.g., employee@example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 hover:cursor-pointer">
                Send Invite
              </button>
            </div>
          )}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                Upload XLSX File
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <p className="text-xs text-gray-500">XLSX up to 10MB</p>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".xlsx"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <button className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 hover:cursor-pointer">
                Import Employees
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
