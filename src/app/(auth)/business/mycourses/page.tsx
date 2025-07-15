// app/mycourses/page.tsx

import Link from 'next/link';
import Image from 'next/image';

// --- DỮ LIỆU GIẢ LẬP CHO TRANG DANH SÁCH ---
// Khi tích hợp API, bạn sẽ thay thế toàn bộ khối này bằng một lệnh gọi API,
// ví dụ: const courses = await api.getAllCourses();
const mockCoursesData = [
  {
    _id: '1',
    name: 'USER INTERFACE DESIGN COURSE (APP/ WEBSITE)',
    subTitle: 'Master Adobe Photoshop and Figma for modern UI/UX design.',
    thumbnailUrl: '/assets/images/banner.png',
  },
  {
    _id: '2',
    name: 'DATA SCIENCE AND MACHINE LEARNING BOOTCAMP',
    subTitle: 'Learn Python, Pandas, and Scikit-learn from scratch.',
    thumbnailUrl: '/assets/images/banner.png',
  },
  {
    _id: '3',
    name: 'THE ULTIMATE REACT DEVELOPMENT COURSE',
    subTitle: 'Build amazing front-end applications with React and Next.js.',
    thumbnailUrl: '/assets/images/banner.png',
  },
];
// --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---

const MyCoursesListPage = () => {
  // Component sử dụng trực tiếp dữ liệu giả lập ở trên
  const courses = mockCoursesData;

  return (
    <div className="p-6 md:p-10 bg-[#F7F8FA] min-h-screen">
      <h1 className="text-4xl font-bold text-black mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <Link
            key={course._id}
            href={`/business/mycourses/${course._id}`}
            className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="relative w-full h-48">
              <Image
                src={course.thumbnailUrl}
                alt={course.name}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-black truncate group-hover:text-[#3858F8]">
                {course.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2 h-10 overflow-hidden">{course.subTitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyCoursesListPage;
