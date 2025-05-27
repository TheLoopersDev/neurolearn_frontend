"use client";

import { Course } from '@/types/course';
import CourseCard from '@/components/common/CourseCard';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import courseApi from '@/lib/api/course';
import { useEffect, useState } from 'react';
import Loading from '@/components/common/Loading';

interface CourseGridProps {
  title: string;
  type?: 'all' | 'top';
}

const CourseGrid = ({ title, type = 'all' }: CourseGridProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = type === 'all' 
          ? await courseApi.getAll()
          : await courseApi.getTopCourses();
        
        if (response?.success) {
          const courses = type === 'all' 
            ? (response.courses ?? (response.data?.courses || []))
            : (response.data?.topCourses || []);
          setCourses(courses.slice(0, 4));
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [type]);

  if (loading) {
    return <Loading title={title} />;
  }

  if (courses.length === 0) {
    return (
      <div className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-medium mb-6">{title}</h2>
          <div className="text-center text-gray-500">No courses available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <AnimatedSection variants={fadeIn}>
          <h2 className="text-xl font-medium mb-6">{title}</h2>
        </AnimatedSection>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CourseGrid;