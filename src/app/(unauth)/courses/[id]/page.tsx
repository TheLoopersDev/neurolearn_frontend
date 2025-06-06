// // 'use client'

// // import { useGetCourseByIdQuery } from '@/lib/redux/features/course/courseApi';
// // import Image from 'next/image';
// // import { useParams } from 'next/navigation';

// // export default function CourseDetailsPage() {
// //   const { id } = useParams();
// //   const { data: course, isLoading: loading, error } = useGetCourseByIdQuery(id as string);

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen">
// //         <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
// //       </div>
// //     );
// //   }

// //   if (error || !course) {
// //     return (
// //       <div className="min-h-screen flex justify-center items-center">
// //         <div className="text-center">
// //           <h1 className="text-2xl font-bold text-red-500">{error || 'Course not found'}</h1>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //         <div className="md:col-span-2">
// //           <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
// //           <div className="flex items-center space-x-2 mb-4">
// //             <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
// //               {course.category}
// //             </span>
// //             {course.level && (
// //               <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
// //                 {course.level}
// //               </span>
// //             )}
// //           </div>

// //           <div className="relative h-64 md:h-80 w-full mb-6 rounded-lg overflow-hidden">
// //             <Image
// //               src={course.imageUrl || '/placeholder-course.jpg'}
// //               alt={course.title}
// //               fill
// //               className="object-cover"
// //             />
// //           </div>

// //           <div className="mb-8">
// //             <h2 className="text-xl font-semibold mb-2">Description</h2>
// //             <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
// //           </div>

// //           <div className="mb-8">
// //             <h2 className="text-xl font-semibold mb-2">Topics</h2>
// //             <ul className="list-disc list-inside">
// //               {course.topics.map((topic, index) => (
// //                 <li key={`topic-${topic}-${index}`} className="mb-1 text-gray-700">
// //                   {topic}
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         </div>

// //         <div className="md:col-span-1">
// //           <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
// //             <div className="text-center mb-4">
// //               <span className="text-3xl font-bold">${course.price.toFixed(2)}</span>
// //             </div>

// //             <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 mb-4">
// //               Enroll Now
// //             </button>

// //             <div className="border-t border-gray-200 pt-4 mt-4">
// //               <div className="flex justify-between mb-2">
// //                 <span className="text-gray-600">Instructor:</span>
// //                 <span className="font-medium">{course.teacherName}</span>
// //               </div>
// //               {course.duration && (
// //                 <div className="flex justify-between mb-2">
// //                   <span className="text-gray-600">Duration:</span>
// //                   <span className="font-medium">{course.duration}</span>
// //                 </div>
// //               )}
// //               {course.totalStudents && (
// //                 <div className="flex justify-between mb-2">
// //                   <span className="text-gray-600">Students:</span>
// //                   <span className="font-medium">{course.totalStudents}</span>
// //                 </div>
// //               )}
// //               {course.rating && (
// //                 <div className="flex justify-between mb-2">
// //                   <span className="text-gray-600">Rating:</span>
// //                   <span className="font-medium flex items-center">
// //                     <span className="text-yellow-500 mr-1">★</span>
// //                     {course.rating.toFixed(1)}
// //                   </span>
// //                 </div>
// //               )}
// //               <div className="flex justify-between mb-2">
// //                 <span className="text-gray-600">Last Updated:</span>
// //                 <span className="font-medium">
// //                   {new Date(course.updatedAt).toLocaleDateString()}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// import { useGetCourseByIdQuery } from '@/lib/redux/features/course/courseApi';
// import Image from 'next/image';
// import { useParams } from 'next/navigation';

// export default function CourseDetailsPage() {
//   const { id } = useParams();
//   const {
//     data: response,
//     isLoading: loading,
//     error
//   } = useGetCourseByIdQuery(id as string);

//   const course = response?.course;

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
//       </div>
//     );
//   }

//   if (error || !course) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-500">{error || 'Course not found'}</h1>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className="md:col-span-2">
//           <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
//           <div className="flex items-center space-x-2 mb-4">
//             <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
//               {course.category}
//             </span>
//             {course.level && (
//               <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
//                 {course.level}
//               </span>
//             )}
//           </div>

