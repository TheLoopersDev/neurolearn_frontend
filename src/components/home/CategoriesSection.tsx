'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeIn, staggerContainer } from '@/utils/animations';

const CategoriesSection = () => {
  const categories = [
    'Data Science',
    'IT Certifications',
    'Leadership',
    'Web Development',
    'Communication',
    'Business Analytics & Intelligence'
  ];

  const [activeCategory, setActiveCategory] = useState('Data Science');

  return (
    <AnimatedSection
      variants={fadeIn}
      className="w-80% py-4 bg-[#ECECEC] rounded-full overflow-hidden isolate"
    >
      <div className="mx-auto px-2">
        <motion.div
          className="flex flex-row gap-1 overflow-x-auto items-center px-2"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => {
            const isActive = activeCategory === category;

            return (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center justify-center h-11 px-4 md:px-6 text-[20px] font-medium rounded-full transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-[#3858F8] text-white'
                    : 'bg-transparent text-[#6B6B6B] hover:bg-[#D9D9D9]'
                  }`}
                variants={fadeIn}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default CategoriesSection;
