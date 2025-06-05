'use client';

import Image from 'next/image';
import Button from '@/components/common/ui/Button';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { slideFromLeft, slideFromRight } from '@/utils/animations';

const HeroSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <AnimatedSection variants={slideFromLeft} className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-blue-600">All The Skills You</span>
            <br />
            Need In One Place
          </h1>
          <p className="text-gray-700 mb-6">
            From coding skills to business topics. Udemy helps
            <br />
            expand your professional development.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button href="/courses" variant="primary">
              Get Started
            </Button>
          </motion.div>
        </AnimatedSection>
        <AnimatedSection
          variants={slideFromRight}
          className="md:w-1/2 md:pl-8 relative"
          delay={0.2}
        >
          <div className="relative h-64 md:h-80">
            <Image
              src="/assets/home/HeroSection.png"
              alt="Students learning"
              fill
              className="object-contain"
              priority
            />
            <motion.div
              className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-lg font-semibold flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.1 }}
            >
              <span className="mr-1">800</span>
              <span className="text-sm">+</span>
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 bg-blue-50 p-3 rounded-lg shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <div className="ml-2 text-sm font-medium">50%</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Growth rate</div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;
