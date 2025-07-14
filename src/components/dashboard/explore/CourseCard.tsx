'use client';

import Image from 'next/image';
import React, { useState } from "react";
import PaymentModal from "./PaymentModal"; // Đường dẫn đúng tới file modal

export default function CourseCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-[395px] shadow-md bg-white rounded-2xl max-w-full mx-auto">
      <div className="flex justify-between items-start">
        {/* LEFT: Phần giá */}
        <div className="bg-white rounded-t-2xl pl-4 pt-4">

          <div className="w-[200px] h-[50px] space-y-2">
            <p className="text-xl text-black">Full course</p>
            <div className="text-xl text-gray-400 line-through">800.000 VNĐ</div>
          </div>
        </div>
        {/* RIGHT: Tag giảm giá */}
        <div className="w-[145px] h-[75px] bg-[#F7F8FA] flex items-center justify-center  rounded-bl-2xl">
          <span className="bg-[#3858F8] text-white text-base font-medium rounded-full w-[86px] h-[30px] flex items-center justify-center">
            50% OFF
          </span>
        </div>
      </div>
      {/* Course includes */}
      <div className='text-black pb-4'>
      <div className="text-sm space-y-4 px-4 ">
        <div className="text-4xl text-[#3858F8] mt-2">400.000 VNĐ</div>
        <div className='text-black text-2xl'>Course includes</div>
        <div className="flex items-center gap-3">
          <Image src="/assets/icons/play.svg" alt="Play" width={20} height={20} />
          61 hours on-demand video
        </div>
        <div className="flex items-center gap-3">
          <Image src="/assets/icons/article.svg" alt="Article" width={20} height={20} />6 Articles
        </div>
        <div className="flex items-center gap-3">
          <Image src="/assets/icons/download-file.svg" alt="Download" width={20} height={20} />8
          Downloadable resources
        </div>
        <div className="flex items-center gap-3">
          <Image src="/assets/icons/document.svg" alt="Document" width={20} height={20} />
          Practice test
        </div>
        <div className="flex items-center gap-3">
          <Image src="/assets/icons/upload-file.svg" alt="Upload" width={20} height={20} />
          Practical sharing article
        </div>
        <div className="flex items-center gap-3">
          <Image src="/assets/icons/completion.svg" alt="Certificate" width={20} height={20} />
          Certificate of Completion
        </div>
      </div>
      </div>
      {/* Buttons */}
      <div className="flex items-center gap-2 px-4 h-[60px]">
  <button className="flex-1 h-14 bg-[#3858F8] text-white text-xl rounded-lg hover:bg-blue-700 transition">
    Add to cart
  </button>
  <Image
    src="/assets/icons/bookmark.svg"
    alt="Bookmark"
    className="bg-[#ECECEC] h-14 w-14 rounded-md p-2"
    width={30}
    height={30}
  />
</div>

<button
  className="w-[calc(100%-32px)] h-14 mx-4 my-4 text-center text-xl text-[#3858F8] font-bold rounded-lg bg-[#ECECEC] hover:bg-gray-200 transition"
  onClick={() => setOpen(true)}
>
  Buy now
</button>
<PaymentModal open={open} onClose={() => setOpen(false)} />

    </div>
  );
}