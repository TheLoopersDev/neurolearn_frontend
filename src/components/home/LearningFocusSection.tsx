"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeIn, slideUp, staggerContainer } from '@/utils/animations';

interface FocusItem {
  title: string;
  description: string;
  icon: string;
}

const FocusCard = ({ title, description, icon }: FocusItem) => (
  <motion.div
    className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative h-full"
    variants={slideUp}
    whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
  >
    <div className="w-10 h-10">
      <Image src={icon} alt={title} width={40} height={40} className="object-contain" />
    </div>
    <h3 className="text-lg font-medium text-[#0D0D0D]">{title}</h3>
    <p className="text-sm text-[#6B6B6B] leading-5">{description}</p>
    <motion.div className="absolute top-2 right-2" whileHover={{ rotate: 45 }}>
      <Image src="/assets/home/Arrow.svg" alt="Arrow" width={24} height={24} />
    </motion.div>
  </motion.div>
);

const LearningFocusSection = () => {
  const focusList: FocusItem[] = [
    {
      title: 'Hands-on training',
      description:
        'Upskill effectively with AI-powered coding exercises, practice tests, and quizzes.',
      icon: '/assets/icons/heart.svg',
    },
    {
      title: 'Certification prep',
      description:
        'Prep for industry-recognized certifications by solving real-world challenges and earn badges along the way.',
      icon: '/assets/icons/heart.svg',
    },
    {
      title: 'Insights and analytics',
      description:
        'Fast-track goals with advanced insights plus a dedicated customer success team to help drive effective learning.',
      icon: '/assets/icons/heart.svg',
    },
  ];

  return (
    <section className="bg-gray-50 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection variants={fadeIn}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0D0D0D] mb-8 sm:mb-10 md:mb-12 text-center lg:text-left">
            Learning focused on your goals
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 sm:gap-8 md:gap-10 items-stretch">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {focusList.map((item) => (
              <FocusCard key={item.title} {...item} />
            ))}
          </motion.div>

          <motion.div
            className="rounded-[16px] sm:rounded-[18px] md:rounded-[20px] bg-white overflow-hidden shadow-sm border border-gray-100 relative flex flex-col justify-center p-4 sm:p-5 md:p-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[#F4F4FE] p-3 sm:p-4 rounded-t-lg sm:rounded-t-xl">
              <div className="text-base sm:text-lg font-medium text-[#0D0D0D] mb-1">Containerization</div>
              <div className="text-xs sm:text-sm text-[#6B6B6B]">30 questions</div>
            </div>
            <div className="p-4 sm:p-5 md:p-6 text-xs sm:text-sm">
              <p className="mb-3 sm:mb-4 text-[#0D0D0D] text-base sm:text-lg">Your score: <span className="text-[#3858F8]">159</span></p>
              <div className="overflow-x-auto">
                <Image
                  src="/assets/home/score-chart.png"
                  alt="score chart"
                  width={600}
                  height={200}
                  className="rounded w-full h-auto"
                />
              </div>
            </div>
            <motion.div className="absolute top-2 right-2" whileHover={{ rotate: 45 }}>
              <Image src="/assets/home/Arrow.svg" alt="Arrow" width={20} height={20} className="sm:w-6 sm:h-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LearningFocusSection;