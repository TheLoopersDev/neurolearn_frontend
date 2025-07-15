import Image from 'next/image';
import { UserRoundPlus } from 'lucide-react';
import { Course } from '@/types/course';
import ImageCourse from '@/public/assets/images/banner.png';

// Giả sử bạn có một mảng người dùng được gán
const assignedUsers = [
  { id: 'a', avatarUrl: 'https://i.pravatar.cc/150?u=a' },
  { id: 'b', avatarUrl: 'https://i.pravatar.cc/150?u=b' },
  { id: 'c', avatarUrl: 'https://i.pravatar.cc/150?u=c' },
];

interface CourseDetailsCardProps {
  course: Course;
  learnersCompleted: number;
  totalLearners: number;
  progress: number;
}

const CourseDetailsCard: React.FC<CourseDetailsCardProps> = ({
  course,
  learnersCompleted,
  totalLearners,
  progress,
}) => {
  const purchaseDate = new Date(course.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white p-6 rounded-2xl flex flex-col lg:flex-row gap-6">
      {/* Phần image chính và thông tin khóa học giữ nguyên */}
      <Image
        // src={course.thumbnail.url || ImageCourse} // Sử dụng ảnh mặc định nếu không có
        src={ImageCourse} // Sử dụng ảnh mặc định nếu không có
        alt={course.name}
        width={400}
        height={213}
        className="rounded-2xl  w-full lg:w-[400px]"
      />
      <div className="flex-1 flex flex-col justify-between gap-5">
        <div>
          <h1 className="text-2xl font-semibold text-black">{course.name}</h1>
          <p className="text-gray-500 mt-1" title={course.subTitle}>
            {course.subTitle && course.subTitle.length > 50
              ? `${course.subTitle.slice(0, 50)}...`
              : course.subTitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-4 text-sm">
          {/* Các thông tin khác giữ nguyên */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Purchase Date</span>
            <span className="font-medium text-black">{purchaseDate}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Total Courses</span>
            <span className="font-medium text-black">{course.sections.length}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Learners Completed</span>
            <span className="font-medium text-black">{`${learnersCompleted}/${totalLearners}`}</span>
          </div>

          {/* Cải thiện phần Assigned */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Assigned</span>
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {assignedUsers.map(user => (
                  <Image
                    key={user.id}
                    src={user.avatarUrl}
                    width={28}
                    height={28}
                    alt={`user ${user.id}`}
                    className="rounded-full border-2 border-white"
                  />
                ))}
              </div>
              {course.purchased > 3 && (
                <span className="font-medium text-black ml-2">+{course.purchased - 3}</span>
              )}
            </div>
          </div>
        </div>

        {/* Phần progress bar giữ nguyên */}
        <div className="flex items-end justify-between gap-4">
          <div className="w-full">
            <span className="font-medium text-black">Completed Course:</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-[#3858F8] h-3 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-[#3858F8] font-medium text-xl">{progress}%</span>
            </div>
          </div>
          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <UserRoundPlus className="w-6 h-6 text-[#3858F8]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
