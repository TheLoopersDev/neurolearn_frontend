"use client";

import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeIn, staggerContainer } from '@/utils/animations';

const CategoriesSection = () => {
  const categories = [
    'Tất cả', 
    'IT Certifications', 
    'Leadership', 
    'Web Development', 
    'Communication', 
    'Business Analytics & Intelligence'
  ];

  return (
    <AnimatedSection variants={fadeIn} className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex overflow-x-auto pb-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: '#e5e7eb',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
              }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default CategoriesSection; 