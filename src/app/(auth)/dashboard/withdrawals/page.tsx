'use client'
import React, { useState } from "react";
import { ReviewHeader, ReviewTable, ReviewTableRow, ReviewPagination, ReviewModal } from "@/components/review-common";
import { Eye, Trash2 } from 'lucide-react';

const categories = ['All courses', 'UI/UX', 'Development', 'Data Science', 'Marketing', 'Creative'];

const WithdrawalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All courses');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const users = Array(10).fill({
    avatar: "/assets/images/avatar.png",
    name: "Dao Tuan Kiet",
    email: "kietdqt170088@gmail.com",
    requestDate: "05 Jan, 2025",
    requestedAmount: "300.000 VND",
    reason: 'I would like to withdraw the amount earned from teaching the "Graphic Design Masterclass" course.',
    bank: "Ngân hàng TMCP Quân đội",
    cardName: "DAO TUAN KIET",
    cardNumber: "987 478 456 123 456",
  });

  const handleView = (user: any) => {
    setSelected(user);
    setOpen(true);
  };

  const headers = [
    { label: 'User', className: 'col-span-3' },
    { label: 'Request Date', className: 'col-span-3' },
    { label: 'Requested Amount', className: 'col-span-3' },
    { label: 'Progress', className: 'col-span-2' },
    { label: '', className: 'col-span-1' },
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <ReviewHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          activeTab="withdrawals"
          onTabChange={() => {}}
          tabOptions={[
            { value: 'withdrawals', label: 'Withdrawals' }
          ]}
        />

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse The User</h1>

        <ReviewTable headers={headers}>
          {currentUsers.map((user, index) => (
            <ReviewTableRow key={index} index={index}>
              {/* User */}
              <div className="col-span-3 flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" />
                <div>
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              {/* Request Date */}
              <div className="col-span-3 flex items-center">
                <span className="text-gray-700 font-medium">{user.requestDate}</span>
              </div>
              {/* Requested Amount */}
              <div className="col-span-3 flex items-center">
                <span className="text-gray-700 font-medium">{user.requestedAmount}</span>
              </div>
              {/* Progress (Eye Icon) */}
              <div className="col-span-2 flex items-center justify-center">
                <button 
                  onClick={() => handleView(user)}
                  className="p-2 rounded-full hover:bg-blue-50 transition-colors group"
                  title="View Details"
                >
                  <Eye className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                </button>
              </div>
              {/* Actions (Delete Icon) */}
              <div className="col-span-1 flex items-center justify-center">
                <button 
                  className="p-2 rounded-full hover:bg-orange-50 transition-colors group"
                  title="Delete Request"
                >
                  <Trash2 className="w-5 h-5 text-orange-400 group-hover:text-orange-500" />
                </button>
              </div>
            </ReviewTableRow>
          ))}
        </ReviewTable>

        <ReviewPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <ReviewModal open={open} onClose={() => setOpen(false)} title="Withdrawal Request Details">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: User info */}
            <div className="flex-1 bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src={selected?.avatar} alt={selected?.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{selected?.name}</div>
                  <div className="text-xs text-gray-500">{selected?.email}</div>
                </div>
              </div>
              <div className="text-gray-500 text-sm mb-1">Requested Amount</div>
              <div className="text-blue-600 text-2xl font-bold mb-4">{selected?.requestedAmount}</div>
              <div className="text-gray-500 text-sm mb-1">Reason</div>
              <div className="text-sm">{selected?.reason}</div>
            </div>
            {/* Right: Bank info */}
            <div className="flex-1 bg-gray-50 rounded-xl p-6">
              <div className="text-gray-500 text-sm mb-1">Bank</div>
              <div className="font-semibold mb-4">{selected?.bank}</div>
              <div className="text-gray-500 text-sm mb-1">Card Name</div>
              <div className="font-semibold mb-4">{selected?.cardName}</div>
              <div className="text-gray-500 text-sm mb-1">Card Number</div>
              <div className="flex items-center gap-2 font-semibold text-lg">
                {selected?.cardNumber}
                <button
                  className="ml-2 px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs hover:bg-gray-200"
                  onClick={() => navigator.clipboard.writeText(selected?.cardNumber || '')}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:bg-gray-200"
              onClick={() => setOpen(false)}
            >
              Reject
            </button>
            <button
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
              onClick={() => setOpen(false)}
            >
              Approve
            </button>
          </div>
        </ReviewModal>
      </div>
    </div>
  );
};

export default WithdrawalsPage; 