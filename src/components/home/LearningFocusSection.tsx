"use client";

import Image from 'next/image';

interface FocusCardProps {
  title: string;
}

const FocusCard = ({ title }: FocusCardProps) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center">
    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mr-4">
      <Image src="/assets/home/Alarm.svg" alt={title} width={24} height={24} className="opacity-60" />
    </div>
    <div>
      <h3 className="font-medium text-sm">{title}</h3>
    </div>
    <div className="ml-auto">
      <Image src="/assets/home/Arrow.svg" alt="Arrow" width={18} height={18} />
    </div>
  </div>
);

const LearningFocusSection = () => {
  const focusAreas = [
    'Hands-on training',
    'Certification prep',
    'Containerization'
  ];

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-medium mb-6">Learning focused on your goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {focusAreas.map((area) => (
            <FocusCard key={area} title={area} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningFocusSection;