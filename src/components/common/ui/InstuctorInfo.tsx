'use client';

import Image from 'next/image';

export default function InstructorInfo() {
  return (
    <div className="max-w-full mx-auto rounded-2xl">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-black mb-6 leading-snug">
        Graphic Design Master – Learn GREAT Design
      </h1>

      {/* Profile and Stats Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Profile Info */}
        <div className="flex items-center gap-4 flex-1 min-w-[250px]">
          <Image
            src="/assets/images/avatar.png"
            alt="Avatar"
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <div>
            <div className="text-black font-semibold text-lg">Đao Tuan Kiet</div>
            <div className="text-gray-600 text-sm">Instructional Expert</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-black">
            <Image src="/assets/icons/heart.svg" alt="Heart Icon" width={20} height={20} />
            <span>300 Likes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-black">
            <Image src="/assets/icons/upload-file.svg" alt="Share Icon" width={20} height={20} />
            <span>Share</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
      <div className="text-gray-700 text-base leading-relaxed space-y-4 mb-6">
        <p>
          We also learn the basics of Adobe Photoshop, Illustrator and InDesign and do projects with
          real world applications. Every designer needs to know and master these programs and this
          course makes sure you know the essential tools to power through amazing projects.
        </p>
        <p>
          In Adobe Photoshop, we will review photo editing and manipulation techniques like how to
          cut objects out, duotones, changing color on objects, the liquify tool and we will create
          a compelling YouTube thumbnail.
        </p>
        <a href="#" className="inline-block text-blue-600 font-medium hover:underline">
          View all &gt;
        </a>
      </div>
    </div>
  );
}
