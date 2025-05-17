"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeIn, slideUp, staggerContainer } from '@/utils/animations';

interface FocusCardProps {
  title: string;
  index: number;
}

const FocusCard = ({ title, index }: FocusCardProps) => (
  <motion.div 
    className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center"
    variants={slideUp}
    transition={{ delay: index * 0.2 }}
    whileHover={{ 
      y: -5, 
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      backgroundColor: '#f9fafb' 
    }}
  >
    <motion.div 
      className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mr-4"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <Image src="/assets/home/Alarm.svg" alt={title} width={24} height={24} className="opacity-60" />
    </motion.div>
    <div>
      <h3 className="font-medium text-sm">{title}</h3>
    </div>
    <motion.div 
      className="ml-auto"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Image src="/assets/home/Arrow.svg" alt="Arrow" width={18} height={18} />
    </motion.div>
  </motion.div>
);

const LearningFocusSection = () => {
  const focusAreas = [
    'Hands-on training',
    'Certification prep',
    'Containerization'
  ];

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <AnimatedSection variants={fadeIn}>
          <h2 className="text-xl font-medium mb-6">Learning focused on your goals</h2>
        </AnimatedSection>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {focusAreas.map((area, index) => (
            <FocusCard key={area} title={area} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LearningFocusSection;