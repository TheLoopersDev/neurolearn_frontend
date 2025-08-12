'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const [nextLesson, setNextLesson] = useState<{ id: string; url: string; title: string } | null>(null);

  const hasUpdatedProgress = useRef(false);

  // Fetch course (with credentials so BE can merge progress)
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/course-data/${courseId}`,
          { credentials: 'include', cache: 'no-store' }
        );
        const data = await res.json();
        if (data.success) setCourse(data.course);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  // If course has demo video, show it; otherwise keep player empty for CTA card.
  // useEffect(() => {
  //   if (course?.demoUrl?.url) {
  //     setCurrentVideoUrl(course.demoUrl.url);
  //     setCurrentLessonId(null);
  //     setNextLesson(null);
  //   } else {
  //     setCurrentVideoUrl(null);
  //     setCurrentLessonId(null);
  //   }
  // }, [course]);

  // Find the first playable lesson
  const firstLesson = useMemo(() => {
    const secs = course?.sections || [];
    for (const sec of secs) {
      for (const ls of sec.lessons || []) {
        if (ls?.videoUrl?.url) return { id: ls._id, url: ls.videoUrl.url, title: ls.title };
      }
    }
    return null;
  }, [course]);

  // CTA lesson: prefer "nextLesson" after completing, else the very first
  const ctaLesson = nextLesson ?? firstLesson;

  const handleLessonClick = (url: string, lessonId: string) => {
    setCurrentVideoUrl(url);
    setCurrentLessonId(lessonId);
    setNextLesson(null);
    hasUpdatedProgress.current = false;
  };

  // Optimistic mark as completed
  const markLessonCompleted = (lessonId: string) => {
    setCourse((prev: any) => {
      if (!prev) return prev;

      const sections = prev.sections.map((sec: any) => {
        // Cập nhật lessons
        const updatedLessons = sec.lessons?.map((l: any) =>
          l._id === lessonId ? { ...l, isCompleted: true } : l
        );

        // Cập nhật items nếu có
        const updatedItems = sec.items?.map((item: any) => {
          if (item.kind === 'lesson' && item._id === lessonId) {
            return {
              ...item,
              payload: {
                ...item.payload,
                isCompleted: true
              }
            };
          }
          return item;
        });

        return {
          ...sec,
          lessons: updatedLessons || sec.lessons,
          items: updatedItems || sec.items
        };
      });

      const totalLessons = sections.reduce((a: number, s: any) => a + (s.lessons?.length || 0), 0);
      const totalCompleted = sections.reduce(
        (a: number, s: any) => a + (s.lessons?.filter((l: any) => l.isCompleted).length || 0),
        0
      );
      const progress = {
        totalLessons,
        totalCompleted,
        progressPercentage: totalLessons ? Math.round((totalCompleted / totalLessons) * 100) : 0,
      };

      return { ...prev, sections, progress };
    });
  };

  // Find next lesson for CTA (no auto navigate)
  const findNextLesson = (lessonId?: string | null) => {
    if (!course?.sections?.length || !lessonId) return null;

    for (let i = 0; i < course.sections.length; i++) {
      const section = course.sections[i];

      // Kiểm tra trong lessons trước
      const lessonIdx = section.lessons?.findIndex((l: any) => l._id === lessonId) ?? -1;
      if (lessonIdx !== -1) {
        // next in same section lessons
        if (lessonIdx + 1 < section.lessons?.length) {
          const n = section.lessons[lessonIdx + 1];
          if (n?.videoUrl?.url) return { id: n._id, url: n.videoUrl.url, title: n.title };
        }
        // kiểm tra tiếp trong items nếu có
        const items = section.items || [];
        const itemIdx = items.findIndex((it: any) => it.kind === 'lesson' && it._id === lessonId);
        if (itemIdx !== -1 && itemIdx + 1 < items.length) {
          const nextItem = items[itemIdx + 1];
          if (nextItem.kind === 'lesson' && nextItem.payload?.videoUrl?.url) {
            return {
              id: nextItem._id,
              url: nextItem.payload.videoUrl.url,
              title: nextItem.title
            };
          }
        }
        // first in next section
        if (i + 1 < course.sections.length) {
          const nextSection = course.sections[i + 1];
          const n = nextSection.lessons?.[0] || nextSection.items?.find((it: any) => it.kind === 'lesson');
          if (n?.videoUrl?.url || n?.payload?.videoUrl?.url) {
            return {
              id: n._id,
              url: n.videoUrl?.url || n.payload.videoUrl.url,
              title: n.title || n.payload.title
            };
          }
        }
        break;
      }

      // Kiểm tra trong items nếu không tìm thấy trong lessons
      const items = section.items || [];
      const itemIdx = items.findIndex((it: any) => it.kind === 'lesson' && it._id === lessonId);
      if (itemIdx !== -1) {
        if (itemIdx + 1 < items.length) {
          const nextItem = items[itemIdx + 1];
          if (nextItem.kind === 'lesson' && nextItem.payload?.videoUrl?.url) {
            return {
              id: nextItem._id,
              url: nextItem.payload.videoUrl.url,
              title: nextItem.title
            };
          }
        }
        if (i + 1 < course.sections.length) {
          const nextSection = course.sections[i + 1];
          const n = nextSection.items?.find((it: any) => it.kind === 'lesson') || nextSection.lessons?.[0];
          if (n) {
            return {
              id: n._id,
              url: n.payload?.videoUrl?.url || n.videoUrl?.url,
              title: n.title || n.payload?.title
            };
          }
        }
        break;
      }
    }
    return null;
  };

  // ReactPlayer progress
  const handleProgress = async (state: { played: number }) => {
    if (state.played >= 0.8 && currentLessonId && !hasUpdatedProgress.current) {
      hasUpdatedProgress.current = true;

      // Optimistic update trước
      markLessonCompleted(currentLessonId);

      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/progress/update-lesson-completion/${courseId}`,
          { lessonId: currentLessonId, isCompleted: true },
          { withCredentials: true }
        );

        // Fetch lại dữ liệu mới nhất từ server để đảm bảo đồng bộ
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/course-data/${courseId}`,
          { credentials: 'include', cache: 'no-store' }
        );
        const data = await res.json();
        if (data.success) setCourse(data.course);

        // Chuẩn bị CTA cho bài kế tiếp
        const n = findNextLesson(currentLessonId);
        setNextLesson(n);
        setCurrentVideoUrl(null); // Ẩn player → hiện CTA
      } catch (error) {
        console.error('Failed to update progress:', error);
        // Rollback nếu có lỗi
        markLessonCompleted(currentLessonId); // Gọi lại để đảo trạng thái
      }
    }
  };

  const startCtaLesson = () => {
    if (!ctaLesson) return;
    setCurrentVideoUrl(ctaLesson.url);
    setCurrentLessonId(ctaLesson.id);
    setNextLesson(null);
    hasUpdatedProgress.current = false;
  };

  return (
    <div className="w-full py-20">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-20 px-4 sm:px-6 lg:px-20">
          {/* LEFT: Player / CTA */}
          <div className="w-full lg:w-[65%] space-y-10">
            {currentVideoUrl ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <ReactPlayer
                  url={currentVideoUrl}
                  controls
                  width="100%"
                  height="100%"
                  onProgress={handleProgress}
                  config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                />
              </div>
            ) : (
                <div className="w-full aspect-video rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 animate-pulse">
                    </div>

                    <p className="text-gray-600 mb-3">
                      {nextLesson
                        ? 'Great job! Ready for the next lesson?'
                        : course?.name
                          ? ''
                          : 'Loading course...'}
                    </p>

                    <button
                      disabled={!ctaLesson?.url}
                      onClick={startCtaLesson}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                      ${ctaLesson?.url
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                    >
                      {ctaLesson?.title ? `Start: ${ctaLesson.title}` : 'No video lesson available yet'}
                    </button>
                  </div>
              </div>
            )}

            <TabMenu course={course} />
          </div>

          {/* RIGHT: Content list */}
          <div className="w-full lg:w-[35%] space-y-6">
            <CourseContent
              courseId={Array.isArray(courseId) ? courseId[0] : (courseId as string) || ''}
              sections={course?.sections}
              onLessonClick={handleLessonClick}
              progress={course?.progress}
              /** 👇 highlight + đảm bảo status thẳng hàng */
              currentLessonId={currentLessonId ?? undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
