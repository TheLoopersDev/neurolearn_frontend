'use client';

import Image from 'next/image';

interface OverViewProps {
  title?: string
  overview?: string;
  topics?: string[];
}

export default function OverView({ title = '', overview = '', topics = [] }: OverViewProps) {
  return (
    <div className="max-w-full p-4 bg-white rounded-2xl shadow-md border border-gray-200 mx-auto w-[395px]">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold text-black">Overview</h2>
      </div>

      <h2 className="text-2xl font-bold text-black mb-4">
        {title || 'No course overview provided'}
      </h2> 

      <div className="flex flex-wrap gap-2 mb-4">
        {topics.length > 0 ? (
          topics.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#3858F8] text-white text-xs px-3 py-1 rounded-full whitespace-nowrap"
            >
              {tag}
            </span> 
          ))
        ) : (
          <span className="text-sm text-gray-500">No topics listed</span>
        )}
      </div>

      <p className="text-sm text-gray-700 mb-4">
        {overview ||
          'This course includes multiple in-depth sections covering various skills and tools in modern development or design.'}
      </p>

      <div className="text-black font-bold text-xl">The course will have stages:</div>
      <div className="space-y-4 mt-4 ">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center text-sm text-black gap-3"
          >
            <Image
              src={`/assets/icons/number-${index + 1}.svg`}
              alt={`Stage ${index + 1}`}
              width={20}
              height={20}
            />
            <span>Stage {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
