'use client';

import Image from 'next/image';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { useRouter } from 'next/navigation';
import { useGetLatestCourseQuery } from '@/lib/redux/features/course/courseApi';

export default function CourseStatus() {
  const { user } = useSelector((state: any) => state.auth);
  const { data, isLoading } = useGetLatestCourseQuery(user?._id ?? skipToken);
  const router = useRouter();

  const course = data?.course;

  const handleNavigate = () => {
    if (!course) return;
    if (course.status === 'draft') {
      router.push(`/dashboard/courses/edit-course/${course._id}`);
    } else {
      router.push(`/dashboard/courses/${course._id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-2 text-black">Course Status</h2>
        <div>Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-2 text-black">Course Status</h2>
        <div>No courses yet.</div>
      </div>
    );
  }

  const progressPercent = (course.stepsCompleted / course.stepsTotal) * 100;

  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-2 text-black">Course Status</h2>
      <div className="flex items-center text-gray-400 text-sm font-medium border-b pb-2">
        <div className="w-2/5">Course name</div>
        <div className="w-2/5">Progress</div>
        <div className="w-1/5 text-right">Active</div>
      </div>
      <div className="flex items-center pt-6 pb-4">
        {/* Course image and name */}
        <div className="flex items-center w-2/5 gap-4">
          <Image
            src={course.thumbnail}
            alt="Course Thumbnail"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <div>
            <div className="font-semibold text-black leading-tight">{course.name}</div>
            <div className="text-xs text-gray-400 capitalize">{course.status}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="w-2/5 flex flex-col items-end pr-14">
          <span className="text-blue-600 text-sm mb-1">
            {course.stepsCompleted}/{course.stepsTotal} steps
          </span>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Active button */}
        <div className="w-1/5 flex justify-end">
          <button
            onClick={handleNavigate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-full flex items-center gap-2 transition"
          >
            Continue
            <span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M13 5l7 7-7 7M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
