'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type CourseContentProps = {
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
  }[];
  onLessonClick: (url: string, lessonId: string) => void;
};

const formatDuration = (seconds?: number) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function CourseContent({ sections, onLessonClick }: CourseContentProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-full mx-auto text-[#F7F8FA] text-black">
      {sections?.map((section) => (
        <div
          key={section?._id}
          className="rounded-xl bg-[#F9F9F9] w-full mb-2 overflow-hidden shadow-sm"
        >
          <button
            onClick={() => toggleSection(section?._id)}
            className="flex justify-between h-[80px] items-center w-full px-4 py-3 text-left text-xl font-bold bg-[#ECECEC] focus:outline-none"
          >
            <div>{section?.title}</div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-normal whitespace-nowrap">
                {section?.lessons?.length} bài học
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSections.includes(section?._id) ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {openSections.includes(section?._id) && section?.lessons?.length > 0 && (
            <div className="text-sm">
              {section.lessons.map((lesson, index) => {
                const prevLessonCompleted =
                  index === 0 || section.lessons[index - 1]?.isCompleted;
                const isLocked = !prevLessonCompleted;

                return (
                  <div
                    key={lesson._id}
                    className={`flex justify-between items-center px-4 py-2 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'
                      }`}
                    onClick={() => {
                      console.log('Trying to click', lesson.title, 'Locked:', isLocked);
                      if (!isLocked && lesson?.videoUrl?.url) {
                        onLessonClick(lesson.videoUrl.url, lesson._id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 h-[40px]">
                      <span className="text-[#3A3C45] text-xl">
                        {lesson?.order ? `${lesson.order}. ` : ''}
                        {lesson?.title}
                      </span>
                      {lesson?.isCompleted && (
                        <span className="ml-2 text-green-600 text-sm font-medium">(Đã hoàn thành)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[#3A3C45]">
                      <span>{formatDuration(lesson?.videoLength)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
