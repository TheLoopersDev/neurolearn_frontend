'use client';
import React, { useState, useEffect, useMemo } from 'react';
import InstructorInfoCard from '@/components/instructor-detail/InstructorInfoCard';
import InstructorAbout from '@/components/instructor-detail/InstructorAbout';
import InstructorStats from '@/components/instructor-detail/InstructorStats';
import InstructorTabs from '@/components/instructor-detail/InstructorTabs';
import CourseCard from '@/components/instructor-detail/CourseCard';
import ReviewList from '@/components/instructor-detail/ReviewList';
import { Course, IReview } from '@/types/course';
import { User } from '@/types/user';
import Link from 'next/link';
import { getUserById } from '@/lib/services/user';

const fetchCoursesByInstructorId = (instructorId: string): Course[] => {
  console.log(`Fetching courses for instructor ID: ${instructorId}`);
  // Mock author data for now
  const author = {
    _id: instructorId,
    name: 'Instructor',
    email: '',
    avatar: {
      public_id: '',
      url: '',
    },
    profession: '',
  };
  return Array.from({ length: 8 }, (_, i) => ({
    _id: `course_${i + 1}_${instructorId}`,
    name: 'USER INTERFACE DESIGN COURSE (APP/WEBSITE)',
    subTitle:
      'Quickly Master Adobe Photoshop: Beginner to Advanced Graphic Design, Photo Editing...',
    thumbnail: { url: '/assets/create-quiz/thumbnail.png' },
    authorId: instructorId,
    author,
    level: 'Beginner',
    rating: 4.5,
    reviews: [],
    price: 400000,
    estimatedPrice: 800000,
    category: 'Grapic Design',
    sections: [],
    benefits: [{ title: 'Learn UI/UX fundamentals' }],
    prerequisites: [{ title: 'Basic computer skills' }],
    purchased: 123 + i * 20,
    isPublished: true,
    isFree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const fetchReviewsByInstructorId = (instructorId: string): IReview[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    _id: `review_${i + 1}_${instructorId}`,
    user: {
      _id: `user${i}`,
      name: `Student ${i + 1}`,
      email: `student${i}@example.com`,
      role: 'user',
      avatar: {
        url: '/assets/images/default-avatar.png',
      },
    },
    rating: 4 + (i % 2),
    comment:
      "An extensive and thorough course on ChatGPT, AI and many other API's. I will use the course as a reference in the future as there is a ton of great information. An impressive work.",
    commentReplies: [],
    createdAt: new Date(Date.now() - (i + 1) * 1000 * 60 * 60 * 24 * ((i % 4) + 1) * 3),
    updatedAt: new Date().toISOString(),
  }));
};

const REVIEWS_PER_PAGE_PREVIEW = 8;

interface InstructorDetailPageClientProps {
  params: { id: string };
}

const InstructorDetailPageClient: React.FC<InstructorDetailPageClientProps> = ({ params }) => {
  const { id } = params;
  const [instructor, setInstructor] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allReviews, setAllReviews] = useState<IReview[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'reviews'>('courses');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      (async () => {
        try {
          const response = await getUserById(id);
          if (response && response.success && response.data && response.data.user) {
            setInstructor(response.data.user);
            const courseData = fetchCoursesByInstructorId(id);
            const reviewData = fetchReviewsByInstructorId(id);
            setCourses(courseData);
            setAllReviews(reviewData);
          } else {
            setInstructor(null);
          }
        } catch (error) {
          setInstructor(null);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id]);

  const reviewsForPreview = useMemo(
    () => allReviews.slice(0, REVIEWS_PER_PAGE_PREVIEW),
    [allReviews]
  );
  const shouldShowSeeAllReviews = allReviews.length > REVIEWS_PER_PAGE_PREVIEW;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center text-gray-500">
          <p className="text-lg">Loading Instructor Profile...</p>
          <p className="text-sm">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold">Instructor Not Found</h2>
          <p>The profile you are looking for does not exist or could not be loaded.</p>
          <Link href="/instructors" className="mt-4 inline-block text-blue-500 hover:underline">
            &larr; Back to instructors list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl pt-16 sm:pt-20 p-6 md:p-8 relative ">
            <InstructorInfoCard instructor={instructor} />
          </div>
          <InstructorAbout introductionText={instructor.introduce} />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <InstructorStats instructor={instructor} totalCourses={courses.length} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <InstructorTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showSeeAll={activeTab === 'reviews' && shouldShowSeeAllReviews}
          onSeeAllClick={() => alert('Navigate to all reviews page')}
        />
        <div className="mt-6">
          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
          {activeTab === 'reviews' && <ReviewList reviews={reviewsForPreview} />}
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailPageClient;
