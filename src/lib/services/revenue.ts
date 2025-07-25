import { getSession } from 'next-auth/react';

export async function getMyIncome(token: string): Promise<number> {
  const res = await fetch('/api/revenue/income/me', {
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
  return data.income;
} 