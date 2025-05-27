'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, StarHalf, Star as StarFilled, ChevronDown } from 'lucide-react';

const feedbacks = [
  {
    user: 'Dao Tuan Kiet',
    date: 'May 5, 2025',
    comment:
      'The 3D course is clear with plenty of practice. The instructor is supportive, helping students gain confidence in creating 3D models.',
    rating: 4,
  },
  {
    user: 'Dao Tuan Kiet',
    date: 'May 5, 2025',
    comment:
      'The 3D course is clear with plenty of practice. The instructor is supportive, helping students gain confidence in creating 3D models.',
    rating: 4,
  },
];

export default function EvaluatePanel() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  return (
    <div className="p-6 bg-white rounded-2xl shadow space-y-6">
      {/* Rating Input */}
      <div className="flex items-start gap-4">
        <Image
          src="/assets/images/avatar.png"
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-black text-sm font-medium">
            <span>Rate course:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={`cursor-pointer ${
                  selectedRating && selectedRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-black'
                }`}
                onClick={() => setSelectedRating(star)}
              />
            ))}
          </div>

          <textarea
            rows={3}
            maxLength={150}
            placeholder="Write a comment..."
            className="w-full bg-[#F7F8FA] rounded-2xl px-4 py-3 text-sm text-black outline-none placeholder-[#D9D9D9]"
          />
          <div className="text-right text-xs text-gray-400">0/150 words</div>
        </div>
      </div>

      {/* Feedback header */}
      <div className="flex items-center justify-start gap-4">
        <h3 className="text-base text-black font-semibold">Customer Feedback</h3>
        <button className="flex items-center gap-2 bg-[#F7F8FA] text-base text-black px-3 py-1 rounded-full">
          Rating
          <ChevronDown size={20} className="text-[#0D0D0D]" />
        </button>
      </div>

      {/* Feedback list */}
      {feedbacks.map((fb, i) => (
        <div key={i} className="flex items-start gap-3 p-4 bg-[#F9FAFB] rounded-xl">
          <Image
            src="/assets/images/avatar.png"
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="text-sm text-black font-semibold">{fb.user}</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarFilled
                    key={star}
                    size={16}
                    className={star <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-500">{fb.date}</div>
            <p className="text-sm mt-1 text-black">{fb.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
