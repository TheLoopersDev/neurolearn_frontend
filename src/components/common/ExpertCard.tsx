"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { hoverScale } from '@/utils/animations';
import { SocialLinks } from '@/types/user';

interface ExpertCardProps {
  name: string;
  profession: string;
  description: string;
  imageUrl: string;
  socialLinks?: SocialLinks;
  profileUrl?: string;
}

const ExpertCard = ({ name, profession, description, imageUrl, socialLinks, profileUrl = '#' }: ExpertCardProps) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-6 h-[240px] w-full overflow-hidden"
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Profile Image */}
      <motion.div 
        className="flex-shrink-0 relative w-16 h-16 rounded-full overflow-hidden"
        whileHover={{ scale: 1.05 }}
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full overflow-hidden">
        {/* Name and Title */}
        <div className="flex-shrink-0">
          <h3 className="font-semibold text-lg text-blue-600 mb-1 truncate">{name}</h3>
          <p className="font-medium text-gray-900 text-sm truncate">{profession}</p>
        </div>

        {/* Description */}
        <div className="flex-1 py-3 overflow-hidden">
          <p className="text-gray-600 text-sm leading-relaxed h-full overflow-hidden" 
             style={{ 
               display: '-webkit-box',
               WebkitLineClamp: 3,
               WebkitBoxOrient: 'vertical'
             }}>
            {description}
          </p>
        </div>

        {/* Social Links and Arrow */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <motion.div whileHover={hoverScale}>
              <Link 
                href={socialLinks?.facebook || "#"} 
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Facebook profile"
              >
                <Image src="/assets/home/Facebook.svg" alt="Facebook" width={16} height={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={hoverScale}>
              <Link 
                href={socialLinks?.linkedin || "#"} 
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="LinkedIn profile"
              >
                <Image src="/assets/home/Linkedin.svg" alt="LinkedIn" width={16} height={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={hoverScale}>
              <Link 
                href={socialLinks?.email ? `mailto:${socialLinks.email}` : "#"} 
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Email contact"
              >
                <Image src="/assets/home/Mail.svg" alt="Mail" width={16} height={16} />
              </Link>
            </motion.div>
          </div>

          {/* View Profile Arrow */}
          <motion.div 
            whileHover={{ x: 5 }} 
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link 
              href={profileUrl} 
              className="text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="View full profile"
            >
              <Image src="/assets/home/Arrow.svg" alt="View profile" width={20} height={20} />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertCard;