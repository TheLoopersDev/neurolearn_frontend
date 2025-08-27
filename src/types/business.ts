import { User } from './user';
import { Course } from './course';
export interface BusinessEmployee {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  user?: User;
}

export interface BusinessCourse {
  _id: string;
  name?: string;
  thumbnail?: {
    url: string;
  };
  price?: number;
  isPublished?: boolean;
  course?: Course;
}

export interface BusinessCreator {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
  user?: User;
}

export interface Business {
  _id: string;
  businessName: string;
  description: string;
  email: string;
  address: string;
  businessSector: string;
  isVerified: boolean;
  createdBy?: BusinessCreator;
  employees?: BusinessEmployee[];
  courses?: BusinessCourse[];
  createdAt: string;
  logo?: string;
}

export interface BusinessResponse {
  success: boolean;
  data: Business[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBusinesses: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}
