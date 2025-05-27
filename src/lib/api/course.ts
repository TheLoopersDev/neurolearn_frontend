import { Course } from '@/types/course';
import api from '../api';

export interface ApiResponse<T> {
  success: boolean;
  data?: {
    courses?: T[];
    topCourses?: T[];
  };
  courses?: T[];
}

const courseApi = {
  getAll: async (): Promise<ApiResponse<Course>> => {
    const response = await api.get<ApiResponse<Course>>('/courses');
    return response.data;
  },

  getTopCourses: async (): Promise<ApiResponse<Course>> => {
    const response = await api.get<ApiResponse<Course>>('/courses/top-courses');
    return response.data;
  },
};

export default courseApi; 