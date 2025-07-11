const courseData = [
  {
    name: 'Graphic Design Mastercla-Learn GREAT Design',
    learners: ['/avatar1.png', '/avatar2.png', '/avatar3.png'], // Placeholder image paths
    category: 'Design',
    enrollmentDate: '22 May, 2025',
    progress: 'Pending',
    logo: '/mietke-do-hoa.png', // Placeholder course logo
  },
  {
    name: 'Graphic Design Mastercla-Learn GREAT Design',
    learners: ['/avatar1.png', '/avatar2.png', '/avatar3.png'],
    category: 'Design',
    enrollmentDate: '22 May, 2025',
    progress: 'Learning',
    logo: '/mietke-do-hoa.png',
  },
];

const ProgressBadge = ({ status }: { status: string }) => {
  const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
  if (status === 'Pending') {
    return <span className={`${baseClasses} bg-orange-100 text-orange-600`}>{status}</span>;
  }
  if (status === 'Learning') {
    return <span className={`${baseClasses} bg-blue-100 text-primary`}>{status}</span>;
  }
  return <span className={`${baseClasses} bg-green-100 text-green-600`}>{status}</span>;
};

export default function MyCoursesTable() {
  return (
    <div className="rounded-xl bg-background p-6 shadow-sm">
      <h2 className="text-lg font-bold text-foreground">My Courses</h2>

      <div className="mt-4 flow-root">
        <div className="-mx-6 -my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-0">
                    Course Name
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Learner
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Enrollment date
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {courseData.map((course, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          {/* Bạn cần thay thế bằng ảnh thật */}
                          <img className="h-11 w-11 rounded-md" src={course.logo} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-foreground">{course.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center -space-x-2">
                        {course.learners.map((learner, i) => (
                          // Bạn cần thay thế bằng ảnh thật
                          <img
                            key={i}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                            src={learner}
                            alt="Learner"
                          />
                        ))}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600 ring-2 ring-white">
                          +10
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {course.category}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {course.enrollmentDate}
                    </td>
                    <td className="whitespace-nowrap relative py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-0">
                      <ProgressBadge status={course.progress} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
