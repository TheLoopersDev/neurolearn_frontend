"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { hoverScale } from '@/utils/animations';

interface ExpertCardProps {
  name: string;
  role: string;
  imageUrl: string;
  profileUrl?: string;
}

const ExpertCard = ({ name, role, imageUrl, profileUrl = '#' }: ExpertCardProps) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center"
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="mb-4 relative w-24 h-24 mx-auto rounded-full overflow-hidden"
        whileHover={{ scale: 1.05 }}
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </motion.div>
      <h3 className="font-medium text-sm mb-1">{name}</h3>
      <p className="text-xs text-gray-500 mb-3">{role}</p>
      <div className="flex justify-center gap-2 mb-4">
        <motion.div whileHover={hoverScale}>
          <Link href="#" className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <Image src="/assets/home/Facebook.svg" alt="Facebook" width={12} height={12} />
          </Link>
        </motion.div>
        <motion.div whileHover={hoverScale}>
          <Link href="#" className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <Image src="/assets/home/Linkedin.svg" alt="LinkedIn" width={12} height={12} />
          </Link>
        </motion.div>
        <motion.div whileHover={hoverScale}>
          <Link href="#" className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <Image src="/assets/home/Mail.svg" alt="Mail" width={12} height={12} />
          </Link>
        </motion.div>
      </div>
      <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
        <Link 
          href={profileUrl} 
          className="text-blue-600 text-xs flex items-center justify-center"
        >
          <span>View Profile</span>
          <Image src="/assets/home/Arrow.svg" alt="Arrow" width={16} height={16} className="ml-1" />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default ExpertCard;