// src/components/Sidebar.tsx
import React from 'react';
import { SidebarItem } from './SidebarItem';
// import { DashboardIcon, CoursesIcon } from './icons';

// Placeholder icons for brevity
const CreateQuizIcon = () => (
  <div className="w-6 h-6 relative">
    <div className="w-[18px] h-[18.50px] outline outline-[1.50px] outline-[#0D0D0D] -outline-offset-[0.75px]"></div>
  </div>
);
const EarningIcon = () => (
  <div className="w-6 h-6 relative">
    <div className="w-[20px] h-[16.99px] left-[2px] top-[3.50px] absolute outline outline-[1.50px] outline-[#292D32] -outline-offset-[0.75px]"></div>
  </div>
);
const MessageIcon = () => (
  <div className="w-6 h-6 relative">
    <div className="w-[20px] h-[20.06px] left-[2px] top-[2px] absolute outline outline-[1.50px] outline-[#0D0D0D] -outline-offset-[0.75px]"></div>
  </div>
);
const SettingIcon = () => (
  <div className="w-6 h-6 relative">
    <div className="w-[20.01px] h-[18.88px] left-[2px] top-[2.56px] absolute outline outline-[1.50px] outline-[#0D0D0D] -outline-offset-[0.75px]"></div>
  </div>
);
const LeftArrowIcon = () => (
  <div className="w-[11.67px] h-[9.33px] outline outline-2 outline-[#0D0D0D] -outline-offset-[1px]"></div>
);

export const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = React.useState('Courses');

  return (
    <div className="w-[260px] h-full bg-white fixed top-0 left-0 z-10">
      <div className="w-[50px] h-[50px] left-[36px] top-[30px] absolute bg-[#867E7E]"></div>
      <div className="left-[97px] top-[37px] absolute text-black text-2xl font-semibold font-['Inter'] leading-7">
        Academix
      </div>

      <div className="w-[255px] h-0 left-0 top-[110px] absolute outline outline-2 outline-[#D9D9D9] -outline-offset-[1px]"></div>

      <div className="w-[28px] h-[28px] left-[232px] top-[96px] absolute bg-[#F7F8FA] overflow-hidden rounded-md flex justify-center items-center">
        <LeftArrowIcon />
      </div>

      <div className="w-[200px] left-[36px] top-[145px] absolute flex-col justify-start items-start gap-3 inline-flex">
        <SidebarItem
          icon={<CreateQuizIcon />}
          label="Dashboard"
          isActive={activeItem === 'Dashboard'}
          onClick={() => setActiveItem('Dashboard')}
        />
        <SidebarItem
          icon={<CreateQuizIcon />}
          label="Courses"
          isActive={activeItem === 'Courses'}
          onClick={() => setActiveItem('Courses')}
        />
        <SidebarItem
          icon={<CreateQuizIcon />}
          label="Create Quiz"
          isActive={activeItem === 'Create Quiz'}
          onClick={() => setActiveItem('Create Quiz')}
        />
        <SidebarItem
          icon={<EarningIcon />}
          label="Earning"
          isActive={activeItem === 'Earning'}
          onClick={() => setActiveItem('Earning')}
        />
        <SidebarItem
          icon={<MessageIcon />}
          label="Message"
          isActive={activeItem === 'Message'}
          onClick={() => setActiveItem('Message')}
        />
        <SidebarItem
          icon={<SettingIcon />}
          label="Setting"
          isActive={activeItem === 'Setting'}
          onClick={() => setActiveItem('Setting')}
        />
      </div>
    </div>
  );
};
