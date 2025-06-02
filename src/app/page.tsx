import Image from 'next/image';
import Link from 'next/link';

// Sample course data
const courses = [
  {
    id: '1',
    title: 'Thiết kế đồ họa',
    description: 'Học thiết kế đồ họa từ cơ bản đến nâng cao với các công cụ hiện đại.',
    imageUrl: '/placeholder-course.jpg',
    price: 49.99,
    teacherId: 't1',
    teacherName: 'Tiến sĩ Đỗ Hòa',
    rating: 4.8,
    totalStudents: 1200,
    level: 'Beginner',
    category: 'Design',
    topics: ['Photoshop', 'Illustrator'],
    createdAt: '2023-01-01',
    updatedAt: '2023-06-01',
  },
  {
    id: '2',
    title: 'Thiết kế đồ họa',
    description: 'Học thiết kế đồ họa từ cơ bản đến nâng cao với các công cụ hiện đại.',
    imageUrl: '/placeholder-course.jpg',
    price: 49.99,
    teacherId: 't1',
    teacherName: 'Tiến sĩ Đỗ Hòa',
    rating: 4.7,
    totalStudents: 980,
    level: 'Intermediate',
    category: 'Design',
    topics: ['Photoshop', 'Illustrator'],
    createdAt: '2023-01-01',
    updatedAt: '2023-06-01',
  },
  {
    id: '3',
    title: 'Thiết kế đồ họa',
    description: 'Học thiết kế đồ họa từ cơ bản đến nâng cao với các công cụ hiện đại.',
    imageUrl: '/placeholder-course.jpg',
    price: 49.99,
    teacherId: 't1',
    teacherName: 'Tiến sĩ Đỗ Hòa',
    rating: 4.5,
    totalStudents: 850,
    level: 'Advanced',
    category: 'Design',
    topics: ['Photoshop', 'Illustrator'],
    createdAt: '2023-01-01',
    updatedAt: '2023-06-01',
  },
  {
    id: '4',
    title: 'Thiết kế đồ họa',
    description: 'Học thiết kế đồ họa từ cơ bản đến nâng cao với các công cụ hiện đại.',
    imageUrl: '/placeholder-course.jpg',
    price: 49.99,
    teacherId: 't1',
    teacherName: 'Tiến sĩ Đỗ Hòa',
    rating: 4.6,
    totalStudents: 1050,
    level: 'Beginner',
    category: 'Design',
    topics: ['Photoshop', 'Illustrator'],
    createdAt: '2023-01-01',
    updatedAt: '2023-06-01',
  },
];

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  teacherId: string;
  teacherName: string;
  rating: number;
  totalStudents: number;
  level: string;
  category: string;
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

