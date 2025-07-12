'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CourseContentProps = {
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
};

const formatDuration = (seconds?: number) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function CourseContent({ courseId, sections, onLessonClick }: CourseContentProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const router = useRouter();
  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-full mx-auto text-black">
      {sections?.map((section) => (
        <div
          key={section._id}
          className="rounded-xl bg-[#F9F9F9] w-full mb-2 overflow-hidden shadow-sm"
        >
          <button
            onClick={() => toggleSection(section._id)}
            className="flex justify-between h-[80px] items-center w-full px-4 py-3 text-left text-xl font-bold bg-[#ECECEC] focus:outline-none"
          >
            <div>{section.title}</div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-normal whitespace-nowrap">
                {section.lessons?.length || 0} lessons
                {section.quizzes?.length ? ` • ${section.quizzes.length} quizzes` : ''}
              </span>

              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSections.includes(section._id) ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {openSections.includes(section._id) && (
            <div className="text-sm">
              {section.lessons?.map((lesson, index) => {
                const prevLessonCompleted =
                  index === 0 || section.lessons[index - 1]?.isCompleted;
                const isLocked = !prevLessonCompleted;

                return (
                  <div
                    key={lesson._id}
                    className={`flex justify-between items-center px-4 py-2 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}
                    onClick={() => {
                      if (!isLocked && lesson.videoUrl?.url) {
                        onLessonClick(lesson.videoUrl.url, lesson._id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 h-[40px]">
                      <span className="text-[#3A3C45] text-base">
                        {lesson.order ? `${lesson.order}. ` : ''}
                        {lesson.title}
                      </span>
                      {lesson.isCompleted && (
                        <span className="ml-2 text-green-600 text-xs font-medium">(Completed)</span>
                      )}
                    </div>
                    <span className="text-[#3A3C45]">{formatDuration(lesson.videoLength)}</span>
                  </div>
                );
              })}

              {/* Quiz block */}
              {(section.quizzes?.length ?? 0) > 0 &&
                (section.quizzes ?? []).map((quiz) => (
                  <div
                    key={quiz._id}
                    className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      router.push(`/watch-course/${courseId}/quiz/${quiz._id}`);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="text-[#3A3C45] text-base font-medium">
                        Quiz: {quiz.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {quiz.duration} | {quiz.difficulty} | {quiz.totalQuestions} questions
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
