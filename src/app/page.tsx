import { Course } from '@/types/course';
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
'use client';
import BubbleButton from '@/components/BubbleButton';
import Image from 'next/image';
import Link from 'next/link';

import { useModal } from '@/context/ModalContext';
import CtaButton from '@/components/CTAButton';

// Sample course data
const courses: Course[] = [
  {
    id: '1',
    title: 'Thiết kế đồ họa',
    description: 'Học thiết kế đồ họa từ cơ bản đến nâng cao với các công cụ hiện đại.',
    imageUrl: '/placeholder-course.jpg',
    price: 49.99,
    teacherId: 't1',
    teacherName: 'Tiến sĩ Đỗ Hòa',
    rating: 4.8,
    totalStudents: 1200,
    level: 'Beginner',
    category: 'Design',
    topics: ['Photoshop', 'Illustrator'],
    createdAt: '2023-01-01',
    updatedAt: '2023-06-01',
  },
  {
    id: '2',
    title: 'Thiết kế đồ họa',
    description: 'Học thiết kế đồ họa từ cơ bản đến nâng cao với các công cụ hiện đại.',
    imageUrl: '/placeholder-course.jpg',
    price: 49.99,
    teacherId: 't1',
    teacherName: 'Tiến sĩ Đỗ Hòa',
    rating: 4.7,
    totalStudents: 980,
    level: 'Intermediate',
    category: 'Design',
    topics: ['Photoshop', 'Illustrator'],
    createdAt: '2023-01-01',
    updatedAt: '2023-06-01',
  },
  {
    id: '3',
    title: 'Thiết kế đồ họa',
    description: 'Học thiết kế đồ họa từ cơ bản đến nâng cao với các công cụ hiện đại.',
    imageUrl: '/placeholder-course.jpg',
    price: 49.99,
    teacherId: 't1',
    teacherName: 'Tiến sĩ Đỗ Hòa',
    rating: 4.5,
    totalStudents: 850,
    level: 'Advanced',
    category: 'Design',
    topics: ['Photoshop', 'Illustrator'],
    createdAt: '2023-01-01',
    updatedAt: '2023-06-01',
  },
  {
    id: '4',
    title: 'Thiết kế đồ họa',
    description: 'Học thiết kế đồ họa từ cơ bản đến nâng cao với các công cụ hiện đại.',
    imageUrl: '/placeholder-course.jpg',
    price: 49.99,
    teacherId: 't1',
    teacherName: 'Tiến sĩ Đỗ Hòa',
    rating: 4.6,
    totalStudents: 1050,
    level: 'Beginner',
    category: 'Design',
    topics: ['Photoshop', 'Illustrator'],
    createdAt: '2023-01-01',
    updatedAt: '2023-06-01',
  },
];

export default function Home() {
  const { showModal } = useModal();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Categories */}
      <CategoriesSection />

      {/* Popular Courses */}
      <CourseGrid title="Khóa học phổ biến" courses={courses} />
      
      {/* Why Study Section */}
      <WhyStudySection />
      
      {/* Learners are viewing */}
      <CourseGrid title="Learners are viewing" courses={courses} />
      
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
