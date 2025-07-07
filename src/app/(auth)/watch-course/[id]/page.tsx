'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import TabMenu from '@/components/instructor/TabMenu';
import CourseContent from '@/components/instructor/CourseContent';
import ReactPlayer from 'react-player';
import axios from 'axios';

function CoursePage() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const hasUpdatedProgress = useRef(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/course-data/${courseId}`);
        const data = await res.json();
        if (data.success) {
          setCourse(data.course);
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (course?.demoUrl?.url) {
      setCurrentVideoUrl(course.demoUrl.url);
      setCurrentLessonId(null);
    }
  }, [course]);

  const handleLessonClick = (url: string, lessonId: string) => {
    setCurrentVideoUrl(url);
    setCurrentLessonId(lessonId);
    console.log('Lesson clicked:', lessonId);
    hasUpdatedProgress.current = false;
  };

  const markLessonCompleted = (lessonId: string) => {
    setCourse((prevCourse: any) => {
      if (!prevCourse) return prevCourse;

      const updatedSections = prevCourse.sections.map((section: any) => ({
        ...section,
        lessons: section.lessons.map((lesson: any) =>
          lesson._id === lessonId ? { ...lesson, isCompleted: true } : lesson
        ),
      }));

      return { ...prevCourse, sections: updatedSections };
    });
  };

  const handleProgress = async (state: { played: number }) => {
    if (state.played >= 0.8 && currentLessonId && !hasUpdatedProgress.current) {
      hasUpdatedProgress.current = true;
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/progress/update-lesson-completion/${courseId}`,
          {
            lessonId: currentLessonId,
            isCompleted: true,
          },
          { withCredentials: true }
        );
        markLessonCompleted(currentLessonId);
      } catch (error) {
        console.error('❌ Failed to update progress:', error);
      }
    }
  };


  return (
    <div className="w-full bg-[#F7F8FA] py-20">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-20 px-4 sm:px-6 lg:px-20">
          {/* LEFT: Nội dung video */}
          <div className="w-full lg:w-[65%] space-y-10">
            {currentVideoUrl ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <ReactPlayer
                  url={currentVideoUrl}
                  controls
                  width="100%"
                  height="100%"
                  onProgress={handleProgress}
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload',
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center">
                <p>No demo video</p>
              </div>
            )}
            <TabMenu />
          </div>

          {/* RIGHT: Danh sách bài học */}
          <div className="w-full lg:w-[35%] space-y-6">
            <CourseContent
              sections={course?.sections}
              onLessonClick={handleLessonClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
