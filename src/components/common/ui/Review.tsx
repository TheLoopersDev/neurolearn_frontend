'use client';

import Image from 'next/image';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const reviews = Array(4).fill({
  name: 'Dao Tuan Kiet',
  date: '2 weeks ago',
  content:
    "An extensive and thorough course on ChatGPT, AI and many other API's. I will use the course as a reference in the future as there is a ton of great information. An impressive work.",
  rating: 4.5,
});

export default function Review() {
  return (
    <div className="max-w-full mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-black">Review and rating</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="w-[311px] h-[249px] bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/images/avatar.png"
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-black">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-400 leading-none pr-1">”</div>
            </div>
            {/* Content */}
            <p className="text-sm text-gray-700 leading-relaxed mt-2 mb-3 flex-1">
              {review.content}
            </p>
            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>{review.rating}</span>
                <Star size={14} fill="#3858F8" color="#3858F8" />
              </div>
              <div className="flex items-center gap-3">
                <ThumbsUp size={16} />
                <ThumbsDown size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
