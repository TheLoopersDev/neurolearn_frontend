import ReceiptTable from '@/components/dashboard/ReceiptTable';
import SearchBar from '@/components/dashboard/SearchBar';
import React from 'react';

export default function Page() {
  return (
    <div className="flex h-screen w-full rounded-2xl">
      <div className="w-full overflow-y-auto ">
        <div className="flex items-center gap-10 w-full">
          <SearchBar />
        </div>
        <div className="mt-10 w-full">
          <ReceiptTable userType='user' />
        </div>
      </div>
    </div>
  );
}
