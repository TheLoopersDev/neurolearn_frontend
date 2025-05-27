"use client";

import { useEffect, useState } from 'react';
import ExpertCard from '@/components/common/ExpertCard';
import { User } from '@/types/user';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Loading from '@/components/common/Loading';
import userApi from '@/lib/api/user';

const ExpertsSection = () => {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await userApi.getInstructors();
        if (response?.success && response.instructors) {
          setInstructors(response.instructors.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  if (loading) {
    return <Loading title="Our Experts" />;
  }

  if (instructors.length === 0) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-medium mb-6">Our Experts</h2>
          <div className="text-center text-gray-500">No experts available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <AnimatedSection variants={fadeIn}>
          <h2 className="text-2xl font-bold mb-8">Our Experts</h2>
        </AnimatedSection>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {instructors.map((instructor) => (
            <motion.div
              key={instructor._id}
              variants={fadeIn}
            >
              <ExpertCard
                name={instructor.name}
                profession={instructor.profession ?? ''}
                description={instructor.introduce ?? ''}
                imageUrl={instructor.avatar?.url ?? '/assets/images/default-avatar.png'}
                socialLinks={instructor.socialLinks}
                profileUrl={`/experts/${instructor._id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertsSection;