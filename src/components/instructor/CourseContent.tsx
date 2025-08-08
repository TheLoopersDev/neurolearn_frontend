'use client';

import { useMemo, useState, useCallback } from 'react';
import { ChevronDown, Lock, CheckCircle2, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';

type CourseContentProps = Readonly<{
  courseId: string;
  sections: {
    _id: string;
    title: string;
    lessons: {
      _id: string;
      title: string;
      videoLength?: number;
      isFree?: boolean;
      order?: number;
      videoUrl?: { url: string };
      isCompleted?: boolean;
    }[];
    quizzes?: {
      _id: string;
      name: string;
      examTitle?: string;
      duration: string;
      difficulty: 'easy' | 'medium' | 'hard';
      totalQuestions: number;
      lessonOrder?: number;
      sectionOrder?: number;
    }[];
  }[];
  onLessonClick: (url: string, lessonId: string) => void;
  progress?: { totalLessons: number; totalCompleted: number; progressPercentage: number };
}>;

const formatDuration = (seconds?: number) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, when: 'beforeChildren' } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 30, mass: 0.6 } }
};

export default function CourseContent({ courseId, sections, onLessonClick, progress }: CourseContentProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const router = useRouter();

  const toggleSection = (id: string) => {
    setOpenSections((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]));
  };

  const previousSectionsCompleted = useCallback((sectionIndex: number) => {
    if (!sections) return false;
    if (sectionIndex === 0) return true;
    for (let i = 0; i < sectionIndex; i++) {
      const sec = sections[i];
      if (!sec?.lessons?.length) continue;
      if (!sec.lessons.every(l => !!l.isCompleted)) return false;
    }
    return true;
  }, [sections]);

  const canAccess = useCallback((sectionIndex: number, lessonIndex: number) => {
    if (!previousSectionsCompleted(sectionIndex)) return false;
    if (lessonIndex === 0) return true;
    return !!sections?.[sectionIndex]?.lessons?.[lessonIndex - 1]?.isCompleted;
  }, [sections, previousSectionsCompleted]);

  const nextUp = useMemo(() => {
    const list = sections ?? [];
    for (let s = 0; s < list.length; s++) {
      if (!previousSectionsCompleted(s)) break;
      const sec = list[s];
      for (let l = 0; l < (sec.lessons?.length || 0); l++) {
        const lesson = sec.lessons[l];
        if (!lesson.isCompleted && canAccess(s, l)) {
          return { sIndex: s, lIndex: l, id: lesson._id };
        }
      }
    }
    return null;
  }, [sections, canAccess, previousSectionsCompleted]);
  return (
    <div className="max-w-full mx-auto text-black">
      {/* Progress tổng */}
      {progress && (
        <div className="mb-3 rounded-xl border border-gray-200 bg-[#ECECEC] p-2">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-extralight antialiased italic">Your progress</span>
            <span className="text-xs text-gray-700">
              {progress.totalCompleted}/{progress.totalLessons} ({progress.progressPercentage}%)
            </span>
          </div>
          <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
            <motion.div
              className="h-1 bg-green-500 rounded"
              initial={{ width: 0 }}
              animate={{ width: `${progress.progressPercentage}%` }}
              transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            />
          </div>
        </div>
      )}

      {sections?.map((section, sIdx) => {
        const isOpen = openSections.includes(section._id);
        const sectionDoneCount = section.lessons?.filter((l) => l.isCompleted).length ?? 0;
        const sectionTotal = section.lessons?.length ?? 0;
        const sectionPct = sectionTotal ? Math.round((sectionDoneCount / sectionTotal) * 100) : 0;

        return (
          <motion.div
            key={section._id}
            layout
            className="rounded-xl bg-[#F9F9F9] w-full mb-2 overflow-hidden shadow-sm border border-gray-100"
          >
            {/* Section header */}
            <motion.button
              layout
              onClick={() => toggleSection(section._id)}
              className="flex justify-between items-center w-full px-4 py-3 text-left"
              whileTap={{ scale: 0.995 }}
              whileHover={{ backgroundColor: '#e4e4e7' }}
              transition={{ duration: 0.12 }}
            >
              {/* Cột trái: tiêu đề + mini progress */}
              <div className="flex-1 min-w-0">
                <span
                  className="block text-lg font-semibold leading-snug line-clamp-2"
                  title={section.title}
                >{section.title}</span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1 flex-1 max-w-[120px] bg-gray-200 rounded overflow-hidden">
                    <motion.div
                      className="h-1 bg-green-500 rounded"
                      initial={false}
                      animate={{ width: `${sectionPct}%` }}
                      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-600 whitespace-nowrap">
                    {sectionDoneCount}/{sectionTotal}
                  </span>
                </div>
              </div>

              {/* Cột phải: trạng thái + mũi tên */}
              <div className="flex-shrink-0 flex items-center gap-3 ml-4">
                {sectionPct === 100 ? (
                  <div className="flex items-center gap-1 text-green-600 text-xs whitespace-nowrap">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-600 text-xs whitespace-nowrap">
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">In progress</span>
                  </div>
                )}
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </div>
            </motion.button>


            {/* Collapse body */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { height: 'auto', opacity: 1 },
                    collapsed: { height: 0, opacity: 0 }
                  }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="text-sm overflow-hidden"
                >
                  {/* Lessons list */}
                  <motion.div variants={listVariants} initial="hidden" animate="show" className="py-1">
                    {section.lessons?.map((lesson, lIdx) => {
                      const unlocked = canAccess(sIdx, lIdx);
                      const isNextUp = nextUp && nextUp.id === lesson._id;

                      return (
                        <motion.div
                          key={lesson._id}
                          variants={itemVariants}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            if (unlocked && lesson.videoUrl?.url) {
                              onLessonClick(lesson.videoUrl.url, lesson._id);
                            }
                          }}
                          onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ') && unlocked && lesson.videoUrl?.url) {
                              onLessonClick(lesson.videoUrl.url, lesson._id);
                            }
                          }}
                          className={`group flex justify-between items-center px-4 py-2 rounded-md mx-1 ${unlocked
                            ? 'cursor-pointer hover:bg-gray-100'
                            : 'opacity-60 cursor-not-allowed bg-gray-50'
                            }`}
                          title={
                            unlocked
                              ? undefined
                              : sIdx > 0
                                ? 'Hoàn thành toàn bộ section trước để mở bài này'
                                : 'Hoàn thành bài trước để mở bài này'
                          }
                          whileTap={unlocked ? { scale: 0.995 } : undefined}
                          // nháy nhẹ cho "next up"
                          animate={
                            isNextUp
                              ? { scale: [1, 1.01, 1], boxShadow: ['none', '0 0 0 3px rgba(34,197,94,0.12)', 'none'] }
                              : {}
                          }
                          transition={isNextUp ? { duration: 1.2, repeat: Infinity } : undefined}
                        >
                          <div className="flex items-center gap-2 h-[40px]">
                            {/* Icon trạng thái bài */}
                            {lesson.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : unlocked ? (
                              <Play className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}

                            <div className="flex items-center gap-2">
                              <span className={`text-[#3A3C45] text-base ${!unlocked ? 'line-through/0' : ''}`}>
                                {lesson.order ? `${lesson.order}. ` : ''}
                                {lesson.title}
                              </span>

                              {/* Chip trạng thái */}
                              {lesson.isCompleted && (
                                <motion.span
                                  layout
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.15 }}
                                  className="ml-1 text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-[10px]"
                                >
                                  Completed
                                </motion.span>
                              )}
                              {!lesson.isCompleted && isNextUp && (
                                <motion.span
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="ml-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]"
                                >
                                  Next up
                                </motion.span>
                              )}
                              {!unlocked && (
                                <span className="ml-1 text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded-full text-[10px]">
                                  Locked
                                </span>
                              )}
                            </div>
                          </div>

                          <span className={`text-[#3A3C45] ${!unlocked ? 'text-gray-400' : ''}`}>
                            {formatDuration(lesson.videoLength)}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Quizzes */}
                  {(section.quizzes?.length ?? 0) > 0 && (
                    <motion.div variants={listVariants} initial="hidden" animate="show" className="pb-2">
                      {(section.quizzes ?? []).map((quiz) => (
                        <motion.div
                          key={quiz._id}
                          variants={itemVariants}
                          role="button"
                          tabIndex={0}
                          className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-md mx-1"
                          onClick={() => router.push(`/watch-course/${courseId}/quiz/${quiz._id}`)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              router.push(`/watch-course/${courseId}/quiz/${quiz._id}`);
                            }
                          }}
                          whileTap={{ scale: 0.995 }}
                        >
                          <div className="flex flex-col">
                            <span className="text-[#3A3C45] text-base font-medium">Quiz: {quiz.name}</span>
                            <span className="text-xs text-gray-500">
                              {quiz.duration} | {quiz.difficulty} | {quiz.totalQuestions} questions
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
