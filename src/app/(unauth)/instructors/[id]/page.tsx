import React from 'react';
import InstructorDetailClient from '@/components/learner/instructor-detail/InstructorDetailClient';

interface PageProps {
  params: { id: string };
}

export default async function InstructorDetailPage({ params }: PageProps) {
  const { id } = params;
  return <InstructorDetailClient id={id} />;
}
