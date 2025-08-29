'use client';

import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { slideUp } from '@/utils/animations';

const VideoSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto flex flex-col gap-9">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          {/* Left title */}
          <AnimatedSection variants={slideUp}>
            <motion.h2
              className="text-4xl mb-2 text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Top Trends For
            </motion.h2>
            <motion.h3
              className="text-4xl text-blue-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              The Future Of Work
            </motion.h3>
          </AnimatedSection>

          {/* Right description */}
          <p className="text-[16px] leading-[19px] text-[#0D0D0D] max-w-[453px]">
            Our 2025 Global Learning & Skills Trends Report is out now!<br />
            Find out how to build the skills to keep pace with change.
          </p>
        </div>

        {/* Video */}
        <motion.div
          className="w-full h-[610px] rounded-[16px] relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <video
            src="/demo.mp4"
            controls
            muted
            className="w-full h-full object-cover rounded-[16px]"
            poster="/assets/home/TopTrend.png"
            onEnded={(e) => {
              // Show replay button when video ends
              const replayBtn = e.currentTarget.parentElement?.querySelector('.replay-btn');
              if (replayBtn) {
                replayBtn.classList.remove('hidden');
              }
            }}
          >
            Your browser does not support the video tag.
          </video>

          {/* Replay Button Overlay */}
          <button
            className="replay-btn hidden absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition-all duration-300"
            onClick={(e) => {
              const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
              if (video) {
                video.currentTime = 0;
                video.play();
                e.currentTarget.classList.add('hidden');
              }
            }}
          >
            <div className="bg-white rounded-full p-5 shadow-xl hover:scale-110 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
