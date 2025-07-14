'use client'

import { Course } from '@/types/course';
import CourseCard from '@/components/common/CourseCard';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Loading from '@/components/common/Loading';
import { useGetTopCoursesQuery } from '@/lib/redux/features/course/courseApi';

interface CourseGridProps {
  title: string;
}

const CourseGrid = ({ title }: CourseGridProps) => {
  const { data, isLoading, error } = useGetTopCoursesQuery();
  const courses = data?.success && Array.isArray(data.courses)
    ? data.courses.slice(0, 3)
    : [];

  if (isLoading) return <Loading title={title} />;
  if (error) return (
    <div className="bg-gray-50 w-full">
      <div className="px-4 w-full">
        <h2 className="text-4xl font-medium mb-6">{title}</h2>
        <p className="text-center text-gray-500">Error loading courses</p>
      </div>
    </div>
  );
  if (courses.length === 0) return (
    <div className="py-10 bg-gray-50 w-full">
      <div className="px-4 w-full">
        <h2 className="text-4xl font-medium mb-6">{title}</h2>
        <p className="text-center text-gray-500">No courses available</p>
      </div>
    </div>
  );

  return (
    <div className="w-full py-2 px-4">  {/* full width container */}
      <AnimatedSection variants={fadeIn}>
        <h2 className="text-4xl md:text-4xl text-[#0D0D0D] mb-6">{title}</h2>
      </AnimatedSection>

      <motion.div
        className="grid w-full gap-6 
                   grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {courses.map((course: Course, idx: number) => (
          <motion.div
            key={course._id}
            className="w-full"                 
            variants={fadeIn}
            transition={{ delay: idx * 0.1 }}
          >
            <CourseCard course={course} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CourseGrid;
