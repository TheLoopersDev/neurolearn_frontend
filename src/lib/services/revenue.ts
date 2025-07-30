// import { getSession } from 'next-auth/react'; // Remove unused import

export async function getMyIncome(): Promise<number> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/income/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
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