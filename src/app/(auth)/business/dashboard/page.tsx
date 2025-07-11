import HeaderBanner from './_components/HeaderBanner';
import StatCard from './_components/StatCard';
import LearningProgressChart from './_components/LearningProgressChart';
import CourseStatus from './_components/CourseStatus';
import MyCoursesTable from './_components/MyCoursesTable';
import Image from 'next/image';
import Book from '@/public/assets/business/book.svg'; // Adjust the path as necessary
import Award from '@/public/assets/business/award.svg'; // Adjust the path as necessary
import Clock from '@/public/assets/business/clock.svg'; // Adjust the path as necessary
import Teacher from '@/public/assets/business/teacher.svg'; // Adjust the path as necessary

const statData = [
  {
    title: 'Total Courses',
    value: '10',
    icon: <Image src={Book} alt="book" className="h-9 w-9 text-primary" />,
  },
  {
    title: 'Total Learners',
    value: '10',
    icon: <Image src={Teacher} alt="Teacher" className="h-9 w-9 text-primary" />,
  },
  {
    title: 'Ongoing Courses',
    value: '10',
    icon: <Image src={Award} alt="Award" className="h-9 w-9 text-primary" />,
  },
  {
    title: 'Completed Courses',
    value: '10',
    icon: <Image src={Clock} alt="Clock" className="h-9 w-9 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-secondary ">
      <div className="mx-auto max-w-7xl space-y-6">
        <HeaderBanner />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statData.map(stat => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LearningProgressChart />
          </div>
          <div>
            <CourseStatus />
          </div>
        </div>

        <MyCoursesTable />
      </div>
    </div>
  );
}
