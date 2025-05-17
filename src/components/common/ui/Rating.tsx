'use client';

import Image from 'next/image';

export default function Rating() {
  return (
    <div className="w-[395px] h-[91px]  bg-white rounded-2xl shadow-md p-4 max-w-full mx-auto">
      <div className="flex items-center justify-between h-full">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-4">
          <Image
            src="/assets/images/happy-face.png"
            alt="Avatar"
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <div>
            <div className="text-black font-bold text-xl">Rating</div>
            <div className="text-black text-sm">2,492 Students</div>
          </div>
        </div>

        {/* Right: Stars + Rating */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1">
            <Image src="/assets/icons/star.svg" alt="Star Icon" width={24} height={24} />
            <Image src="/assets/icons/star.svg" alt="Star Icon" width={24} height={24} />
            <Image src="/assets/icons/star.svg" alt="Star Icon" width={24} height={24} />
            <Image src="/assets/icons/star.svg" alt="Star Icon" width={24} height={24} />
            <Image src="/assets/icons/un-star.svg" alt="Star Icon" width={24} height={24} />
          </div>
          <div className="text-black text-sm mt-1">4.8 (880 rating)</div>
        </div>
      </div>
    </div>
  );
}
