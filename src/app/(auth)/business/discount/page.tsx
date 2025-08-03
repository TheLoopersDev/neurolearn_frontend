
import DiscountTable from '@/components/dashboard/DiscountTable';
import React from 'react';
import { cookies } from 'next/headers';

export default async function Page() {
    const cookieStore = await cookies();
      const cookie = cookieStore.toString();
    
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/discount/available`,
        {
          credentials: 'include',
          headers: { Cookie: cookie },
          cache: 'no-store',
        }
      );
    
      if (!res.ok) throw new Error(`Failed to fetch statistics: ${res.statusText}`);
    
    const { discounts } = await res.json();

    return (
        <div className="flex h-screen w-full rounded-2xl">
            <div className="w-full overflow-y-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Discount Management</h1>
                </div>

                {/* Discount Table */}
                <div className="w-full">
                    <DiscountTable discounts={discounts} />
                </div>
            </div>
        </div>
    );
} 