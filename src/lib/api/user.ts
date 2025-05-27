import { User } from '@/types/user';
import api from '../api';

export interface ApiResponse<T> {
  success: boolean;
  instructors?: T[];
}

const userApi = {
  getInstructors: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/users/get-instructors');
    return response.data;
  },
};

export default userApi; 