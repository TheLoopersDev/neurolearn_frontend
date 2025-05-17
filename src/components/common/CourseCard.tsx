"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types/course';
import { motion } from 'framer-motion';
import { hoverScale } from '@/utils/animations';

interface CourseCardProps {
  readonly course: Course;
}

export default function CourseCard({
  course,
}: CourseCardProps) {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <motion.div 
          className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-sm"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Hot Sale!
        </motion.div>
        <div className="relative h-40">
          <Image
            src={course.imageUrl || '/placeholder-course.jpg'}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
        <motion.div 
          className="absolute right-3 -bottom-4"
          whileHover={hoverScale}
        >
          <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
            <Image 
              src="/assets/home/Heart.svg" 
              alt="Favorite" 
              width={16} 
              height={16} 
            />
          </div>
        </motion.div>
      </div>
      <div className="p-4 pt-6">
        <div className="flex items-center mb-1">
          <motion.span 
            className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-sm"
            whileHover={{ scale: 1.05 }}
          >
            {course.level ?? 'All Levels'}
          </motion.span>
        </div>
        <h3 className="text-md font-medium mb-1">{course.title}</h3>
        <p className="text-xs text-gray-500 mb-2">
          By <span className="font-medium">{course.teacherName}</span>
        </p>
        <div className="flex items-center mb-3">
          {course.rating && (
            <div className="flex items-center">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-gray-300 text-xs">★</span>
              <span className="ml-1 text-xs text-gray-600">{course.rating.toFixed(1)}</span>
            </div>
          )}
          {course.totalStudents && (
            <span className="ml-auto text-xs text-gray-500">
              {course.totalStudents} students
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">${course.price.toFixed(2)}</span>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              href={`/courses/${course.id}`}
              className="text-blue-600 text-xs"
            >
              View Details
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
