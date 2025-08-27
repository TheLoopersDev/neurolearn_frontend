import { NextRequest, NextResponse } from 'next/server';

// Mock data for development - replace with real database queries
const mockSubmissions = [
  {
    userId: '1',
    userName: 'Nguyễn Văn A',
    userEmail: 'nguyenvana@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    total: 5000000,
    submission: 500000,
    netIncome: 4500000,
    withdrawn: 2000000,
    available: 2500000,
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    userId: '2',
    userName: 'Trần Thị B',
    userEmail: 'tranthib@example.com',
    total: 3000000,
    submission: 300000,
    netIncome: 2700000,
    withdrawn: 1000000,
    available: 1700000,
    updatedAt: '2024-01-14T15:45:00Z'
  },
  {
    userId: '3',
    userName: 'Lê Văn C',
    userEmail: 'levanc@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    total: 8000000,
    submission: 800000,
    netIncome: 7200000,
    withdrawn: 3000000,
    available: 4200000,
    updatedAt: '2024-01-13T09:20:00Z'
  },
  {
    userId: '4',
    userName: 'Phạm Thị D',
    userEmail: 'phamthid@example.com',
    total: 2000000,
    submission: 200000,
    netIncome: 1800000,
    withdrawn: 500000,
    available: 1300000,
    updatedAt: '2024-01-12T14:15:00Z'
  },
  {
    userId: '5',
    userName: 'Hoàng Văn E',
    userEmail: 'hoangvane@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    total: 12000000,
    submission: 1200000,
    netIncome: 10800000,
    withdrawn: 4000000,
    available: 6800000,
    updatedAt: '2024-01-11T11:30:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth check for testing
    // TODO: Re-enable authentication check after fixing auth issues
    /*
    const authResult = await checkAdminAuth(request);
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 403 }
      );
    }
    */
    
    const { searchParams } = new URL(request.url);
    const top = parseInt(searchParams.get('top') || '5');

    // Get top submissions by submission amount
    const topSubmissions = mockSubmissions
      .sort((a, b) => b.submission - a.submission)
      .slice(0, top)
      .map((submission, index) => ({
        ...submission,
        rank: index + 1
      }));

    return NextResponse.json({
      success: true,
      data: {
        topSubmissions: topSubmissions,
        summary: {
          topEarners: topSubmissions.length,
          totalInstructors: mockSubmissions.length,
          activeInstructors: mockSubmissions.filter(s => s.total > 0).length
        }
      }
    });

  } catch (error) {
    console.error('Error in submissions-summary API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 