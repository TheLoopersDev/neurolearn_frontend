import CourseDetailsCard from './_components/CourseDetailsCard';
import LearnerList from './_components/LearnerList';
import { cookies } from 'next/headers';

export default async function CourseDetailPage({ params }: any) {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  const { mycoursesId } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URI}/business/courses/${mycoursesId}/detail`,
    {
      credentials: 'include',
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch course detail: ${res.statusText}`);
  }

  const { course, learners } = await res.json();

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-8">
        <CourseDetailsCard course={course} learners={learners} />
        <LearnerList learners={learners} />
      </div>
    </div>
  );
}
