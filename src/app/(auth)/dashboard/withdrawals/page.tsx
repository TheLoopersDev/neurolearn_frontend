'use client'
import React, { useState, useEffect } from "react";
import { ReviewHeader, ReviewTable, ReviewTableRow, ReviewPagination } from "@/components/review-common";
import { Eye, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/common/Loading";

interface WithdrawData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  amount: number;
  status: string;
  requestedAt: string;
  reason?: string;
}

interface WithdrawResponse {
  success: boolean;
  withdraws: WithdrawData[];
}

const WithdrawalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<WithdrawData | null>(null);
  const [withdraws, setWithdraws] = useState<WithdrawData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const fetchWithdraws = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/withdraw`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch withdraws');
      }

      const data: WithdrawResponse = await response.json();

      if (data.success && Array.isArray(data.withdraws)) {
        setWithdraws(data.withdraws);
      } else {
        setWithdraws([]);
      }
    } catch (error) {
      console.error('Error fetching withdraws:', error);
      setWithdraws([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (withdraw: WithdrawData) => {
    setSelected(withdraw);
    setOpen(true);
  };

  const handleApproveOrReject = async (action: 'approve' | 'reject', adminNote?: string) => {
    if (!selected) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/withdraw/${selected._id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: action === 'approve' ? 'approved' : 'rejected',
          adminNote: adminNote || 'No note provided',
          reason: selected.reason || 'No reason provided',
          transactionId: `TXN_${Date.now()}` // Generate a simple transaction ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update withdraw status');
      }

      toast({
        title: "Success",
        description: `Withdrawal request ${action}d successfully`,
      });

      setOpen(false);
      setSelected(null);
      setCurrentPage(1);
      fetchWithdraws(); // Refresh data
    } catch (error) {
      console.error('Error updating withdraw status:', error);
      toast({
        title: "Error",
        description: "Failed to update withdrawal status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredWithdraws = withdraws.filter(withdraw => {
    const matchesSearch = withdraw.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdraw.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const headers = [
    { label: 'User', className: 'col-span-3' },
    { label: 'Request Date', className: 'col-span-2' },
    { label: 'Requested Amount', className: 'col-span-2' },
    { label: 'Status', className: 'col-span-2' },
    { label: 'Progress', className: 'col-span-2' },
    { label: '', className: 'col-span-1' },
  ];

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredWithdraws.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWithdraws = filteredWithdraws.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return <Loading message="Loading withdrawals..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <ReviewHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory=""
          setSelectedCategory={() => { }}
          categories={[]}
          activeTab="withdrawals"
          onTabChange={() => { }}
          tabOptions={[
            { value: 'withdrawals', label: 'Withdrawals' }
          ]}
        />

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse The User</h1>

        <ReviewTable headers={headers}>
          {currentWithdraws.length === 0 ? (
            <div className="text-center py-8 col-span-12 text-gray-500">No data</div>
          ) : (
              currentWithdraws.map((withdraw, index) => (
                <ReviewTableRow key={withdraw._id} index={index}>
                {/* User */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                    {withdraw.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{withdraw.user.name}</div>
                    <div className="text-sm text-gray-500">{withdraw.user.email}</div>
                  </div>
                </div>
                {/* Request Date */}
                <div className="col-span-2 flex items-center">
                  <span className="text-gray-700 font-medium">{formatDate(withdraw.requestedAt)}</span>
                </div>
                {/* Requested Amount */}
                <div className="col-span-2 flex items-center">
                  <span className="text-gray-700 font-medium">{formatAmount(withdraw.amount)}</span>
                </div>
                {/* Status */}
                <div className="col-span-2 flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(withdraw.status)}`}>
                    {withdraw.status}
                  </span>
                </div>
                {/* Progress (Eye Icon) */}
                <div className="col-span-2 flex items-center justify-center">
                  <button
                    onClick={() => handleView(withdraw)}
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
            ))
          )}
        </ReviewTable>

        <ReviewPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Custom Modal with blur background */}
        {open && (
          <div className="fixed inset-0 z-40 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8 backdrop-blur-sm bg-black/20">
              <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-6 relative">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                  onClick={() => {
                    setOpen(false);
                    setSelected(null);
                  }}
                  aria-label="Close"
                >
                  ×
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Withdrawal Request Details</h2>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: User info */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                        {selected?.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{selected?.user.name}</div>
                        <div className="text-xs text-gray-500">{selected?.user.email}</div>
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm mb-1">Requested Amount</div>
                    <div className="text-blue-600 text-2xl font-bold mb-4">{selected ? formatAmount(selected.amount) : ''}</div>
                    <div className="text-gray-500 text-sm mb-1">Reason</div>
                    <div className="text-sm">{selected?.reason || 'No reason provided'}</div>
                  </div>
                  {/* Right: Bank info */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-6">
                    <div className="text-gray-500 text-sm mb-1">Bank</div>
                    <div className="font-semibold mb-4">{selected?.bankName}</div>
                    <div className="text-gray-500 text-sm mb-1">Account Name</div>
                    <div className="font-semibold mb-4">{selected?.bankAccountName}</div>
                    <div className="text-gray-500 text-sm mb-1">Account Number</div>
                    <div className="flex items-center gap-2 font-semibold text-lg">
                      {selected?.bankAccountNumber}
                      <button
                        className="ml-2 px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs hover:bg-gray-200"
                        onClick={() => navigator.clipboard.writeText(selected?.bankAccountNumber || '')}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                {/* Admin Note Input */}
                <div className="mt-6">
                  <div className="text-gray-500 text-sm mb-2">Admin Note (Optional)</div>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add a note for this action..."
                    id="adminNote"
                  />
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 bg-gray-100 hover:bg-gray-200"
                    onClick={() => {
                      const adminNote = (document.getElementById('adminNote') as HTMLTextAreaElement)?.value || '';
                      handleApproveOrReject('reject', adminNote);
                    }}
                  >
                    Reject
                  </button>
                  <button
                    className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    onClick={() => {
                      const adminNote = (document.getElementById('adminNote') as HTMLTextAreaElement)?.value || '';
                      handleApproveOrReject('approve', adminNote);
                    }}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalsPage; 