'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import FilterDropdown from './FilterDropdown';
import SearchBarInline from './SearchBarInline';
import { useGetCategoriesQuery } from '@/lib/redux/features/course/category/categoryApi';

const FilterSection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data } = useGetCategoriesQuery();

    const [searching, setSearching] = useState(false);
    const [category, setCategory] = useState('All Courses');
    const [price, setPrice] = useState('All Prices');
    const [level, setLevel] = useState('All Levels');
    const [rating, setRating] = useState('All Ratings');

    // Đồng bộ khi load page
    useEffect(() => {
        setCategory(searchParams.get('category') || 'All Courses');
        setPrice(searchParams.get('price') || 'All Prices');
        setLevel(searchParams.get('level') || 'All Levels');
        setRating(searchParams.get('rating') || 'All Ratings');
    }, [searchParams]);

    // Cập nhật URL mỗi khi filter thay đổi
    const updateURL = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (
            value === 'All Courses' ||
            value === 'All Prices' ||
            value === 'All Levels' ||
            value === 'All Ratings'
        ) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        params.set('page', '1'); // reset về trang 1
        router.push(`/courses?${params.toString()}`);
    };

    const categoryOptions = ['All Courses', ...(data?.categories?.map(c => c.title) || [])];


    return (
        <div className="w-full px-4 md:px-0">
            <div className="-mt-[64px] max-sm:-mt-6 max-w-[1144px] mx-auto z-[80] relative">
                <div className="bg-white h-40 max-sm:h-auto rounded-[20px] max-sm:rounded-[16px] shadow px-6 py-[31px] max-sm:px-4 max-sm:py-4 w-full overflow-visible">
                    <div className="flex flex-wrap md:flex-nowrap justify-between gap-[32px] max-sm:gap-4">
                        <div className="relative w-full min-h-[90px] md:min-h-[120px] max-sm:min-h-[120px] flex-1">
                            <AnimatePresence mode="wait">
                                {searching ? (
                                    <motion.div
                                        key="search-bar"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 items-center flex justify-center"
                                    >
                                        <Suspense fallback={<div>Loading filters...</div>}>
                                            <SearchBarInline onClose={() => setSearching(false)} />
                                        </Suspense>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="filters"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                            className="md:absolute md:inset-0 flex gap-[32px] flex-wrap md:flex-nowrap max-sm:flex-col max-sm:gap-4"
                                    >
                                        {/* Category */}
                                            <div className="flex flex-col gap-2 min-w-[200px] max-sm:min-w-0 flex-1">
                                            <label className="text-base font-medium text-black">Type of Category</label>
                                            <FilterDropdown
                                                options={categoryOptions}
                                                value={category}
                                                onSelect={(val) => {
                                                    setCategory(val);
                                                    updateURL('category', val);
                                                }}
                                            />
                                        </div>

                                        {/* Price */}
                                            <div className="flex flex-col gap-2 min-w-[160px] max-sm:min-w-0 flex-1">
                                            <label className="text-base font-medium text-black">Price</label>
                                            <FilterDropdown
                                                options={['All Prices', 'Free', 'Paid']}
                                                value={price}
                                                onSelect={(val) => {
                                                    setPrice(val);
                                                    updateURL('price', val);
                                                }}
                                            />
                                        </div>

                                        {/* Level */}
                                            <div className="flex flex-col gap-2 min-w-[160px] max-sm:min-w-0 flex-1">
                                            <label className="text-base font-medium text-black">Level</label>
                                            <FilterDropdown
                                                options={['All Levels', 'Beginner', 'Intermediate', 'Advanced']}
                                                value={level}
                                                onSelect={(val) => {
                                                    setLevel(val);
                                                    updateURL('level', val);
                                                }}
                                            />
                                        </div>

                                        {/* Rating */}
                                            <div className="flex flex-col gap-2 min-w-[160px] max-sm:min-w-0 flex-1">
                                            <label className="text-base font-medium text-black">Rating</label>
                                            <FilterDropdown
                                                options={['All Ratings', '4★ & up', '3★ & up', '2★ & up']}
                                                value={rating}
                                                onSelect={(val) => {
                                                    setRating(val);
                                                    updateURL('rating', val);
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center">
                            <button
                                onClick={() => setSearching(!searching)}
                                className={`w-[56px] h-[56px] max-sm:w-11 max-sm:h-11 rounded-full flex items-center justify-center transition ${searching ? 'bg-gray-200' : 'bg-[#F7F8FA] hover:bg-gray-200'
                                    }`}
                            >
                                <FaSearch className="text-black w-5 h-5 max-sm:w-4 max-sm:h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;
