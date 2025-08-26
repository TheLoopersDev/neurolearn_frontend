import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // Check NextAuth session
    const session = await getToken({ req: request });
    
    console.log('Debug Auth - Session:', session);
    
    return NextResponse.json({
      success: true,
      session: session,
      hasSession: !!session,
      userRole: (session as any)?.role || (session as any)?.user?.role,
      headers: Object.fromEntries(request.headers.entries()),
      cookies: request.headers.get('cookie'),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug Auth Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 