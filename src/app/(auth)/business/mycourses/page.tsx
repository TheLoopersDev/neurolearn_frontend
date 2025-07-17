
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="p-6 md:p-10 bg-[#F7F8FA] min-h-screen">
      <h1 className="text-4xl font-bold text-black mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {business?.courses?.map((course: any) => (
          <Link
            key={course?.course._id}
            href={`/business/mycourses/${course?.course._id}`}
            className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="relative w-full h-48">
              <Image
                src={course?.course?.thumbnail?.url}
                alt={course?.course?.name}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-black truncate group-hover:text-[#3858F8]">
                {course?.course?.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2 h-10 overflow-hidden">{course?.course?.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

