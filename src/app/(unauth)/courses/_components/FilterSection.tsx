'use client';

import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import FilterDropdown from './FilterDropdown';
import SearchBarInline from './SearchBarInline';

const FilterSection = () => {
    const [searching, setSearching] = useState(false);

    return (
        <div className="bg-white rounded-[20px] shadow px-6 py-[31px] w-full max-w-[1144px] mx-auto">
            <div className="flex flex-wrap md:flex-nowrap justify-between gap-[32px]">
                <div className="flex-1 flex items-center gap-[32px]">
                    <AnimatePresence mode="wait">
                        {searching ? (
                            <SearchBarInline onClose={() => setSearching(false)} />
                        ) : (
                            <>
                                <div className="flex flex-col gap-2 min-w-[200px] flex-1">
                                    <label className="text-base font-medium text-black">Type of Category</label>
                                    <FilterDropdown
                                        options={['All Courses', 'Design', 'Programming', 'Photography', 'Business']}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 min-w-[160px] flex-1">
                                    <label className="text-base font-medium text-black">Price</label>
                                    <FilterDropdown options={['All Prices', 'Free', 'Paid']} />
                                </div>

                                <div className="flex flex-col gap-2 min-w-[160px] flex-1">
                                    <label className="text-base font-medium text-black">Level</label>
                                    <FilterDropdown options={['All Levels', 'Beginner', 'Intermediate', 'Advanced']} />
                                </div>

                                <div className="flex flex-col gap-2 min-w-[160px] flex-1">
                                    <label className="text-base font-medium text-black">Rating</label>
                                    <FilterDropdown options={['All Ratings', '4★ & up', '3★ & up', '2★ & up']} />
                                </div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={() => setSearching(!searching)}
                        className={`w-[56px] h-[56px] rounded-full flex items-center justify-center transition ${searching ? 'bg-gray-200' : 'bg-[#F7F8FA] hover:bg-gray-200'
                            }`}
                    >
                        <FaSearch className="text-black w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;