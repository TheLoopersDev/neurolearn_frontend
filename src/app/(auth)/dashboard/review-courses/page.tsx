'use client'
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CommonPagination } from '@/components/common/ui';
import Image from 'next/image';
import { useHandleRequestMutation } from '@/lib/redux/features/api/apiSlice';
import { useGetPendingCourseRequestsQuery } from '@/lib/redux/features/request/requestApi';
import CourseDetail from '@/components/course-detail/CourseDetail';
import CourseContent from '@/components/course-detail/CourseContent';
import PublisherCard from '@/components/course-detail/PublisherCard';
import OverView from '@/components/course-detail/OverView';
import InstructorInfo from '@/components/common/ui/InstuctorInfo';
import { useToast } from '@/hooks/use-toast';
import SearchCourseRequest from './_components/SearchCourseRequest';
import CourseRequestCard from './_components/CourseRequestCard';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

// Modal Component using createPortal
const CoursePreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedRequest: any;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}> = ({ isOpen, onClose, selectedRequest, onApprove, onReject }) => {
  if (!isOpen || !selectedRequest) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-[9999] p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-900">Course Preview: {selectedRequest.data?.course?.name || selectedRequest.courseId?.name || 'N/A'}</h3>
        </div>
        {/* Course Preview Content using course-detail components */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-[70%] space-y-10">
              {/* Course Thumbnail */}
              <div className="w-full">
                <Image
                  src={selectedRequest.data?.course?.thumbnail?.url || selectedRequest.courseId?.thumbnail?.url || '/assets/business/book.svg'}
                  alt={selectedRequest.data?.course?.name || selectedRequest.courseId?.name || 'Course thumbnail'}
                  width={1200}
                  height={480}
                  className="w-full h-64 object-cover rounded-4xl"
                />
              </div>
              {/* Instructor Info */}
              <InstructorInfo
                courseName={selectedRequest.data?.course?.name || selectedRequest.courseId?.name || 'N/A'}
                instructor={selectedRequest.userId}
              />
              {/* Description Section */}
              <div>
                <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
                <div className="text-gray-700 text-base leading-relaxed space-y-4 mb-6">
                  <p>{selectedRequest.data?.course?.description || selectedRequest.courseId?.description || 'No description provided by instructor.'}</p>
                  <a href="#" className="inline-block text-blue-600 font-medium hover:underline">
                    View all &gt;
                  </a>
                </div>
              </div>
              {/* Course Detail */}
              <CourseDetail
                course={{
                  ...(selectedRequest.data?.course || selectedRequest.courseId || {}),
                  sections: selectedRequest.data?.sections || selectedRequest.courseId?.sections || []
                }}
              />
              {/* Course Content */}
              <CourseContent
                sections={(selectedRequest.data?.sections || selectedRequest.courseId?.sections || []).map((section: any) => ({
                  ...section,
                  lessons: (section.lessons || []).map((lesson: any) => ({
                    ...lesson,
                    videoUrl: lesson.videoUrl || null,
                    videoLength: lesson.videoLength || null,
                    isFree: lesson.isFree || false
                  }))
                }))}
              />
            </div>
            {/* RIGHT SIDEBAR */}
            <div className="w-full lg:w-[30%] space-y-15">
              <PublisherCard
                author={selectedRequest.userId}
                updatedAt={selectedRequest.data?.course?.updatedAt ? new Date(selectedRequest.data.course.updatedAt) : (selectedRequest.courseId?.updatedAt ? new Date(selectedRequest.courseId.updatedAt) : undefined)}
              />
              <OverView
                title={selectedRequest.data?.course?.name || selectedRequest.courseId?.name || 'N/A'}
                overview={selectedRequest.data?.course?.overview || selectedRequest.data?.course?.description || selectedRequest.courseId?.description || 'N/A'}
              />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t mt-10">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await onReject(selectedRequest._id || selectedRequest.id);
                } catch (err: any) {
                  // Error handling will be done in parent component
                }
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={async () => {
                try {
                  await onApprove(selectedRequest._id || selectedRequest.id);
                } catch (err: any) {
                  // Error handling will be done in parent component
                }
              }}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal outside the parent layout
  return createPortal(modalContent, document.body);
};

