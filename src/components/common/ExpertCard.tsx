"use client";

import Image from 'next/image';
import Link from 'next/link';

interface ExpertCardProps {
  name: string;
  role: string;
  imageUrl: string;
  profileUrl?: string;
}

const ExpertCard = ({ name, role, imageUrl, profileUrl = '#' }: ExpertCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
      <div className="mb-4 relative w-24 h-24 mx-auto rounded-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="font-medium text-sm mb-1">{name}</h3>
      <p className="text-xs text-gray-500 mb-3">{role}</p>
      <div className="flex justify-center gap-2 mb-4">
        <Link href="#" className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
          <Image src="/assets/home/Facebook.svg" alt="Facebook" width={12} height={12} />
        </Link>
        <Link href="#" className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
          <Image src="/assets/home/Linkedin.svg" alt="LinkedIn" width={12} height={12} />
        </Link>
        <Link href="#" className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
          <Image src="/assets/home/Mail.svg" alt="Mail" width={12} height={12} />
        </Link>
      </div>
      <Link 
        href={profileUrl} 
        className="text-blue-600 text-xs flex items-center justify-center"
      >
        <span>View Profile</span>
        <Image src="/assets/home/Arrow.svg" alt="Arrow" width={16} height={16} className="ml-1" />
      </Link>
    </div>
  );
};

export default ExpertCard;