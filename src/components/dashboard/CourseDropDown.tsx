'use client';

import { ChevronDown, SlidersHorizontal } from 'lucide-react';

export default function CourseDropdown() {
  return (
    <div className="flex items-center h-15 gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm max-w-fit cursor-pointer">
      <SlidersHorizontal className="w-8 h-8 text-gray-500" />
      <span className="text-sm text-gray-700">All courses</span>
      <ChevronDown className="w-8 h-8 text-gray-500" />
    </div>
  );
}
