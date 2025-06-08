'use client';

import Image from 'next/image';

export default function CourseDetail() {
    return (
        <div className="text-3xl font-bold text-black max-w-full mx-auto bg-[#F7F8FA]">
            <div className="flex justify-between gap-8 w-full">
                <div className="flex-1 text-base h-[120px] bg-[#FFFFFF] text-[#6B6B6B] rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex flex-row items-center justify-between w-full">
                        <Image src="/assets/icons/blue-book.svg" alt="Play Icon" width={50} height={50} />
                        <span className='text-4xl font-bold text-[#3858F8]'>10</span>
                    </div>
                    <div className="flex justify-end">
                        <span className="text-base text-[#6B6B6B]">Total Courses</span>
                    </div>
                </div>
                <div className="flex-1 text-base h-[120px] bg-[#FFFFFF] text-[#6B6B6B] rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex flex-row items-center justify-between w-full">
                        <Image src="/assets/icons/hourglass.svg" alt="Clock Icon" width={35} height={35} />
                        <span className='text-4xl font-bold text-[#3858F8]'>10</span>
                    </div>
                    <div className="flex justify-end">
                        <span className="text-base text-[#6B6B6B]">Pending Courses</span>
                    </div>
                </div>
                <div className="flex-1 text-base h-[120px] bg-[#FFFFFF] text-[#6B6B6B] rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex flex-row items-center justify-between w-full">
                        <Image src="/assets/icons/sold.svg" alt="Sort Icon" width={50} height={50} />
                        <span className='text-4xl font-bold text-[#3858F8]'>10</span>
                    </div>
                    <div className="flex justify-end">
                        <span className="text-base text-[#6B6B6B]">Courses Sold</span>
                    </div>
                </div>
                <div className="flex-1 text-base h-[120px] bg-[#FFFFFF] text-[#6B6B6B] rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex flex-row items-center justify-between w-full">
                        <Image src="/assets/icons/blue-completion.svg" alt="Eye Icon" width={50} height={50} />
                        <span className='text-4xl font-bold text-[#3858F8]'>10</span>
                    </div>
                    <div className="flex justify-end">
                        <span className="text-base text-[#6B6B6B]">Completed</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
