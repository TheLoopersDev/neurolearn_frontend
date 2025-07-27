'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterDropdownProps {
    label: string;
    options: string[];
    onSelect?: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(options[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (option: string) => {
        setSelected(option);
        onSelect?.(option);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full max-w-[280px]" ref={dropdownRef}>
            <div
                className="bg-[#F7F8FA] rounded-full px-4 py-[15px] flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm text-[#6B6B6B]">{selected}</span>
                <FaChevronDown className={`text-[#292D32] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-80 mt-2 bg-white rounded-2xl shadow-2xl w-full max-h-[384px] overflow-auto p-6 space-y-2"
                    >
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className="px-3 py-3 rounded-lg hover:bg-gray-100 cursor-pointer text-[#000] text-sm font-medium"
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterDropdown;