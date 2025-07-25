'use client'
import React, { useState } from "react";
import { ReviewHeader, ReviewTable, ReviewTableRow, ReviewPagination, ReviewModal } from "@/components/review-common";
import { Eye, Trash2 } from 'lucide-react';

const categories = ['All courses', 'UI/UX', 'Development', 'Data Science', 'Marketing', 'Creative'];

const businessList = Array(9).fill({
  logo: '/assets/images/avatar.png',
  name: 'Academix',
  industry: 'INFORMATION TECHNOLOGY',
});

const BusinessRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All courses');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'request' | 'business'>('request');

  const requests = Array(10).fill({
    avatar: "/assets/images/avatar.png",
    name: "Dao Tuan Kiet",
    email: "kietdqt170088@gmail.com",
    companyName: "Academix",
    requestDate: "05 Jan, 2025",
    reason: 'I want to upgrade my account to business to manage courses for my company.',
  });

  const handleView = (request: any) => {
    setSelected(request);
    setOpen(true);
  };

  const headers = [
    { label: 'User', className: 'col-span-3' },
    { label: 'Company Name', className: 'col-span-3' },
    { label: 'Request Date', className: 'col-span-3' },
    { label: 'Progress', className: 'col-span-2' },
    { label: '', className: 'col-span-1' },
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = requests.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <ReviewHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          activeTab={activeTab}
          onTabChange={tab => setActiveTab(tab as 'request' | 'business')}
          tabOptions={[
            { value: 'request', label: 'Request' },
            { value: 'business', label: 'Business' },
          ]}
        />

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse The User</h1>

        {activeTab === 'request' ? (
          <>
            <ReviewTable headers={headers}>
              {currentRequests.map((request, index) => (
                <ReviewTableRow key={index} index={index}>
                  {/* User */}
                  <div className="col-span-3 flex items-center gap-3">
                    <img src={request.avatar} alt={request.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" />
                    <div>
                      <div className="font-semibold text-gray-900">{request.name}</div>
                      <div className="text-sm text-gray-500">{request.email}</div>
                    </div>
                  </div>
                  {/* Company Name */}
                  <div className="col-span-3 flex items-center">
                    <span className="text-gray-700 font-medium">{request.companyName}</span>
                  </div>
                  {/* Request Date */}
                  <div className="col-span-3 flex items-center">
                    <span className="text-gray-700 font-medium">{request.requestDate}</span>
                  </div>
                  {/* Progress (Eye Icon) */}
                  <div className="col-span-2 flex items-center justify-center">
                    <button 
                      onClick={() => handleView(request)}
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
            <ReviewModal open={open} onClose={() => setOpen(false)} title="Business Request Information" maxWidth="max-w-xl">
              <div className="flex flex-col md:flex-row gap-6">
                {/* User info */}
                <div className="flex-1 bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={selected?.avatar} alt={selected?.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold">{selected?.name}</div>
                      <div className="text-xs text-gray-500">{selected?.email}</div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm mb-1">Company Name</div>
                  <div className="font-semibold mb-4">{selected?.companyName}</div>
                  <div className="text-gray-500 text-sm mb-1">Reason</div>
                  <div className="text-sm">{selected?.reason}</div>
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
          </>
        ) : (
          // Tab Business: Grid card view
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {businessList.map((biz, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm flex flex-col items-center p-8">
                  <img src={biz.logo} alt={biz.name} className="w-24 h-24 rounded-full object-cover mb-4" />
                  <div className="font-bold text-xl mb-1">{biz.name}</div>
                  <div className="text-gray-500 text-sm mb-6">{biz.industry}</div>
                  <button className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all">
                    Registration file
                  </button>
                </div>
              ))}
            </div>
            <ReviewPagination
              currentPage={1}
              totalPages={2}
              onPageChange={() => {}}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BusinessRequestsPage; 