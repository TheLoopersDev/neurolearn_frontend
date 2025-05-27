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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Categories */}
      <CategoriesSection />

      {/* Popular Courses */}
      <CourseGrid title="Popular Courses" type="top" />
      
      {/* Why Study Section */}
      <WhyStudySection />
      
      {/* Learners are viewing */}
      <CourseGrid title="Learners are viewing" type="all" />
      
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
