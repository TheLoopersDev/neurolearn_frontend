import CourseDropdown from '@/components/learner/dashboard/CourseDropDown';
import ReceiptTable from '@/components/learner/dashboard/ReceiptTable';
import SearchBar from '@/components/learner/dashboard/SearchBar';
import React from 'react';

export default function Page() {
    return (
      <div className="flex h-screen w-full">
        <div className="w-full overflow-y-auto">
          <div className="flex items-center gap-10 w-full">
            <SearchBar />
            <CourseDropdown />
          </div>
          <div className="mt-10 w-full">
            <ReceiptTable/>
          </div>
        </div>
      </div>
    );
}
