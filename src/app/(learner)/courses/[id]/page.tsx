'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Course } from '@/types/course';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">{error || 'Course not found'}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {course.category}
            </span>
            {course.level && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                {course.level}
              </span>
            )}
          </div>

          <div className="relative h-64 md:h-80 w-full mb-6 rounded-lg overflow-hidden">
            <Image
              src={course.imageUrl || '/placeholder-course.jpg'}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Topics</h2>
            <ul className="list-disc list-inside">
              {course.topics.map((topic, index) => (
                <li key={`topic-${topic}-${index}`} className="mb-1 text-gray-700">
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="text-center mb-4">
              <span className="text-3xl font-bold">${course.price.toFixed(2)}</span>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 mb-4">
              Enroll Now
            </button>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Instructor:</span>
                <span className="font-medium">{course.teacherName}</span>
              </div>
              {course.duration && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
              )}
              {course.totalStudents && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{course.totalStudents}</span>
                </div>
              )}
              {course.rating && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    {course.rating.toFixed(1)}
                  </span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
