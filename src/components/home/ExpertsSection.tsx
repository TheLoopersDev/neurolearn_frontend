'use client';

import ExpertCard from '@/components/common/ExpertCard';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Loading from '@/components/common/Loading';
import { useGetAllExpertsQuery } from '@/lib/redux/features/expert/expertApi';
import { useRouter } from 'next/navigation';

const ExpertsSection = () => {
  const { data: experts, isLoading, error } = useGetAllExpertsQuery();
  console.log('experts', experts);
  const displayExperts = experts ? experts.slice(0, 3) : [];
  const router = useRouter();

  if (isLoading) {
    return <Loading title="Our Experts" />;
  }

  if (error) {
    console.error('Error fetching experts:', error);
    return (
      <section className="py-6 sm:py-8 md:py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4 sm:mb-6 text-black">Our Experts</h2>
          <div className="text-center text-gray-500 text-sm sm:text-base">Error loading experts</div>
        </div>
      </section>
    );
  }

  if (displayExperts.length === 0) {
    return (
      <section className="py-6 sm:py-8 md:py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4 sm:mb-6 text-black">Our Experts</h2>
          <div className="text-center text-gray-500 text-sm sm:text-base">No experts available</div>
        </div>
      </section>
    );
  }

  // ... các import khác và const displayExperts

  return (
    <section className="py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="container mx-auto">
        {/* Header section with title and view more */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <AnimatedSection variants={fadeIn}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 text-center sm:text-left">Our Experts</h2>
          </AnimatedSection>
          {/* Thêm nút "View More" với logic điều kiện */}
          {/* Giả định bạn có một biến `allExperts` chứa tất cả các chuyên gia */}
          <div
            className="text-blue-900 cursor-pointer hover:underline flex items-center justify-center sm:justify-start text-sm sm:text-base font-medium"
            onClick={() => router.push('/instructors')} // Điều hướng đến trang danh sách chuyên gia
          >
            <span className="mr-2">View More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {displayExperts.map(expert => (
            <motion.div key={expert._id} variants={fadeIn}>
              <ExpertCard
                name={expert.name}
                profession={expert.profession ?? ''}
                description={expert.introduce ?? ''}
                imageUrl={expert.avatar?.url ?? '/assets/images/default-avatar.png'}
                socialLinks={expert.socialLinks}
                profileUrl={`/instructors/${expert._id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertsSection;