// Component for course card grid
const CourseGrid = ({ title, courses }: { title: string; courses: Course[] }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-semibold mb-6">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses.map((course: Course) => (
        <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-40">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-600 mt-1">bởi {course.teacherName}</p>
            <div className="flex items-center mt-2">
              <div className="flex items-center mr-2">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm">{course.rating?.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-500">{course.totalStudents} học viên</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-lg">${course.price.toFixed(2)}</span>
              <Link
                href={`/courses/${course.id}`}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Chi tiết
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">Udemy</Link>
            <nav className="hidden md:flex ml-8">
              <Link href="/courses" className="mx-2 text-sm text-gray-700 hover:text-blue-600">Khóa học</Link>
              <Link href="/categories" className="mx-2 text-sm text-gray-700 hover:text-blue-600">Danh mục</Link>
              <Link href="/teachers" className="mx-2 text-sm text-gray-700 hover:text-blue-600">Giảng viên</Link>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className="bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Link href="/login" className="mr-2 text-sm text-gray-700 hover:text-blue-600">Đăng nhập</Link>
            <Link 
              href="/signup" 
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              All The Skills You Need In One Place
            </h1>
            <p className="text-gray-700 mb-6">
              From coding skills to business topics. 
              Udemy helps expand your professional development.
            </p>
            <Link 
              href="/courses" 
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Khám phá
            </Link>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <div className="relative h-64 md:h-80">
              <Image
                src="/placeholder-course.jpg"
                alt="Students learning"
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute top-0 right-0 bg-blue-600 text-white p-2 rounded-bl-lg">
                800+ Khóa học
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto pb-4 gap-4">
            {['Tất cả', 'IT Certifications', 'Leadership', 'Web Development', 'Communication', 'Business Analytics & Intelligence'].map((category) => (
              <button
                key={category}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Course Listings */}
      <main className="container mx-auto px-4 py-8">
        <CourseGrid title="Khóa học phổ biến" courses={courses} />
        
        {/* Why Study Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Why do you study on EDUIO?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                01
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </h3>
              <p className="text-gray-700">Learn from Top Industry Experts</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                02
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </h3>
              <p className="text-gray-700">Reasonable Cost, Exceptional Value</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                03
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </h3>
              <p className="text-gray-700">Flexible Learning, Anytime, Anywhere</p>
            </div>
          </div>
        </section>
        
        <CourseGrid title="Learners are viewing" courses={courses} />
        
        {/* Learning Focused */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Learning focused on your goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2 flex items-center">
                Hands-on training
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2 flex items-center">
                Certification prep
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2 flex items-center">
                Containerization
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </h3>
            </div>
          </div>
        </section>
        
        {/* Our Experts */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Our Experts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="mb-4 relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                  <Image
                    src="/placeholder-course.jpg"
                    alt="Expert"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1">Tuyết Trinh</h3>
                <p className="text-sm text-gray-600 mb-3">Academic Director</p>
                <div className="flex justify-center gap-3 mb-3">
                  <span className="w-6 h-6 bg-gray-200 rounded-full"></span>
                  <span className="w-6 h-6 bg-gray-200 rounded-full"></span>
                  <span className="w-6 h-6 bg-gray-200 rounded-full"></span>
                </div>
                <Link 
                  href="#" 
                  className="text-blue-500 flex items-center justify-center"
                >
                  <span>View Profile</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>
        
        {/* Future of Work */}
        <section className="bg-blue-50 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Top Trends For The Future Of Work</h2>
          <p className="text-gray-700 mb-6">Get the skills needed to stay current in today&apos;s rapidly changing workplace.</p>
          <Link 
            href="/trends" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-block"
          >
            Get Started
          </Link>
        </section>
        
        {/* Personality Test */}
        <section className="mb-16">
          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Test your personality and interests</h2>
            <p className="text-gray-700 mb-6">Explore your strengths, preferences, and discover your growth path with this quick personality quiz.</p>
            <div className="flex justify-between items-center mb-4">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-8">
              <span>REALISTIC</span>
              <span>CONVENTIONAL</span>
              <span>INVESTIGATIVE</span>
              <span>ENTERPRISING</span>
              <span>ARTISTIC</span>
              <span>SOCIAL</span>
            </div>
            <Link 
              href="/personality-test" 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-block"
            >
              Explore Now
            </Link>
          </div>
        </section>
        
        {/* Video Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-blue-600 mb-8">Top Trends For The Future Of Work</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden relative h-96">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">We would love to hear from you.</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Contact us
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm border-t pt-8">
            <div>
              <h4 className="font-semibold mb-3">Contact us</h4>
              <p className="text-gray-600 mb-1">info@eduio.com</p>
              <p className="text-gray-600 mb-1">+84 123 456 789</p>
              <p className="text-gray-600">123 Education St, Hanoi, Vietnam</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Follow us</h4>
              <div className="flex gap-3">
                <span className="w-8 h-8 bg-gray-200 rounded-full"></span>
                <span className="w-8 h-8 bg-gray-200 rounded-full"></span>
                <span className="w-8 h-8 bg-gray-200 rounded-full"></span>
                <span className="w-8 h-8 bg-gray-200 rounded-full"></span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Services</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Online Courses</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Live Webinars</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Certification</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Career Guidance</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-sm text-gray-500 text-center">
            &copy; 2023 EDUIO. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
