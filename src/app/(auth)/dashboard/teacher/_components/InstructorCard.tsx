// src/app/(auth)/dashboard/instructors/_components/InstructorCard.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@/types/user'; // Đảm bảo đường dẫn đúng
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getOrCreateChatRoom } from '@/lib/firestore/chat';

interface InstructorCardProps {
  instructor: User;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();

  const handleSendMessage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentUserId = user?._id;
    const currentUserName = user?.name || '';
    if (!currentUserId) {
      router.push('/');
      return;
    }

    try {
      const roomId = await getOrCreateChatRoom(String(currentUserId), String(instructor._id), currentUserName, instructor.name || `User ${String(instructor._id).slice(-4)}`);
      // Điều hướng tới trang message và chọn phòng vừa tạo
      router.push(`/dashboard/message?room=${encodeURIComponent(roomId)}`);
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100">
      {/* Avatar */}
      <div className="relative w-24 h-24 mb-4">
        <Image
          src={instructor.avatar?.url || '/assets/images/avatar.png'}
          alt={`Profile photo of ${instructor.name}`}
          fill
          sizes="96px"
          className="rounded-full object-cover"
        />
      </div>

      {/* Tên và Chuyên môn */}
      <h3 className="font-semibold text-lg text-gray-800">{instructor.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{instructor.profession || 'Instructor'}</p>

      {/* Đánh giá và số lượng học viên */}
      <div className="flex items-center gap-4 my-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-medium">{instructor.rating?.toFixed(1) || '4.5'}</span>
          <Image src={'/assets/icons/blue-star.svg'} alt="Star icon" width={16} height={16} />
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center">
          <span className="font-bold text-gray-800 mr-1.5">{instructor.student || 0}</span>
          <span>Students</span>
        </div>
      </div>

      {/* Các nút hành động */}
      <div className="w-full flex items-center gap-3 mt-2">
        <Link
          href={`/instructors/${instructor._id}`} // Ví dụ đường dẫn đến trang profile
          className="
            flex-1 w-full text-center px-4 py-2.5 rounded-3xl text-sm font-medium
            bg-gray-100 text-gray-700 hover:bg-gray-200
            transition-colors
          "
        >
          View profile
        </Link>
        <button
          onClick={handleSendMessage}
          className="
            flex-1 w-full text-center px-4 py-2.5 rounded-3xl text-sm font-medium
            bg-blue-500 text-white hover:bg-blue-600
            transition-colors
          "
        >
          Send message
        </button>
      </div>
    </div>
  );
};

export default InstructorCard;
