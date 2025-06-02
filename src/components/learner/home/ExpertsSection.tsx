"use client";

import ExpertCard from '@/components/common/ExpertCard';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeIn, staggerContainer } from '@/utils/animations';

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
        <AnimatedSection variants={fadeIn}>
          <h2 className="text-xl font-medium mb-6">Our Experts</h2>
        </AnimatedSection>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {displayExperts.map((expert, index) => (
            <motion.div
              key={expert.id}
              variants={fadeIn}
              transition={{ delay: index * 0.2 }}
            >
              <ExpertCard
                name={expert.name}
                role={expert.role}
                imageUrl={expert.imageUrl}
                profileUrl={`/experts/${expert.id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertsSection;