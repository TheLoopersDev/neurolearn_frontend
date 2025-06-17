'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { ILesson, ISection } from '@/types/course';

export default function CourseContent({ sections }: { sections: ISection[] }) {
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setOpenSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-full mx-auto text-[#131836]">
      <h2 className="text-3xl font-semibold mb-4">Course content</h2>

      {sections.map((section, sectionKey) => {
        const totalLessons = section.lessons?.length || 0;

        return (
          <div
            key={sectionKey}
            className="rounded-xl bg-[#F9F9F9] w-full mb-2 overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleSection(sectionKey)}
              className="flex justify-between h-[80px] items-center w-full px-4 py-3 text-left text-xl font-bold bg-[#ECECEC] focus:outline-none focus:ring-0 focus:border-none"
            >
              <div>{section.title}</div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-normal whitespace-nowrap">
                  {totalLessons} lectures
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openSections.includes(sectionKey) ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {openSections.includes(sectionKey) && (
              <div className="text-sm">
                {section.lessons?.map((lesson: ILesson, idx: number) => (
                  <div key={idx} className="flex justify-between items-center px-4 py-2">
                    <div className="flex items-center gap-2 h-[40px]">
                      <span className="p-2">
                        <Image
                          src={`/assets/icons/number-${idx + 1}.svg`}
                          alt={`number ${idx + 1}`}
                          width={20}
                          height={20}
                        />
                      </span>
                      <span className="text-[#3A3C45] text-xl">{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#3A3C45]">
                      {lesson.isFree && (
                        <span className="bg-[#3858F8] text-white text-xs px-2 py-0.5 rounded">
                          Preview
                        </span>
                      )}
                      <span>--</span> {/* Optional: Replace with duration if available */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
