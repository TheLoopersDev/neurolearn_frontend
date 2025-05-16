"use client";

import Image from 'next/image';

interface ReasonCardProps {
  number: string;
  title: string;
  description: string;
}

const ReasonCard = ({ number, title, description }: ReasonCardProps) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm relative">
    <div className="flex items-center mb-3">
      <h3 className="text-2xl font-bold text-gray-900">{number}</h3>
      <div className="ml-auto">
        <Image src="/assets/home/Arrow.svg" alt="Arrow" width={24} height={24} />
      </div>
    </div>
    <h4 className="font-medium mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const WhyStudySection = () => {
  const reasons = [
    { 
      number: '01', 
      title: 'Learn from Top Industry Experts', 
      description: 'Get access to high-quality content from industry professionals'
    },
    { 
      number: '02', 
      title: 'Reasonable Cost, Exceptional Value', 
      description: 'Affordable pricing with premium features and lifetime access'
    },
    { 
      number: '03', 
      title: 'Flexible Learning, Anytime, Anywhere', 
      description: 'Study at your own pace and according to your personal schedule'
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-medium mb-8">Why do you study on EDUIO?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <ReasonCard 
              key={reason.number} 
              number={reason.number}
              title={reason.title}
              description={reason.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyStudySection;