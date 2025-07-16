// app/mycourses/[mycoursesId]/page.tsx

import CourseDetailsCard from './_components/CourseDetailsCard';
import LearnerList from './_components/LearnerList';
import { Course } from '@/types/course';
import { ILearner } from '@/types/leaner';

// --- DỮ LIỆU GIẢ LẬP CHO TRANG CHI TIẾT ---
// Khi tích hợp API, bạn sẽ thay thế toàn bộ khối này bằng các lệnh gọi API,
// ví dụ: const course = await api.getCourseById(params.mycoursesId);
//         const learners = await api.getLearnersByCourseId(params.mycoursesId);
const mockCourseDetail: Course = {
  _id: '1',
  name: 'USER INTERFACE DESIGN COURSE (APP/ WEBSITE)',
  subTitle:
    'Quickly Master Adobe Photoshop: Beginner to Advanced Graphic Design, Photo Editing, and more.',
  thumbnail: { url: '/assets/images/banner.png' },
  purchased: 13,
  sections: Array(10),
  author: {
    _id: 'author1',
    name: 'Le Xuan Huy',
    email: 'lexuanhuy@example.com',
    profession: 'Designer',
  },
  rating: 4.5,
  reviews: [],
  benefits: [],
  prerequisites: [],
  price: 100,
  isPublished: true,
  isFree: false,
  createdAt: '2025-01-04T00:00:00.000Z',
  updatedAt: '2025-01-04T00:00:00.000Z',
};

const mockLearnersData: ILearner[] = [
  {
    _id: 'user1',
    name: 'Dao Tuan Kiet',
    email: 'kietdtqe170088@gmail.com',
    role: 'user',
    avatar: { url: 'https://i.pravatar.cc/150?u=user1' },
    status: 'Learning',
    lastOpenedContent: 'Downloading Photoshop and resources',
    enrollmentDate: '05 Jan, 2025',
    progress: 50,
    quizResults: [
      {
        quizId: 'q1',
        quizName: 'Quiz 1',
        status: 'passed',
        totalAssignment: 20,
        maxAssignment: 20,
        totalScore: 90,
        maxScore: 100,
      },
      {
        quizId: 'q4',
        quizName: 'Quiz 4',
        status: 'failed',
        totalAssignment: 8,
        maxAssignment: 20,
        totalScore: 40,
        maxScore: 100,
      },
      // ... more quiz results
    ],
  },
  {
    _id: 'user2',
    name: 'Le Xuan Huy',
    email: 'huyxlqe170088@gmail.com',
    role: 'user',
    avatar: { url: 'https://i.pravatar.cc/150?u=user2' },
    status: '2 hours ago',
    lastOpenedContent: 'Basic Of Photoshop & Illustration',
    enrollmentDate: '05 Jan, 2025',
    progress: 35,
    quizResults: [
      {
        quizId: 'q1',
        quizName: 'Quiz 1',
        status: 'passed',
        totalAssignment: 15,
        maxAssignment: 20,
        totalScore: 75,
        maxScore: 100,
      },
      // ... more quiz results
    ],
  },
];
// --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---

export default function CourseDetailPage({ params }: { params: { mycoursesId: string } }) {
  // Hiện tại, component sử dụng trực tiếp dữ liệu giả lập
  // params.mycoursesId chưa được dùng, nhưng sẽ cần thiết khi tích hợp API
  const course = mockCourseDetail;
  const learners = mockLearnersData;
  console.log(params);

  // Dữ liệu phụ
  const learnersCompleted = 5;
  const totalLearners = 10;
  const courseProgress = 80;

  return (
    <div className=" min-h-screen">
      <div className="flex flex-col gap-8">
        <CourseDetailsCard
          course={course}
          learnersCompleted={learnersCompleted}
          totalLearners={totalLearners}
          progress={courseProgress}
        />
        <LearnerList learners={learners} />
      </div>
    </div>
  );
}
