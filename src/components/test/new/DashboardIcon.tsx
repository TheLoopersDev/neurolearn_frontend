// src/components/icons/DashboardIcon.tsx
import React from 'react';

export const DashboardIcon: React.FC<{ colorClass?: string }> = ({
  colorClass = 'outline-[#0D0D0D]',
}) => (
  <div className="w-6 h-6 relative">
    <div
      className={`w-2 h-2 left-[2px] top-[2px] absolute outline outline-[1.5px] -outline-offset-[0.75px] ${colorClass}`}
    ></div>
    <div
      className={`w-2 h-2 left-[14px] top-[2px] absolute outline outline-[1.5px] -outline-offset-[0.75px] ${colorClass}`}
    ></div>
    <div
      className={`w-2 h-2 left-[14px] top-[14px] absolute outline outline-[1.5px] -outline-offset-[0.75px] ${colorClass}`}
    ></div>
    <div
      className={`w-2 h-2 left-[2px] top-[14px] absolute outline outline-[1.5px] -outline-offset-[0.75px] ${colorClass}`}
    ></div>
  </div>
);

export const CoursesIcon: React.FC<{ colorClass?: string }> = ({
  colorClass = 'outline-[#3858F8]',
}) => (
  <div className="w-6 h-6 relative">
    <div
      className={`w-[20px] h-[18.67px] left-[2px] top-[2.66px] absolute outline outline-[1.5px] -outline-offset-[0.75px] ${colorClass}`}
    ></div>
  </div>
);

export const TrashIcon: React.FC<{ colorClass?: string }> = ({ colorClass = 'bg-[#FF7410]' }) => (
  <div className="w-6 h-6 relative">
    <div
      className={`w-[19.50px] h-[2.02px] left-[2.25px] top-[4.71px] absolute ${colorClass}`}
    ></div>
    <div
      className={`w-[8.50px] h-[4.47px] left-[7.75px] top-[1.25px] absolute ${colorClass}`}
    ></div>
    <div
      className={`w-[15.20px] h-[14.36px] left-[4.40px] top-[8.39px] absolute ${colorClass}`}
    ></div>
  </div>
);

export const PlusIcon: React.FC<{ colorClass?: string }> = ({ colorClass = 'bg-[#3858F8]' }) => (
  <div className="w-6 h-6 relative">
    <div
      className={`w-[13.50px] h-[1.50px] left-[5.25px] top-[11.25px] absolute ${colorClass}`}
    ></div>
    <div
      className={`h-[13.50px] w-[1.50px] left-[11.25px] top-[5.25px] absolute ${colorClass}`}
    ></div>
  </div>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`w-6 h-6 relative ${className}`}>
    <div className="w-[15.50px] h-[8.50px] left-[4.25px] top-[7.75px] absolute bg-black"></div>
  </div>
);
