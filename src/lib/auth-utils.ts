import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function checkAdminAuth(request: NextRequest) {
  try {
    console.log('Auth check - Starting...');
    
    // Check NextAuth session
    const session = await getToken({ req: request });
    
    console.log('Auth check - Session:', session);
    console.log('Auth check - Cookies:', request.headers.get('cookie'));
    
    if (!session) {
      console.log('Auth check - No session found');
      return { 
        isAuthenticated: false, 
        isAdmin: false, 
        message: 'Please login to access this' 
      };
    }

    // Check if user has admin role
    // You might need to adjust this based on your session structure
    const userRole = (session as any)?.role || (session as any)?.user?.role;
    
    console.log('Auth check - User role:', userRole);
    
    if (userRole !== 'admin') {
      console.log('Auth check - Not admin role');
      return { 
        isAuthenticated: true, 
        isAdmin: false, 
        message: 'Admin access required' 
      };
    }

    console.log('Auth check - Admin authenticated successfully');
    return { 
      isAuthenticated: true, 
      isAdmin: true, 
      user: session 
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return { 
      isAuthenticated: false, 
      isAdmin: false, 
      message: 'Authentication error' 
    };
  }
} 