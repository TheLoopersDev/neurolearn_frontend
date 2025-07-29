// import { getSession } from 'next-auth/react'; // Remove unused import
import { decodeJWT } from '@/lib/utils';

export async function getMyIncome(token: string): Promise<number> {
  // Decode userId from JWT token in localStorage
  let userId = '';
  try {
    const payload = decodeJWT(token);
    userId = payload.userId || payload.id || payload._id || '';
  } catch (e) {
    throw new Error('Invalid token: cannot decode userId');
  }
  if (!userId) throw new Error('No userId found in token');

  const res = await fetch(`/income/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch income');
  }
  const data = await res.json();
  // Return totalIncome from the response
  return data?.incomeData?.totalIncome ?? 0;
} 