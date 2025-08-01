import HeaderBanner from './_components/HeaderBanner';
import StatCard from './_components/StatCard';
import LearningProgressChart from './_components/LearningProgressChart';
import Image from 'next/image';
import Book from '@/public/assets/business/book.svg';
import Award from '@/public/assets/business/award.svg';
import Teacher from '@/public/assets/business/teacher.svg';
import { cookies } from 'next/headers';

export default async function DashboardPage({ params } : any) {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  const { businessId } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URI}/business/${businessId}/statistics`,
    {
      credentials: 'include',
      headers: { Cookie: cookie },
      cache: 'no-store',
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch statistics: ${res.statusText}`);

  const { totalEmployees, totalManagers, totalCourses, employeeMonthlyData, managerMonthlyData } = await res.json();

  const statData = [
    {
      title: 'Total Employees',
      value: String(totalEmployees ?? 0),
      icon: <Image src={Book} alt="book" className="h-9 w-9 text-primary" />,
    },
    {
      title: 'Total Managers',
      value: String(totalManagers ?? 0),
      icon: <Image src={Teacher} alt="Teacher" className="h-9 w-9 text-primary" />,
    },
    {
      title: 'Total Courses',
      value: String(totalCourses ?? 0),
      icon: <Image src={Award} alt="Award" className="h-9 w-9 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary ">
      <div className="mx-auto max-w-7xl space-y-6">
        <HeaderBanner />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statData.map(stat => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
          ))}
        </div>

        <div className="grid grid-cols-1">
          <div className="lg:col-span-3">
            <LearningProgressChart employeeMonthlyData={employeeMonthlyData} managerMonthlyData={managerMonthlyData} />
          </div>
        </div>
      </div>
    </div>
  );
}
