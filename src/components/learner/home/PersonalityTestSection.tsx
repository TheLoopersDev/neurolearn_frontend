"use client";

import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { slideUp } from '@/utils/animations';
import Link from 'next/link';

interface PersonalityTestSectionProps {
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
}

const PersonalityTestSection = ({
  title = 'Test your personality and interests',
  buttonText = 'Explore Now',
  buttonUrl = '/personality-test'
}: PersonalityTestSectionProps) => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <AnimatedSection variants={slideUp} className="bg-white rounded-xl p-8 w-full">
          {/* Header with title and button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <motion.h2 
              className="text-3xl font-bold mb-4 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href={buttonUrl} className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                  {buttonText} <span className="ml-2">→</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Main content */}
          <div className="flex flex-col md:flex-row">
            {/* Left side - Empty space */}
            <div className="md:w-1/2"></div>
            
            {/* Right side - Description */}
            <div className="md:w-1/2 mb-8">
              <motion.div 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p>Explore your <span className="text-blue-600">strengths, preferences</span>, and discover your <span className="text-blue-600">growth path</span> with this quick personality quiz.</p>
              </motion.div>
            </div>
          </div>
          
          {/* Progress indicator */}
          <motion.div 
            className="mb-6 relative mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <motion.span 
                  key={index}
                  className="w-3 h-3 bg-blue-600 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                />
              ))}
            </div>
            <motion.div 
              className="h-0.5 bg-blue-600 absolute top-1.5 left-0 right-0 -z-10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </motion.div>
          
          {/* Personality types */}
          <motion.div 
            className="grid grid-cols-6 gap-x-1 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex flex-col items-center">
              <span className="font-medium mb-1">REALISTIC</span>
              <span className="text-[10px] text-gray-400 text-center">Practical, hands-on, tangible work</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium mb-1">CONVENTIONAL</span>
              <span className="text-[10px] text-gray-400 text-center">Structured, organized, careful</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium mb-1">INVESTIGATIVE</span>
              <span className="text-[10px] text-gray-400 text-center">Practical, hands-on, tangible work</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium mb-1">ENTERPRISING</span>
              <span className="text-[10px] text-gray-400 text-center">Practical, hands-on, tangible work</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium mb-1">ARTISTIC</span>
              <span className="text-[10px] text-gray-400 text-center">Practical, hands-on, tangible work</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium mb-1">SOCIAL</span>
              <span className="text-[10px] text-gray-400 text-center">Practical, hands-on, tangible work</span>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PersonalityTestSection;