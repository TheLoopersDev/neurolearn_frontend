'use client';

import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="w-full flex items-center h-15 gap-2 bg-white px-4 py-2 rounded-full shadow-sm w-full max-w-xs border border-gray-200">
      <Search className="w-8 h-8 text-gray-500" />
      <input
        type="text"
        placeholder="Search"
        className="outline-none border-none text-sm text-gray-700 bg-transparent w-full placeholder:text-gray-400"
      />
    </div>
  );
}
