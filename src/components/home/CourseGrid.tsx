"use client";

import { Course } from '@/types/course';
import CourseCard from '@/components/common/CourseCard';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';

interface CourseGridProps {
  title: string;
  courses: Course[];
}

const CourseGrid = ({ title, courses }: CourseGridProps) => {
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
              key={course.id}
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