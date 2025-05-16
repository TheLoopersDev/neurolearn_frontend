"use client";

import React from 'react';
import Image from 'next/image';

const VideoSection: React.FC = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">
          Top Trends For
        </h2>
        <h3 className="text-3xl font-bold text-blue-600 mb-6">
          The Future Of Work
        </h3>
        <div className="bg-gray-900 rounded-xl overflow-hidden relative aspect-video">
          <div className="absolute inset-0">
            <Image 
              src="/assets/home/TopTrend.png" 
              alt="Video thumbnail" 
              fill 
              className="object-cover mix-blend-overlay opacity-70"
            />
          </div>
          
          <div className="absolute right-4 bottom-4 text-white text-xs bg-black/50 px-2 py-1 rounded">
            7:32
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-white rounded-full p-4 hover:bg-gray-100 transition-colors shadow-lg">
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
            </button>
          </div>
        </div>
        
        <div className="py-4 text-sm text-gray-600">
          Our latest course learning trends have made trainers more efficient with data-driven insights and personalized content.
        </div>
      </div>
    </section>
  );
};

export default VideoSection;