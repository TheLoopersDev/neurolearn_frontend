'use client'
import React, { useState, useEffect } from 'react';
import {
  Search, ChevronRight, ChevronLeft, Eye, Trash2
} from 'lucide-react';
import { useGetPendingRequestsQuery, useHandleRequestMutation } from '@/lib/redux/features/api/apiSlice';
import { useToast } from '@/hooks/use-toast';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { getCookie } from '@/lib/utils';

const categories = ['All instructors', 'UI/UX', 'Development', 'Data Science', 'Marketing', 'Creative'];

const ReviewInstructorPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All instructors');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'request' | 'instructors'>('request');
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [isInstructorLoading, setIsInstructorLoading] = useState(false);
  const [instructorError, setInstructorError] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);

  // API call cho request duyệt instructor
  const { data: requestData, isLoading: isRequestLoading, isError: isRequestError, refetch } = useGetPendingRequestsQuery({ type: 'instructor_verification' });
  const [handleRequest, { isLoading: isActionLoading }] = useHandleRequestMutation();

  // Ensure requestData is always an array
  const requestArray = Array.isArray(requestData) ? requestData : ((requestData as any)?.data || []);

  // Fetch instructors when tab is 'instructors'
  useEffect(() => {
    if (activeTab === 'instructors') {
      setIsInstructorLoading(true);
      setInstructorError('');
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/users/get-instructors`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.instructors)) {
            setInstructors(data.instructors);
          } else {
            setInstructors([]);
            setInstructorError('No data');
          }
        })
        .catch(() => {
          setInstructors([]);
          setInstructorError('Error loading instructors');
        })
        .finally(() => setIsInstructorLoading(false));
    }
  }, [activeTab]);

  // Pagination for instructors
  const instructorsPerPage = 9;
  const instructorTotalPages = Math.ceil(instructors.length / instructorsPerPage);
  const instructorStartIndex = (currentPage - 1) * instructorsPerPage;
  const currentInstructors = instructors.slice(instructorStartIndex, instructorStartIndex + instructorsPerPage);

  const handleTabChange = (tab: 'request' | 'instructors') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle instructor verification action
  const handleInstructorAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/request/instructor-verification/${requestId}/action`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: action === 'approve' ? 'Request Approved' : 'Request Rejected',
          description: action === 'approve'
            ? 'The instructor request has been approved successfully.'
            : 'The instructor request has been rejected successfully.',
          variant: 'success',
        });
        setCurrentPage(1);
        refetch();
      } else {
        throw new Error(result.message || 'Failed to process request');
      }
    } catch (err: any) {
      toast({
        title: action === 'approve' ? 'Approval Failed' : 'Rejection Failed',
        description: err?.message || 'An error occurred while processing the request.',
        variant: 'destructive',
      });
    }
  };

  // Pagination component
  const PaginationComponent = () => {
    const totalPages = Math.ceil((requestArray?.length || 0) / 10);
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pageNumbers = new Set<number>();
      pageNumbers.add(1);
      pageNumbers.add(totalPages);
      if (currentPage > 1) pageNumbers.add(currentPage - 1);
      pageNumbers.add(currentPage);
      if (currentPage < totalPages) pageNumbers.add(currentPage + 1);

      const sortedPages = Array.from(pageNumbers)
        .filter(p => p > 0 && p <= totalPages)
        .sort((a, b) => a - b);
      const finalPages: (number | string)[] = [];
      let lastPage = 0;

      for (const page of sortedPages) {
        if (lastPage !== 0 && page > lastPage + 1) {
          finalPages.push('...');
        }
        finalPages.push(page);
        lastPage = page;
      }
      return finalPages;
    };

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => {
              if (typeof page === 'number') {
                setCurrentPage(page);
              }
            }}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === page
              ? 'text-blue-600 bg-blue-50 border border-blue-300'
              : page === '...'
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Search and Filters */}
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                className="pl-12 pr-4 py-3 bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-80"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-gray-50 rounded-full px-6 py-3 pr-10 border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${activeTab === 'request'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                }`}
              onClick={() => handleTabChange('request')}
            >
              Request
            </button>
            <button
              className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${activeTab === 'instructors'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                }`}
              onClick={() => handleTabChange('instructors')}
            >
              Instructors
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse The Instructor</h1>

        {/* Tab content */}
        {activeTab === 'request' ? (
          <>
            {/* Table Container */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="col-span-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">User</div>
                <div className="col-span-3 text-sm font-semibold text-gray-600 uppercase tracking-wide ml-4">Company</div>
                <div className="col-span-2 text-sm font-semibold text-gray-600 uppercase tracking-wide ml-4">Category</div>
                <div className="col-span-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">Request Date</div>
                <div className="col-span-1 text-sm font-semibold text-gray-600 uppercase tracking-wide">Action</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-50">
                {isRequestLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (Array.isArray(requestData) ? false : (requestData && requestData.success === false && requestData.message === 'No pending requests found')) || !requestArray || requestArray.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No data</div>
                ) : (
                  requestArray.map((request: any, index: number) => {
                    const user = request.userId;
                    const requestData = request.data;

                    return (
                      <div key={request._id} className={`grid grid-cols-12 gap-4 px-6 py-6 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        {/* User */}
                        <div className="col-span-3 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user?.name || requestData?.fullName || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{user?.email || requestData?.email || 'N/A'}</div>
                          </div>
                        </div>
                        {/* Company */}
                        <div className="col-span-3 flex items-center ml-4">
                          <div className="font-medium text-gray-900">{requestData?.company || 'N/A'}</div>
                        </div>
                        {/* Category */}
                        <div className="col-span-2 flex items-center ml-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {requestData?.category || 'N/A'}
                          </span>
                        </div>
                        {/* Request Date */}
                        <div className="col-span-2 flex items-center">
                          <span className="text-gray-700 font-medium">{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        {/* Action */}
                        <div className="col-span-1 flex items-center justify-center gap-2">
                          <button
                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                            onClick={() => handleInstructorAction(request._id, 'reject')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {/* Modal for instructor details */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-40 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 py-8 backdrop-blur-sm bg-black/20">
                <Dialog.Panel className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-0 relative">
                  {selectedRequest && (
                    <>
                      {/* Header: Avatar, Name, Subtitle */}
                      <div className="flex flex-col items-center pt-8 pb-4 px-8">
                        {selectedRequest.userId?.avatar ? (
                          <Image src={selectedRequest.userId.avatar} alt="avatar" width={96} height={96} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-white shadow">
                            {selectedRequest.userId?.name ? selectedRequest.userId.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <div className="mt-4 text-2xl font-bold text-gray-900">{selectedRequest.userId?.name || selectedRequest.data?.fullName || 'N/A'}</div>
                        <div className="text-gray-500 text-base mt-1">{selectedRequest.userId?.profession || selectedRequest.data?.role || selectedRequest.data?.category || 'Instructor'}</div>
                      </div>
                      {/* 2 columns info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8 pb-4">
                        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                          <div><span className="text-xs text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{selectedRequest.data?.phone || 'N/A'}</span></div>
                          <div><span className="text-xs text-gray-500">Email Address:</span> <span className="font-medium text-gray-900">{selectedRequest.userId?.email || selectedRequest.data?.email || 'N/A'}</span></div>
                          <div><span className="text-xs text-gray-500">Date Born:</span> <span className="font-medium text-gray-900">{selectedRequest.data?.dob || 'N/A'}</span></div>
                          <div><span className="text-xs text-gray-500">Address:</span> <span className="font-medium text-gray-900">{selectedRequest.data?.address || 'N/A'}</span></div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                          <div><span className="text-xs text-gray-500">Experience:</span> <span className="font-medium text-gray-900">{selectedRequest.data?.experience || 'N/A'}</span></div>
                          <div><span className="text-xs text-gray-500">Roles:</span> <span className="font-medium text-gray-900">{selectedRequest.data?.role || 'N/A'}</span></div>
                          <div><span className="text-xs text-gray-500">Companies:</span> <span className="font-medium text-gray-900">{selectedRequest.data?.companies || selectedRequest.data?.company || 'N/A'}</span></div>
                        </div>
                      </div>
                      {/* About Me */}
                      <div className="px-8 pb-4">
                        <div className="font-semibold text-lg mb-1">About Me</div>
                        <div className="bg-gray-50 rounded-2xl p-4 text-gray-700 text-sm min-h-[60px]">
                          {selectedRequest.data?.description || selectedRequest.userId?.introduce || 'N/A'}
                        </div>
                      </div>
                      {/* Action buttons */}
                      <div className="flex justify-end gap-3 px-8 py-6 bg-white rounded-b-3xl">
                        <button
                          className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition"
                          onClick={async () => {
                            if (!selectedRequest) return;
                            await handleInstructorAction(selectedRequest._id, 'reject');
                            setIsModalOpen(false);
                          }}
                        >
                          Reject
                        </button>
                        <button
                          className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                          onClick={async () => {
                            if (!selectedRequest) return;
                            await handleInstructorAction(selectedRequest._id, 'approve');
                            setIsModalOpen(false);
                          }}
                        >
                          Approve
                        </button>
                      </div>
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </>
                  )}
                </Dialog.Panel>
              </div>
            </Dialog>
          </>
        ) : (
          <>
            {isInstructorLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : instructorError ? (
              <div className="text-center py-8 text-gray-500">{instructorError}</div>
            ) : currentInstructors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No data</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentInstructors.map((ins) => (
                  <div key={ins._id} className="bg-white rounded-3xl shadow-sm flex flex-col items-center p-6">
                    {ins.avatar?.url ? (
                      <img src={ins.avatar.url} alt={ins.name} className="w-20 h-20 rounded-full object-cover mb-4" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600 mb-4">
                        {ins.name ? ins.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="font-bold text-lg text-gray-900 text-center">{ins.name}</div>
                    <div className="text-gray-500 text-sm mb-2 text-center">{ins.profession || ins.role || 'INSTRUCTOR'}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 font-semibold">{ins.rating ?? 4.5}</span>
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                      <span className="text-gray-500 text-sm">{ins.student ?? 0} Students</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-5 py-1.5 rounded-full bg-gray-100 text-blue-600 font-medium text-[15px] hover:bg-blue-50 transition" onClick={() => { setSelectedInstructor(ins); setIsProfileModalOpen(true); }}>View profile</button>
                      <button className="px-5 py-1.5 rounded-full bg-blue-600 text-white font-medium text-[15px] hover:bg-blue-700 transition">Registration file</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination for instructors */}
            {instructorTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                {Array.from({ length: instructorTotalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === page ? 'text-blue-600 bg-blue-50 border border-blue-300' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(instructorTotalPages, p + 1))}
                  disabled={currentPage === instructorTotalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
        {isProfileModalOpen && selectedInstructor && (
          <Dialog open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} className="fixed z-40 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8 backdrop-blur-sm bg-black/20">
              <Dialog.Panel className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-0 relative">
                {/* Header: Avatar, Name, Subtitle */}
                <div className="flex flex-col items-center pt-8 pb-4 px-8">
                  {selectedInstructor.avatar?.url ? (
                    <img src={selectedInstructor.avatar.url} alt={selectedInstructor.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-white shadow">
                      {selectedInstructor.name ? selectedInstructor.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="mt-4 text-2xl font-bold text-gray-900">{selectedInstructor.name}</div>
                  <div className="text-gray-500 text-base mt-1">{selectedInstructor.profession || selectedInstructor.role || 'Instructor'}</div>
                </div>
                {/* 2 columns info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8 pb-4">
                  <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                    <div><span className="text-xs text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{selectedInstructor.phoneNumber || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500">Email Address:</span> <span className="font-medium text-gray-900">{selectedInstructor.email || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500">Date Born:</span> <span className="font-medium text-gray-900">{selectedInstructor.dob || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500">Address:</span> <span className="font-medium text-gray-900">{selectedInstructor.address || 'N/A'}</span></div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                    <div><span className="text-xs text-gray-500">Experience:</span> <span className="font-medium text-gray-900">{selectedInstructor.experience || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500">Roles:</span> <span className="font-medium text-gray-900">{selectedInstructor.role || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500">Companies:</span> <span className="font-medium text-gray-900">{selectedInstructor.companies || 'N/A'}</span></div>
                  </div>
                </div>
                {/* About Me */}
                <div className="px-8 pb-4">
                  <div className="font-semibold text-lg mb-1">About Me</div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-gray-700 text-sm min-h-[60px]">
                    {selectedInstructor.introduce || selectedInstructor.description || 'N/A'}
                  </div>
                </div>
                {/* Certificate Images (placeholder) */}
                <div className="px-8 pb-8">
                  <div className="font-semibold text-lg mb-1">Certificate Images</div>
                  <div className="flex gap-4 overflow-x-auto">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xl font-bold border border-dashed border-gray-300">
                        CERTIFICATE
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                  onClick={() => setIsProfileModalOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ReviewInstructorPage;
