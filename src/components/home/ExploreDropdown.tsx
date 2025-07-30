'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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

    // Define the animation variants with proper typing
    const dropdownVariants: Variants = {
        hidden: { opacity: 0, y: -20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const, // Mark as const to ensure type safety
                damping: 20,
                stiffness: 300,
                mass: 0.5
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2
            }
        }
    };

    const categoryItemVariants: Variants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                type: "spring" as const,
                stiffness: 300
            }
        })
    };

    const subcategoryItemVariants: Variants = {
        hidden: { opacity: 0, y: 5 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2 + i * 0.03,
                type: "spring" as const,
                stiffness: 300
            }
        })
    };

    return (
        <div className="relative z-80">
            <motion.button
                onClick={() => setIsExploreOpen(prev => !prev)}
                className="px-4 py-2 bg-white rounded-3xl flex items-center justify-center gap-3 text-[16px] font-medium text-[#0D0D0D] hover:bg-blue-50 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span>Explore</span>
                <motion.div
                    animate={{ rotate: isExploreOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                    <Image src={ArrowDownIcon} alt="" width={20} height={20} />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isExploreOpen && (
                    <motion.div
                        className="absolute left-0 mt-3 w-[816px] h-[450px] bg-white rounded-[20px] shadow-lg flex flex-col p-6 gap-2 z-80"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex gap-[24px]">
                            {/* Left Column: Category */}
                            <motion.div
                                className="flex flex-col gap-3 w-[208px]"
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div
                                    className="text-[12px] font-medium text-[#6B6B6B]"
                                    variants={categoryItemVariants}
                                    custom={0}
                                >
                                    CATEGORY
                                </motion.div>
                                {categories.map((cat, index) => (
                                    <motion.button
                                        key={cat.name}
                                        className={`text-left flex items-center gap-3 px-3 py-4 rounded-[8px] w-full ${selectedCategory.name === cat.name ? 'bg-[#F7F8FA]' : ''
                                            }`}
                                        onClick={() => setSelectedCategory(cat)}
                                        variants={categoryItemVariants}
                                        custom={index + 1}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className={`text-[16px] font-medium ${selectedCategory.name === cat.name ? 'text-[#3858F8]' : 'text-[#000000]'
                                            }`}>
                                            {cat.name}
                                        </span>
                                    </motion.button>
                                ))}
                            </motion.div>

                            {/* Right Column: Subcategory */}
                            <motion.div
                                className="flex flex-col gap-3 w-full bg-[#F7F8FA] rounded-[20px] px-6 py-4"
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div
                                    className="text-[12px] font-medium text-[#6B6B6B]"
                                    variants={subcategoryItemVariants}
                                    custom={0}
                                >
                                    SUB CATEGORY
                                </motion.div>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-10">
                                    {selectedCategory.subcategories.map((sub, index) => (
                                        <motion.div
                                            key={sub}
                                            className="text-[16px] text-[#000] font-medium hover:text-[#3858F8] cursor-pointer"
                                            variants={subcategoryItemVariants}
                                            custom={index + 1}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {sub}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}