const CourseManagementSystem: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.role;
  const [ready, setReady] = useState(false);

  // Mark as client-ready to avoid hydration flicker
  useEffect(() => setReady(true), []);

  // Redirect when not admin
  useEffect(() => {
    if (!ready) return;
    if (role === undefined) return;
    if (role !== 'admin') {
      router.replace('/'); // send non-admin to home
    }
  }, [ready, role, router]);

  // API call for course approval requests - using the new detailed endpoint
  const { data: requestData, isLoading: isRequestLoading, refetch } = useGetPendingCourseRequestsQuery({
    type: 'course_approval',
  });
  const [handleRequest] = useHandleRequestMutation();

  // Refetch when status changes
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Ensure requestData is always an array
  const requestArray = Array.isArray(requestData) ? requestData : ((requestData as any)?.data || []);

  // Filter requests by search term
  const filteredRequests = requestArray.filter((req: any) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return true; // Show all requests when no search term
    }

    // Use the new data structure with fallbacks to old structure
    const courseName = req.data?.course?.name || req.courseId?.name || '';
    const instructorName = req.userId?.name || '';
    const instructorEmail = req.userId?.email || '';
    const courseDescription = req.data?.course?.description || req.courseId?.description || '';
    const courseSubTitle = req.data?.course?.subTitle || req.courseId?.subTitle || '';

    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = courseName.toLowerCase().includes(searchLower) ||
      instructorName.toLowerCase().includes(searchLower) ||
      instructorEmail.toLowerCase().includes(searchLower) ||
      courseDescription.toLowerCase().includes(searchLower) ||
      courseSubTitle.toLowerCase().includes(searchLower);

    return matchesSearch;
  });

  const requestItemsPerPage = 6;
  const itemsPerPage = requestItemsPerPage;

  // Calculate pagination based on active tab
  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Get current items based on active tab
  const currentRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleApproveOrReject = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await handleRequest({ type: 'course_approval', requestId, action }).unwrap();
      setCurrentPage(1);
      await refetch();
      toast({
        title: action === 'approve' ? 'Course Approved' : 'Request Rejected',
        description: `${action === 'approve' ? 'The course request has been approved.' : 'The course request has been rejected successfully.'}`,
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        title: action === 'approve' ? 'Approval Failed' : 'Rejection Failed',
        description: err?.data?.message || err?.error || 'An error occurred while approving/rejecting the request.',
        variant: 'destructive',
      });
    }
  };

  // Pagination component
  const PaginationComponent = () => {
    return (
      <CommonPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    );
  };

  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'admin') return <Loading message="Redirecting..." className="min-h-screen" />;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search and Filters */}
        <div className="flex items-center justify-between mb-8">
          <SearchCourseRequest
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeTab="request"
          />
        </div>
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-10">Course Approval Requests</h1>

        {/* Request Cards Container */}
        <div className="space-y-6">
          {isRequestLoading ? (
            <Loading message="Loading requests..." size="sm" className="py-12" />
          ) : !requestData?.success || !currentRequests || currentRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
              {searchTerm ? `No requests found matching "${searchTerm}"` : 'No requests found'}
            </div>
          ) : (
            currentRequests.map((req: any, index: number) => (
              <CourseRequestCard
                key={req._id || req.id}
                request={req}
                index={index}
                onPreview={(request) => {
                  setSelectedRequest(request);
                  setIsModalOpen(true);
                }}
                onReject={async (id) => {
                  try {
                    await handleApproveOrReject(id, 'reject');
                  } catch (err: any) {
                    toast({
                      title: 'Rejection Failed',
                      description: err?.data?.message || err?.error || 'An error occurred while rejecting the request.',
                      variant: 'destructive',
                    });
                  }
                }}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <PaginationComponent />
      </div>

      {/* Preview Modal using createPortal */}
      <CoursePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRequest={selectedRequest}
        onApprove={async (id: string) => {
          try {
            await handleApproveOrReject(id, 'approve');
          } catch (err: any) {
            toast({
              title: 'Approval Failed',
              description: err?.data?.message || err?.error || 'An error occurred while approving the course.',
              variant: 'destructive',
            });
          }
        }}
        onReject={async (id: string) => {
          try {
            await handleApproveOrReject(id, 'reject');
          } catch (err: any) {
            toast({
              title: 'Rejection Failed',
              description: err?.data?.message || err?.error || 'An error occurred while rejecting the request.',
              variant: 'destructive',
            });
          }
        }}
      />
    </div>
  );
};

export default CourseManagementSystem;