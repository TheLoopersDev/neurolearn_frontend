'use client';

import { useState } from 'react';
import Image from 'next/image';
import ArrowDownIcon from '@/public/assets/home/arrow-top-down.svg';

interface Category {
    name: string;
    href: string;
    subcategories: string[];
}

const categories: Category[] = [
    {
        name: 'Programming - IT',
        href: '/categories/programming',
        subcategories: ['Front-end', 'Back-end', 'Mobile App', 'Database', 'Computer Network', 'Program Language'],
    },
    {
        name: 'Business - Start-Up',
        href: '/categories/business',
        subcategories: ['Marketing', 'Sales', 'Startup Strategy'],
    },
    {
        name: 'Photography - Film',
        href: '/categories/photography',
        subcategories: ['Cinematography', 'Editing', 'Lighting'],
    },
    {
        name: 'Languages',
        href: '/categories/languages',
        subcategories: ['English', 'Japanese', 'Korean'],
    },
    {
        name: 'Design',
        href: '/categories/design',
        subcategories: ['UI/UX', 'Graphic Design', 'Branding'],
    },
];

export default function ExploreDropdown() {
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsExploreOpen(prev => !prev)}
                className="px-4 py-2 bg-white rounded-3xl flex items-center justify-center gap-3 text-[16px] font-medium text-[#0D0D0D] hover:bg-blue-50 transition"
            >
                <span>Explore</span>
                <Image src={ArrowDownIcon} alt="" width={20} height={20} />
            </button>

            {isExploreOpen && (
                <div className="absolute left-0 mt-3 w-[816px] h-[450px] bg-white rounded-[20px] shadow-lg flex flex-col p-6 gap-2 z-50">
                    <div className="flex gap-[24px]">
                        {/* Left Column: Category */}
                        <div className="flex flex-col gap-3 w-[208px]">
                            <div className="text-[12px] font-medium text-[#6B6B6B]">CATEGORY</div>
                            {categories.map(cat => (
                                <button
                                    key={cat.name}
                                    className={`text-left flex items-center gap-3 px-3 py-4 rounded-[8px] w-full ${selectedCategory.name === cat.name ? 'bg-[#F7F8FA]' : ''
                                        }`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    <span className={`text-[16px] font-medium ${selectedCategory.name === cat.name ? 'text-[#3858F8]' : 'text-[#000000]'
                                        }`}>
                                        {cat.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Right Column: Subcategory */}
                        <div className="flex flex-col gap-3 w-full bg-[#F7F8FA] rounded-[20px] px-6 py-4">
                            <div className="text-[12px] font-medium text-[#6B6B6B]">SUB CATEGORY</div>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-10">
                                {selectedCategory.subcategories.map((sub, idx) => (
                                    <div key={idx} className="text-[16px] text-[#000] font-medium hover:text-[#3858F8] cursor-pointer">
                                        {sub}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
