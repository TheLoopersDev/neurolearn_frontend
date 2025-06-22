import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Helper functions for localStorage
const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        try {
            const token = localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('auth_user');
            let user = '';

            // Try to parse user object if it exists
            if (userStr) {
                try {
                    const parsedUser = JSON.parse(userStr);
                    user = parsedUser;
                } catch {
                    // If parsing fails, treat as string
                    user = userStr;
                }
            }

            return {
                token: token ?? '',
                user: user,
                isLoggingOut: false
            };
        } catch (error) {
            console.error('Error loading auth from localStorage:', error);
        }
    }
    return {
        token: '',
        user: '',
        isLoggingOut: false
    };
};

const saveToLocalStorage = (token: string, user: any) => {
    if (typeof window !== 'undefined') {
        try {
            if (token) {
                localStorage.setItem('auth_token', token);
            } else {
                localStorage.removeItem('auth_token');
            }

            if (user) {
                // Save user as JSON string if it's an object
                const userStr = typeof user === 'object' ? JSON.stringify(user) : user;
                localStorage.setItem('auth_user', userStr);
            } else {
                localStorage.removeItem('auth_user');
            }
        } catch (error) {
            console.error('Error saving auth to localStorage:', error);
        }
    }
};

const initialState = loadFromLocalStorage();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userRegistration: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
            saveToLocalStorage(action.payload.token, state.user);
        },
        userLoggerIn: (state, action: PayloadAction<{ accessToken: string; user: any }>) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
            state.isLoggingOut = false;
            saveToLocalStorage(action.payload.accessToken, action.payload.user);
        },
        userLoggerOut: (state) => {
            state.token = '';
            state.user = '';
            state.isLoggingOut = true;
            saveToLocalStorage('', '');
        },
        userResetToken: (state, action: PayloadAction<{ resetToken: string }>) => {
            state.token = action.payload.resetToken;
            saveToLocalStorage(action.payload.resetToken, state.user);
        }
    }
});

export const { userRegistration, userLoggerIn, userLoggerOut, userResetToken } = authSlice.actions;

export default authSlice.reducer;
