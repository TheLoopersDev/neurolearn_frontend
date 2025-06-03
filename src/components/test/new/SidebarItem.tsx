// src/components/SidebarItem.tsx
import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <div
      className={`self-stretch h-14 px-6 py-4 rounded-lg flex flex-col justify-start items-start gap-2.5 cursor-pointer
                  ${isActive ? 'bg-[#F7F8FA]' : ''}`}
      onClick={onClick}
    >
      <div className="justify-start items-center gap-2 inline-flex">
        {icon}
        <div
          className={`${isActive ? 'text-[#3858F8]' : 'text-[#0D0D0D]'} text-base font-medium font-['Inter'] leading-tight`}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
