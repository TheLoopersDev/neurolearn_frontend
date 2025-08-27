'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchInstructorProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
}

export default function SearchInstructor({
    searchTerm = "",
    onSearchChange,
    searchPlaceholder = "Search instructors...",
}: SearchInstructorProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onSearchChange?.(value);
    };


    return (
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 sm:gap-4">
            <div className="relative w-full sm:w-auto lg:min-w-[300px] xl:min-w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="block text-black w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 h-[42px]"
                />
            </div>
        </div>
    );
}
