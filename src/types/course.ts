interface IReviewReply {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface IReview {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  commentReplies: IReviewReply[];
  createdAt: string;
  updatedAt: string;
}

interface ILink {
  title: string;
  url: string;
}

interface IComment {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  question: string;
  questionReplies: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
    };
    answer: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface ICourseData {
  order: number;
  title: string;
  description: string;
  videoUrl: {
    public_id: string;
    url: string;
  };
  videoPlayer: string;
  videoSection: string;
  videoLength: number;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
  quizzes: string[]; // Array of Quiz IDs
  isCompleted: boolean;
  isPublished: boolean;
  isPublishedSection: boolean;
  isFree: boolean;
  sectionOrder: number;
  lessonOrder: number;
}

export interface Course {
  _id: string;
  name: string;
  subTitle?: string;
  description?: string;
  authorId: {
    _id: string;
    name: string;
    email: string;
    avatar?: {
      public_id: string;
      url: string;
    };
    profession: string;
  };
  price?: number;
  estimatedPrice?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags?: string;
  level: string; // Level ID
  demoUrl?: {
    public_id: string;
    url: string;
  };
  benefits: Array<{ title: string }>;
  prerequisites: Array<{ title: string }>;
  reviews: IReview[];
  courseData: ICourseData[];
  rating: number;
  purchased: number;
  isPublished: boolean;
  isFree: boolean;
  category: string; // Category ID
  subCategory?: string; // SubCategory ID
  createdAt: string;
  updatedAt: string;
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
  name: string;
  subTitle?: string;
  description?: string;
  price?: number;
  estimatedPrice?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags?: string;
  level: string;
  demoUrl?: {
    public_id: string;
    url: string;
  };
  benefits: Array<{ title: string }>;
  prerequisites: Array<{ title: string }>;
  category: string;
  subCategory?: string;
}
