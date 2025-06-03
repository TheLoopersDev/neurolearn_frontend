// src/components/ProfileDropdown.tsx
import React from 'react';
// import { ChevronDownIcon } from './icons';

interface ProfileDropdownProps {
  userName: string;
  avatarUrl: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userName, avatarUrl }) => {
  return (
    <div className="w-[198px] h-14 px-[9px] py-[7px] bg-white rounded-[120px] flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="justify-start items-center gap-1 inline-flex">
        <img
          className="w-10 h-10 bg-[#B8DFF2] rounded-[292px]"
          src={avatarUrl}
          alt={`${userName} avatar`}
        />
        <div className="text-center text-black text-base font-medium font-['Inter'] leading-tight">
          {userName}
        </div>
        {/* <ChevronDownIcon /> Removed bg-black from here, it's in the icon def */}
      </div>
    </div>
  );
};
