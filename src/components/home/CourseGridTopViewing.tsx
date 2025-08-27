'use client';

import { Course } from '@/types/course';
import CourseCard from '@/components/common/CourseCard';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Loading from '@/components/common/Loading';
import { useGetTopViewingQuery } from '@/lib/redux/features/course/courseApi';
import { useRouter } from 'next/navigation';
interface CourseGridProps {
  title: string;
}

const CourseGridTopViewing = ({ title }: CourseGridProps) => {
  const { data, isLoading, error } = useGetTopViewingQuery();
  const router = useRouter();

  // Get courses from response

  const courses = data?.success && Array.isArray(data.courses) ? data.courses.slice(0, 4) : [];

  if (isLoading) {
    return <Loading title={title} />;
  }

  if (error) {
    console.error('Error fetching courses:', error);
    return (
      <div className="py-6 sm:py-8 md:py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4 sm:mb-6 text-gray-900">{title}</h2>
          <div className="text-center text-gray-500 text-sm sm:text-base">Error loading courses</div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="py-6 sm:py-8 md:py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4 sm:mb-6 text-gray-900">{title}</h2>
          <div className="text-center text-gray-500 text-sm sm:text-base">No courses available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="container mx-auto">
        {/* Header section with title and view more */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
          <AnimatedSection variants={fadeIn}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#0D0D0D] text-center sm:text-left">{title}</h2>
          </AnimatedSection>
          <div
            className="text-blue-900 cursor-pointer hover:underline flex items-center justify-center sm:justify-start text-sm sm:text-base font-medium"
            onClick={() => router.push('/courses?page=1')}
          >
            <span className="mr-2">View More</span>
            {/* Arrow SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Course grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {courses.map((course: Course, index: number) => (
            <motion.div key={course._id} variants={fadeIn} transition={{ delay: index * 0.1 }}>
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CourseGridTopViewing;
