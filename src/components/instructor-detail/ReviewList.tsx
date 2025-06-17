// src/app/(auth)/dashboard/courses/instructors/[id]/_components/ReviewList.tsx
'use client';
import React from 'react';
import { IReview } from '@/types/course'; // Đảm bảo đường dẫn đúng
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: IReview[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
        <p>This instructor has no reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {reviews.map(review => (
        <ReviewCard key={review._id + review.createdAt} review={review} /> // Sử dụng key duy nhất
      ))}
    </div>
  );
};

export default ReviewList;
