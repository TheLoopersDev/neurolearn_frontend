import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types/course';

interface CourseCardProps {
  readonly course: Course;
  readonly isTeacher?: boolean;
  readonly onEdit?: (id: string) => void;
  readonly onDelete?: (id: string) => void;
  readonly onEnroll?: (id: string) => void;
}

export default function CourseCard({
  course,
  isTeacher = false,
  onEdit,
  onDelete,
  onEnroll,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={course.imageUrl || '/placeholder-course.jpg'}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-sm text-gray-600 mt-1">by {course.teacherName}</p>
        <div className="flex items-center mt-2">
          {course.rating && (
            <div className="flex items-center mr-2">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-sm">{course.rating.toFixed(1)}</span>
            </div>
          )}
          {course.totalStudents && (
            <span className="text-sm text-gray-500">{course.totalStudents} students</span>
          )}
        </div>
        <p className="mt-2 text-gray-700 line-clamp-2">{course.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-lg">${course.price.toFixed(2)}</span>
          <div className="flex space-x-2">
            {isTeacher ? (
              <>
                <button
                  onClick={() => onEdit?.(course.id)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(course.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => onEnroll?.(course.id)}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                Enroll
              </button>
            )}
            <Link
              href={`/courses/${course.id}`}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
