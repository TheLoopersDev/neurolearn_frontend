'use client';

import Header from '@/components/layout/Header';
import HeroSection from '@/components/home/HeroSection';
import CourseGrid from '@/components/home/CourseGrid';
import WhyStudySection from '@/components/home/WhyStudySection';
import LearningFocusSection from '@/components/home/LearningFocusSection';
import ExpertsSection from '@/components/home/ExpertsSection';
import FutureOfWorkSection from '@/components/home/FutureOfWorkSection';
import PersonalityTestSection from '@/components/home/PersonalityTestSection';
import VideoSection from '@/components/home/VideoSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import Footer from '@/components/layout/Footer';


export default function Home() {

  return (
    <div className="relative bg-gray-50 min-h-screen overflow-hidden z-10">
      {/* Background Ellipse */}
      <div
        className="absolute inset-x-0 top-0 h-[480px] md:h-[520px] lg:h-[560px] -z-10 rounded-b-[100%]"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 0%, rgba(91, 120, 255, 0.4) 0%, #f7f8fa 100%)',
        }}
      ></div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Categories */}
      <CategoriesSection />

      {/* Popular Courses */}
      <CourseGrid title="Popular Courses" />

      {/* Why Study Section */}
      <WhyStudySection />

      {/* Learners are viewing */}
      <CourseGrid title="Learners are viewing" />

      {/* Learning Focused */}
      <LearningFocusSection />

      {/* Our Experts */}
      <ExpertsSection />

      {/* Future of Work Section */}
      <FutureOfWorkSection />

      {/* Personality Test Section */}
      <PersonalityTestSection />

      {/* Video Section */}
      <VideoSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
