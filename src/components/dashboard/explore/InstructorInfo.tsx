'use client';

import Image from 'next/image';

export default function InstructorInfo() {
  return (
    <div className="max-w-full mx-auto rounded-2xl">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-black mb-6">
        Graphic Design Master - Learn GREAT Design
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
            <div className="text-black font-bold text-xl">Đao Tuan Kiet</div>
            <div className="text-black text-sm">Instructional Expert</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Image src="/assets/icons/heart.svg" alt="Heart Icon" width={24} height={24} />
            <span className="text-black">300 Like</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/assets/icons/upload-file.svg" alt="Share Icon" width={24} height={24} />
            <span className="text-black">Share</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
      <div className="prose prose-lg text-gray-700 mb-6">
        <p className="mb-4">
          We also learn the basics of Adobe Photoshop, Illustrator and InDesign and do projects with
          real world applications. Every designer needs to know and master these programs and this
          course makes sure you know the essential tools to power through amazing projects.
        </p>
        <p>
          In Adobe Photoshop, we will review photo editing and manipulation techniques like how to
          cut objects out, duotones, changing color on objects, the liquify tool and we will create
          a compelling YouTube thumbnail with{' '}
        </p>
        <a href="#" className="text-blue-600 font-semibold hover:underline">
          View all &gt;
        </a>
      </div>
    </div>
  );
}