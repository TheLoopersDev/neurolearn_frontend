"use client";

import ExpertCard from '@/components/common/ExpertCard';

interface ExpertsProps {
  experts?: Array<{
    id: string;
    name: string;
    role: string;
    imageUrl: string;
  }>;
}

const ExpertsSection = ({ experts }: ExpertsProps) => {
  const defaultExperts = [
    {
      id: '1',
      name: 'Tuyết Trinh',
      role: 'Academic Director',
      imageUrl: '/placeholder-course.jpg',
    },
    {
      id: '2',
      name: 'Tuyết Trinh',
      role: 'Senior Instructor',
      imageUrl: '/placeholder-course.jpg',
    },
    {
      id: '3',
      name: 'Tuyết Trinh',
      role: 'Technology Lead',
      imageUrl: '/placeholder-course.jpg',
    },
  ];

  const displayExperts = experts || defaultExperts;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-medium mb-6">Our Experts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              name={expert.name}
              role={expert.role}
              imageUrl={expert.imageUrl}
              profileUrl={`/experts/${expert.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertsSection;