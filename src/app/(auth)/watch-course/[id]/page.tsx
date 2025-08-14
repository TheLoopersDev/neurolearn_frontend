'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import TabMenu from '@/components/instructor/TabMenu';
import CourseContent from '@/components/instructor/CourseContent';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";

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
  type FlatLesson = {
    id: string;
    title: string;
    url?: any;
    isCompleted?: boolean;
  };

  const flatLessons = useMemo<FlatLesson[]>(() => {
    const out: FlatLesson[] = [];
    const secs = course?.sections ?? [];

    for (const sec of secs) {
      // nếu có items thì dùng items theo thứ tự
      if (Array.isArray(sec.items) && sec.items.length) {
        for (const it of sec.items) {
          if (it?.kind !== 'lesson') continue;
          const url = it?.payload?.videoUrl?.url;
          out.push({
            id: String(it._id),
            title: String(it.title ?? it.payload?.title ?? ''),
            url,
            isCompleted: Boolean(it?.payload?.isCompleted),
          });
        }
        continue;
      }

      // nếu không có items, dùng lessons
      if (Array.isArray(sec.lessons) && sec.lessons.length) {
        for (const l of sec.lessons) {
          const url = l?.videoUrl?.url;
          out.push({
            id: String(l._id),
            title: String(l.title ?? ''),
            url,
            isCompleted: Boolean(l?.isCompleted),
          });
        }
      }
    }
    return out;
  }, [course]);

  // ==== NEW: bài đầu tiên đúng chuẩn ====
  const firstPlayable = useMemo(() => {
    // ưu tiên bài CHƯA hoàn thành + có video
    const uncompleted = flatLessons.find(x => !x.isCompleted && x.url);
    if (uncompleted) return uncompleted;

    // fallback: bài đầu tiên có video
    return flatLessons.find(x => x.url) ?? null;
  }, [flatLessons]);

  // ==== UPDATE: CTA lesson ưu tiên nextLesson, rồi firstPlayable ====
  const ctaLesson = nextLesson ?? firstPlayable;

  // Optimistic mark as completed
  // ==== UPDATE: cho phép set true/false để rollback chính xác ====
  const markLessonCompleted = (lessonId: string, completed = true) => {
    setCourse((prev: any) => {
      if (!prev) return prev;

      const sections = prev.sections.map((sec: any) => {
        // update lessons
        const updatedLessons = Array.isArray(sec.lessons)
          ? sec.lessons.map((l: any) =>
            l._id === lessonId ? { ...l, isCompleted: completed } : l
          )
          : sec.lessons;

        // update items
        const updatedItems = Array.isArray(sec.items)
          ? sec.items.map((item: any) => {
            if (item.kind === 'lesson' && item._id === lessonId) {
              return {
                ...item,
                payload: { ...item.payload, isCompleted: completed },
              };
            }
            return item;
          })
          : sec.items;

        return { ...sec, lessons: updatedLessons, items: updatedItems };
      });

      const countLessons = (s: any) => (s.lessons?.length || 0);
      const countCompleted = (s: any) => (s.lessons?.filter((l: any) => l.isCompleted).length || 0);

      const totalLessons = sections.reduce((a: number, s: any) => a + countLessons(s), 0);
      const totalCompleted = sections.reduce((a: number, s: any) => a + countCompleted(s), 0);

      const progress = {
        totalLessons,
        totalCompleted,
        progressPercentage: totalLessons ? Math.round((totalCompleted / totalLessons) * 100) : 0,
      };

      return { ...prev, sections, progress };
    });
  };


  // ==== REPLACE: findNextLesson bằng phiên bản dựa trên flatLessons ====
  const findNextLesson = (lessonId?: string | null) => {
    if (!lessonId) return null;
    const idx = flatLessons.findIndex(x => x.id === lessonId);
    if (idx === -1) return null;

    // tìm phần tử kế tiếp có video
    for (let i = idx + 1; i < flatLessons.length; i++) {
      const n = flatLessons[i];
      if (n?.url) return { id: n.id, url: n.url, title: n.title };
    }
    return null;
  };


  // ReactPlayer progress
  // ReactPlayer progress
  const handleProgress = async (state: { played: number }) => {
    if (state.played >= 0.8 && currentLessonId && !hasUpdatedProgress.current) {
      hasUpdatedProgress.current = true;

      // Optimistic update
      markLessonCompleted(currentLessonId, true);

      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/progress/update-lesson-completion/${courseId}`,
          { lessonId: currentLessonId, isCompleted: true },
          { withCredentials: true }
        );

        // (tuỳ chọn) đồng bộ lại từ server nếu cần
        // const res = await fetch(...);
        // const data = await res.json();
        // if (data.success) setCourse(data.course);

        // CHỈ chuẩn bị nextLesson, KHÔNG auto navigate, KHÔNG ẩn player
        const n = findNextLesson(currentLessonId);
        setNextLesson(n);
        // ❌ bỏ dòng setCurrentVideoUrl(null);
      } catch (error) {
        console.error('Failed to update progress:', error);
        // rollback nếu cần
        markLessonCompleted(currentLessonId, false);
        hasUpdatedProgress.current = false;
      }
    }
  };


  const handleLessonClick = (url: string, lessonId: string) => {
    setCurrentVideoUrl(url);
    setCurrentLessonId(lessonId);
    setNextLesson(null);
    hasUpdatedProgress.current = false;
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
              <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <ReactPlayer
                  url={currentVideoUrl}
                  controls
                  width="100%"
                  height="100%"
                  onProgress={handleProgress}
                  config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                />

                {/* CTA nổi khi đã đủ 80%: KHÔNG auto navigate */}
                <AnimatePresence>
                  {nextLesson?.url && (
                    <motion.div
                      key="next-up-cta"
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="absolute bottom-3 right-3 flex gap-2"
                      aria-live="polite"
                    >
                      <motion.button
                        onClick={() => {
                          setCurrentVideoUrl(nextLesson.url);
                          setCurrentLessonId(nextLesson.id);
                          setNextLesson(null);
                          hasUpdatedProgress.current = false;
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                       bg-emerald-600 text-white shadow-md"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        // nhịp “pulse” nhẹ để thu hút
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(16,185,129,0.0)",
                            "0 0 0 8px rgba(16,185,129,0.15)",
                            "0 0 0 0 rgba(16,185,129,0.0)",
                          ],
                        }}
                        transition={{ duration: 1.6, repeat: Infinity, repeatType: "loop", repeatDelay: 1.1 }}
                        title={`Next up: ${nextLesson.title}`}
                      >
                        {/* chấm xanh nháy nhẹ */}
                        <motion.span
                          className="inline-block w-2 h-2 rounded-full bg-white/90"
                          animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                        <span className="truncate max-w-[240px]">Next up: {nextLesson.title}</span>
                      </motion.button>

                      <motion.button
                        onClick={() => setNextLesson(null)}
                        className="inline-flex items-center px-2 py-1.5 rounded-lg text-xs
                       bg-white/85 backdrop-blur border border-white/60 text-gray-700"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title="Hide suggestion"
                      >
                        Dismiss
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              currentLessonId={currentLessonId ?? undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
