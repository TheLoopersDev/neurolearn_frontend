'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterDropdownProps {
    options: string[];
    value: string;
    onSelect: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ options, value, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={rootRef} className="relative w-full max-w-[280px]">
            {/* Trigger */}
            <button
                type="button"
                className="relative z-10 bg-[#F7F8FA] rounded-full px-4 py-[15px] w-full flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen((s) => !s)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="text-sm text-[#6B6B6B] truncate">{value}</span>
                <FaChevronDown className={`text-[#292D32] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.16 }}
                        className="absolute left-0 right-0 top-full z-50 mt-2 bg-white rounded-2xl shadow-xl ring-1 ring-black/5
                       max-h-[384px] overflow-auto p-2 sm:p-3"
                        role="listbox"
                    >
                        {options.map((option, idx) => {
                            const selected = option === value;
                            return (
                                <div
                                    key={idx}
                                    role="option"
                                    aria-selected={selected}
                                    className={`px-3 py-2.5 sm:py-3 rounded-lg cursor-pointer text-sm font-medium
                              ${selected ? 'bg-gray-100 text-black' : 'text-black hover:bg-gray-100'}`}
                                    onClick={() => {
                                        onSelect(option);
                                        setIsOpen(false);
                                    }}
                                >
                                    {option}
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterDropdown;
