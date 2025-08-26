'use client';

import Image from 'next/image';
import Button from '@/components/common/ui/Button';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { slideFromLeft, slideFromRight } from '@/utils/animations';

const HeroSection = () => {
  return (
    <section className="pt-12 px-4 sm:px-6 md:px-0">
      <div className="mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <AnimatedSection variants={slideFromLeft} className="w-full md:w-1/2 text-center md:text-left order-2 md:order-1">
          <div className='inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-12 sm:mb-16 md:mb-20 shadow-lg hover:shadow-xl transition-shadow duration-300'>
            #1 Online Courses 2025
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6 sm:mb-8 md:mb-10">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 block mb-3 sm:mb-4 md:mb-5">All The Skills You</span>
            <span className='text-gray-900 block'>Need In One Place</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
            From coding skills to business topics. Udemy helps
            <br className="hidden sm:block" />
            expand your professional development.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button href="/courses" variant="primary" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started
            </Button>
          </motion.div>
        </AnimatedSection>
        <AnimatedSection
          variants={slideFromRight}
          className="w-full md:w-1/2 relative order-1 md:order-2 md:pl-8"
          delay={0.2}
        >
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 w-full max-w-md mx-auto md:mx-0">
            <Image
              src="/assets/home/HeroSection.png"
              alt="Students learning"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
            <motion.div
              className="
              absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4
              w-24 h-16 sm:w-28 sm:h-20 md:w-32 md:h-24 lg:w-[158px] lg:h-[112px]
              bg-white/95 backdrop-blur-sm shadow-xl rounded-xl sm:rounded-2xl md:rounded-[12px]
              flex flex-col items-center justify-center
              p-2 sm:p-3 md:p-4 border border-gray-100
              hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="text-lg sm:text-xl md:text-2xl lg:text-[40px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">800</span>
              <span className="text-base sm:text-lg md:text-xl lg:text-[32px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">+</span>
              <span className="absolute mt-1 sm:mt-2 text-xs sm:text-sm lg:text-[14px] text-gray-600 font-medium">Participants</span>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;
