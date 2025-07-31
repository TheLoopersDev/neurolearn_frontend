// src/lib/redux/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';

// Helper functions for localStorage
const loadFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');
      let user: User | null = null;

      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          user = parsedUser;
        } catch {
          console.error('Error parsing user from localStorage. Clearing user data.');
          localStorage.removeItem('auth_user');
          user = null;
        }
      }

      return {
        token: token ?? null,
        user: user,
        isLoggingOut: false,
      };
    } catch (error) {
      console.error('Error loading auth from localStorage:', error);
    }
  }
  return {
    token: null,
    user: null,
    isLoggingOut: false,
  };
};

const saveToLocalStorage = (token: string | null, user: User | null) => {
  if (typeof window !== 'undefined') {
    try {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }

      if (user) {
        localStorage.setItem('auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('auth_user');
      }
    } catch (error) {
      console.error('Error saving auth to localStorage:', error);
    }
  }
};

const initialState: { token: string | null; user: User | null; isLoggingOut: boolean } =
  loadFromLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<User>) => {
      // <<-- Giữ nguyên action này -->>
      state.user = action.payload;
      saveToLocalStorage(state.token, state.user);
    },
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      saveToLocalStorage(action.payload.token, state.user);
    },
    userLoggerIn: (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isLoggingOut = false;
      saveToLocalStorage(action.payload.accessToken, action.payload.user);
    },
    userLoggerOut: state => {
      state.token = null;
      state.user = null;
      state.isLoggingOut = true;
      saveToLocalStorage(null, null);
    },
    userResetToken: (state, action: PayloadAction<{ resetToken: string }>) => {
      state.token = action.payload.resetToken;
      saveToLocalStorage(action.payload.resetToken, state.user);
    },
  },
});

export const { userRegistration, userLoggerIn, userLoggerOut, userResetToken, setUserInfo } =
  authSlice.actions;

export default authSlice.reducer;