//           <div className="relative h-64 md:h-80 w-full mb-6 rounded-lg overflow-hidden">
//             <Image
//               src={course.thumbnail.url || '/placeholder-course.jpg'}
//               alt={course.name}
//               fill
//               className="object-cover"
//             />
//           </div>

//           <div className="mb-8">
//             <h2 className="text-xl font-semibold mb-2">Description</h2>
//             <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
//           </div>

//           <div className="mb-8">
//             <h2 className="text-xl font-semibold mb-2">Benefits</h2>
//             <ul className="list-disc list-inside">
//               {course.benefits?.map((item) => (
//                 <li key={item._id} className="mb-1 text-gray-700">
//                   {item.title}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="mb-8">
//             <h2 className="text-xl font-semibold mb-2">Prerequisites</h2>
//             <ul className="list-disc list-inside">
//               {course.prerequisites?.map((item) => (
//                 <li key={item._id} className="mb-1 text-gray-700">
//                   {item.title}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div className="md:col-span-1">
//           <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
//             <div className="text-center mb-4">
//               <span className="text-3xl font-bold">{course.price.toLocaleString()} VNĐ</span>
//             </div>

//             <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 mb-4">
//               Enroll Now
//             </button>

//             <div className="border-t border-gray-200 pt-4 mt-4">
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Instructor:</span>
//                 <span className="font-medium">{course.authorId.name}</span>
//               </div>
//               {course.courseData?.length > 0 && (
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-600">Lessons:</span>
//                   <span className="font-medium">{course.courseData.length}</span>
//                 </div>
//               )}
//               {course.purchased && (
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-600">Students:</span>
//                   <span className="font-medium">{course.purchased}</span>
//                 </div>
//               )}
//               {course.rating && (
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-600">Rating:</span>
//                   <span className="font-medium flex items-center">
//                     <span className="text-yellow-500 mr-1">★</span>
//                     {course.rating.toFixed(1)}
//                   </span>
//                 </div>
//               )}
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Last Updated:</span>
//                 <span className="font-medium">
//                   {new Date(course.updatedAt).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useGetCourseByIdQuery } from '@/lib/redux/features/course/courseApi';
import { useGetExpertByIdQuery } from '@/lib/redux/features/expert/expertApi';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import CourseContent from '@/components/common/ui/CourseContent';
import CourseDetail from '@/components/common/ui/CourseDetail';
import InstructorInfo from '@/components/common/ui/InstuctorInfo';
import OverView from '@/components/common/ui/OverView';
import PublisherCard from '@/components/common/ui/PublisherCard';
import Rating from '@/components/common/ui/Rating';
import Review from '@/components/common/ui/Review';
import SuggestedCourse from '@/components/common/ui/SuggestedCourse';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const {
    data: response,
    isLoading: loading,
    error
  } = useGetCourseByIdQuery(id as string);
  useGetExpertByIdQuery
  const course = response?.course;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">{error || 'Course not found'}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F7F8FA] px-4 sm:px-6 lg:px-20 py-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* LEFT: Nội dung chính khóa học */}
          <div className="w-full lg:w-[70%] space-y-10">
            {/* Banner */}
            <Image
              src={course.thumbnail.url || '/placeholder-course.jpg'}
              alt={course.name}
              width={1200}
              height={480}
              className="rounded-lg object-cover"
            />

            {/* Instructor Info */}
            <div className="flex items-start">
              <InstructorInfo courseName={course.name} instructor={course.authorId} />
            </div>

            {/* Course Detail */}
            <CourseDetail course={course} />

            {/* Course Content */}
            <CourseContent courseData={course.courseData} />

            {/* Student Reviews */}
            <Review reviews={course.reviews} />
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-full lg:w-[30%] space-y-6">
            <Rating rating={course.rating} />
            <PublisherCard author={course.authorId} updatedAt={course.updatedAt} />
            <OverView course={course} />
            <SuggestedCourse currentCourseId={course._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
