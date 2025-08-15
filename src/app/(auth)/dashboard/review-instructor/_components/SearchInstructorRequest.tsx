'use client';

import React from 'react';
import { Search, ChevronRight } from 'lucide-react';

interface SearchInstructorRequestProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    selectedCategory?: string;
    onCategoryChange?: (value: string) => void;
    categories?: string[];
    selectedStatus?: string;
    onStatusChange?: (value: string) => void;
    statusOptions?: string[];
    activeTab?: 'requests' | 'instructors';
    searchPlaceholder?: string;
}

export default function SearchInstructorRequest({
    searchTerm = "",
    onSearchChange,
    selectedCategory = "All categories",
    onCategoryChange,
    categories = ["All categories", "UI/UX", "Development", "Data Science", "Marketing", "Creative"],
    selectedStatus = "all",
    onStatusChange,
    statusOptions = ["all", "pending", "approved", "rejected"],
    activeTab = "requests",
    searchPlaceholder = "Search instructors requests"
}: SearchInstructorRequestProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onSearchChange?.(value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onCategoryChange?.(value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onStatusChange?.(value);
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="pl-12 pr-4 py-3 bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-80 text-black"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="relative">
                <select
                    className="appearance-none bg-gray-50 rounded-full px-6 py-3 pr-10 border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer text-black"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
            {activeTab === 'requests' && (
                <div className="relative">
                    <select
                        className="appearance-none bg-gray-50 rounded-full px-6 py-3 pr-10 border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer text-black"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                    <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>
            )}
        </div>
    );
}
