'use client';

import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const SearchBarInline = ({ onClose }: { onClose: () => void }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-[#F7F8FA] rounded-full px-6 py-[31px] h-[56px] flex items-center"
        >
            <label className=""></label>
            <input
                type="text"
                placeholder="Search for courses..."
                className="bg-transparent outline-none px-4 py-[15px] flex-1 text-base"
                autoFocus
            />
            <button
                onClick={onClose}
                className="ml-4 w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition"
            >
                <FaTimes className="text-black w-4 h-4" />
            </button>
        </motion.div>
    );
};

export default SearchBarInline;