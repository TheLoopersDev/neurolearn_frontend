'use client';
import React, { useState, useEffect } from 'react';
import { ReviewHeader, ReviewTable, ReviewTableRow, ReviewPagination, ReviewModal } from '@/components/review-common';
import { useGetPendingRequestsQuery, useHandleRequestMutation } from '@/lib/redux/features/api/apiSlice';
import { useToast } from '@/hooks/use-toast';

const categories = ['All requests', 'UI/UX', 'Development', 'Data Science', 'Marketing', 'Creative'];
const statusOptions = ['all', 'pending', 'approved', 'rejected'];

const businessList = Array(9).fill({
  logo: '/assets/images/avatar.png',
  name: 'Academix',
  industry: 'INFORMATION TECHNOLOGY',
});

const BusinessRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All requests');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'request' | 'business'>('request');
  const { toast } = useToast();

  // API call for business approval requests
  const { data: requestData, isLoading: isRequestLoading, refetch } = useGetPendingRequestsQuery({
    type: 'business_verification',
    status: selectedStatus
  });
  const [handleRequest] = useHandleRequestMutation();

  // Refetch when status changes
  useEffect(() => {
    refetch();
  }, [selectedStatus, refetch]);

  const handleView = (request: any) => {
    setSelected(request);
    setOpen(true);
  };

  const handleApproveOrReject = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await handleRequest({ type: 'business_verification', requestId, action }).unwrap();
      setCurrentPage(1);
      toast({
        title: action === 'approve' ? 'Request Approved' : 'Request Rejected',
        description: action === 'approve'
          ? 'The business request has been approved successfully.'
          : 'The business request has been rejected successfully.',
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        title: action === 'approve' ? 'Approval Failed' : 'Rejection Failed',
        description: err?.data?.message || err?.error || 'An error occurred while processing the request.',
        variant: 'destructive',
      });
    }
  };

  const headers = [
    { label: 'User', className: 'col-span-3' },
    { label: 'Company Name', className: 'col-span-3' },
    { label: 'Request Date', className: 'col-span-3' },
      { label: 'Approve', className: 'col-span-2' },
  { label: 'Reject', className: 'col-span-1' },
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil((requestData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = requestData?.slice(startIndex, startIndex + itemsPerPage) || [];

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
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          statusOptions={statusOptions}
          showStatusFilter={activeTab === 'request'}
        />

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse The User</h1>

        {activeTab === 'request' ? (
          <>
            {/* actionMessage && <div className="mb-4 text-center text-red-500">{actionMessage}</div> */}
            <ReviewTable headers={headers}>
              {isRequestLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (Array.isArray(requestData) ? false : ((requestData as any) && (requestData as any).success === false && (requestData as any).message === 'No pending requests found')) || !requestData || requestData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No data</div>
              ) : (
                currentRequests.map((request: any, index: number) => (
                  <ReviewTableRow key={request._id || request.id} index={index}>
                    {/* User */}
                    <div className="col-span-3 flex items-center gap-3">
                      <img src={request.avatar || request.avatarUrl || "/assets/images/avatar.png"} alt={request.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" />
                      <div>
                        <div className="font-semibold text-gray-900">{request.name}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                      </div>
                    </div>
                    {/* Company Name */}
                    <div className="col-span-3 flex items-center">
                      <span className="text-gray-700 font-medium">{request.companyName || request.businessName || 'N/A'}</span>
                    </div>
                    {/* Request Date */}
                    <div className="col-span-3 flex items-center">
                      <span className="text-gray-700 font-medium">{request.requestDate || (request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A')}</span>
                    </div>
                    {/* Approve */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                        onClick={() => handleView(request)}
                      >
                        View
                      </button>
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                        onClick={() => handleApproveOrReject(request._id || request.id, 'approve')}
                      >
                        Approve
                      </button>
                    </div>
                    {/* Reject */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                        // disabled={isActionLoading} // This state variable is not defined in the original file
                        onClick={() => handleApproveOrReject(request._id || request.id, 'reject')}
                      >
                        {/* {isActionLoading ? 'Rejecting...' : 'Reject'} */}
                        Reject
                      </button>
                    </div>
                  </ReviewTableRow>
                ))
              )}
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
                    <img src={selected?.avatar || selected?.avatarUrl} alt={selected?.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold">{selected?.name}</div>
                      <div className="text-xs text-gray-500">{selected?.email}</div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm mb-1">Company Name</div>
                  <div className="font-semibold mb-4">{selected?.companyName || selected?.businessName}</div>
                  <div className="text-gray-500 text-sm mb-1">Reason</div>
                  <div className="text-sm">{selected?.reason || 'N/A'}</div>
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