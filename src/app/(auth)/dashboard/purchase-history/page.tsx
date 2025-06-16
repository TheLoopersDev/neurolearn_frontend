import CourseDropdown from '@/components/learner/dashboard/CourseDropDown';
import ReceiptTable from '@/components/learner/dashboard/ReceiptTable';
import SearchBar from '@/components/learner/dashboard/SearchBar';
import React from 'react';

export default function Page() {
    return (
        <div className="flex h-screen bg-[#F7F8FA]">
            {/* Sidebar chiếm 1/6 */}
            {/* Nội dung chiếm 5/6 */}
            <div className="w-5/6 p-6 overflow-y-auto mt-25">
                <div className="flex items-center gap-10">
                    <SearchBar />
                    <CourseDropdown />
                </div>
                <div className='mt-10'>
                    <ReceiptTable/>
                </div>
            </div>
        </div>
    );
}
