"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeIn, slideUp } from '@/utils/animations';

const VideoSection: React.FC = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <AnimatedSection variants={slideUp}>
          <motion.h2 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Top Trends For
          </motion.h2>
          <motion.h3 
            className="text-3xl font-bold text-blue-600 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            The Future Of Work
          </motion.h3>
        </AnimatedSection>
        
        <motion.div 
          className="bg-gray-900 rounded-xl overflow-hidden relative aspect-video"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute inset-0">
            <Image 
              src="/assets/home/TopTrend.png" 
              alt="Video thumbnail" 
              fill 
              className="object-cover mix-blend-overlay opacity-70"
            />
          </div>
          
          <motion.div 
            className="absolute right-4 bottom-4 text-white text-xs bg-black/50 px-2 py-1 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            7:32
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button 
              className="bg-white rounded-full p-4 hover:bg-gray-100 transition-colors shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: 0.3 
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 0 25px rgba(255,255,255,0.5)"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </div>
        </motion.div>
        
        <AnimatedSection variants={fadeIn} delay={0.4}>
          <div className="py-4 text-sm text-gray-600">
            Our latest course learning trends have made trainers more efficient with data-driven insights and personalized content.
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default VideoSection;