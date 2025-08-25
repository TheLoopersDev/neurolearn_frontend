export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role: 'user' | 'admin' | 'instructor' | 'business';
  avatar?: {
    public_id?: string;
    url?: string | null;
  };
  isVerified?: boolean;
  purchasedCourses?: string[];
  uploadedCourses?: string[];
  introduce?: string;
  profession?: string;
  phoneNumber?: string;
  address?: string;
  age?: number | null;
  rating?: number | null;
  student?: number | null;
  socialLinks?: SocialLinks;
  businessInfo?: {
    businessId?: string | null;
    role?: 'admin' | 'manager' | 'employee' | null;
  };
  createdAt?: string;
  updatedAt?: string;
}
