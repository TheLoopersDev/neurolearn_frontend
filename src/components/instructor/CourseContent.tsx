'use client';

import { useState, JSX } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function CourseContent() {
  const [openSections, setOpenSections] = useState<number[]>([]);

  interface Lecture {
    title: string;
    duration: string;
    preview: boolean;
    icon?: JSX.Element;
  }
  interface Section {
    title: string;
    lectures?: Lecture[] | number;
    duration?: string;
  }

  const sections: Section[] = [
    {
      title: 'Course introduce',
      lectures: [
        {
          title: 'Course introduce',
          duration: '03:28',
          preview: true,
          icon: <Image src="/assets/icons/number-1.svg" alt="number 1" width={20} height={20} />,
        },
        {
          title: 'Downloading Photoshop, Illustrator',
          duration: '03:28',
          preview: false,
          icon: <Image src="/assets/icons/number-2.svg" alt="number 2" width={20} height={20} />,
        },
        {
          title: 'Settings and Preferences',
          duration: '03:28',
          preview: false,
          icon: <Image src="/assets/icons/number-3.svg" alt="number 3" width={20} height={20} />,
        },
      ],
    },
    {
      title: 'Basic Of Photoshop, Illustrator',
      lectures: 3,
    },
    {
      title: 'How to Use the Pen Tool?',
      lectures: 3,
    },
    {
      title: 'How to Use the Pen Tool?',
      lectures: 3,
    },
  ];

  const toggleSection = (index: number) => {
    setOpenSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-full mx-auto text-black">
      {sections.map((section, sectionKey) => (
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
              <span className="text-sm font-normal whitespace-nowrap">3 lectures • 9 min</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSections.includes(sectionKey) ? 'rotate-180' : ''}`}
              />
            </div>
          </button>
          {openSections.includes(sectionKey) && Array.isArray(section.lectures) && (
            <div className=" text-sm">
              {section.lectures.map((lecture, idx) => (
                <div key={idx} className="flex justify-between items-center px-4 py-2">
                  <div className="flex items-center gap-2 h-[40px]">
                    <span className="p-2">{lecture.icon}</span>
                    <span className="text-[#3A3C45] text-xl">{lecture.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#3A3C45]">
                    {lecture.preview && (
                      <span className="bg-[#3858F8] text-white text-xs px-2 py-0.5 rounded">
                        Preview
                      </span>
                    )}
                    <span>{lecture.duration}</span>
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
