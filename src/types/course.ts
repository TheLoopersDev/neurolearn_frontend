export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  topics: string[];
  rating?: number;
  totalStudents?: number;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface TeacherCourseCardProps {
  course: Course;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface StudentCourseCardProps {
  course: Course;
  onEnroll?: (id: string) => void;
}

export interface CourseFormData {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  topics: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}
