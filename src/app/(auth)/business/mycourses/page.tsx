
import CourseCard from "@/components/business/CourseCard";
import { cookies } from 'next/headers';


export default async function MyCoursesListPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URI}/business/me`,
    {
      credentials: 'include',
      headers: { Cookie: cookie },
      cache: 'no-store',
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch statistics: ${res.statusText}`);

  const { business } = await res.json();

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {business?.courses.map((course : any) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

    </div>
  );
}