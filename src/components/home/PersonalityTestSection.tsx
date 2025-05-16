"use client";

import Button from '@/components/common/Button';

interface PersonalityTestSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

const PersonalityTestSection = ({
  title = 'Test your personality and interests',
  description = 'Explore your strengths, preferences, and discover your growth path with this quick personality quiz.',
  buttonText = 'Explore Now',
  buttonUrl = '/personality-test'
}: PersonalityTestSectionProps) => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="bg-gray-100 rounded-xl p-8">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-700 mb-6 max-w-lg">{description}</p>
          
          <div className="mb-4 relative">
            <div className="flex justify-between items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
            </div>
            <div className="h-0.5 bg-gray-200 absolute top-1.5 left-0 right-0 -z-10"></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mb-8">
            <span>REALISTIC</span>
            <span>CONVENTIONAL</span>
            <span>INVESTIGATIVE</span>
            <span>ENTERPRISING</span>
            <span>ARTISTIC</span>
            <span>SOCIAL</span>
          </div>
          
          <div className="flex">
            <Button href={buttonUrl} variant="primary" className="text-sm">
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalityTestSection;