'use client';

import React from 'react';
import { Course } from '@/types/course';
import CourseCard from '@/components/common/CourseCard';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';

interface CourseGridProps {
    courses: Course[];
    title?: string; // Optional nếu bạn muốn hiển thị tiêu đề
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, title }) => {
    if (!courses || courses.length === 0) {
        return (
            <div className="py-10 bg-gray-50">
                <div className="container mx-auto px-4">
                    {title && <h2 className="text-4xl font-medium mb-6">{title}</h2>}
                    <div className="text-center text-gray-500">No courses available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10">
            <div className="container mx-auto px-4">
                {title && (
                    <AnimatedSection variants={fadeIn}>
                        <h2 className="text-4xl md:text-4xl text-[#0D0D0D] mb-6">{title}</h2>
                    </AnimatedSection>
                )}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {courses.map((course: Course, index: number) => (
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
