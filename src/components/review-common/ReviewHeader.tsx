import React from 'react';
import { Search, ChevronRight } from 'lucide-react';

interface ReviewHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabOptions: { value: string; label: string }[];
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  activeTab,
  onTabChange,
  tabOptions,
}) => {
  return (
    <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="pl-12 pr-4 py-3 bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-80"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none bg-gray-50 rounded-full px-6 py-3 pr-10 border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
        </div>
      </div>
      <div className="flex gap-3">
        {tabOptions.map((tab) => (
          <button
            key={tab.value}
            className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${
              activeTab === tab.value 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewHeader; 