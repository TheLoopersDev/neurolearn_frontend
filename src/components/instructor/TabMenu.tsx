'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import CourseContent from './CourseContent';
import ChatAI from './ChatAI';
import QnA from './QnA';
import NotificationPanel from './NotificationPanel';
import EvaluatePanel from './EvaluatePanel';

const tabs = [
  { id: 'chat', label: 'Chat.AI', icon: '/assets/icons/chat.svg' },
  { id: 'qa', label: 'Q&A', icon: '/assets/icons/qa.svg' },
  { id: 'notification', label: 'Notification', icon: '/assets/icons/notification.svg' },
  { id: 'evaluate', label: 'Evaluate', icon: '/assets/icons/black-star.svg' },
];

export default function TabMenu() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab menu */}
      <div className="flex items-center gap-2 bg-[#F7F8FA] rounded-t-xl text-sm font-medium text-[#0D0D0D]">
        {tabs.map((tab, index) => (
          <div key={tab.id} className="flex items-center">
            <button
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl transition-all',
                activeTab === tab.id ? 'bg-white shadow text-black' : 'text-[#6B6B6B]'
              )}
            >
              <Image src={tab.icon} alt={`${tab.label} Icon`} width={18} height={18} />
              <span>{tab.label}</span>
            </button>
            {index < tabs.length - 1 && <div className="px-2 text-[#D9D9D9]">|</div>}
          </div>
        ))}
      </div>

      {/* Tab content area */}
      <div className="mt-4 h-[524px] overflow-y-auto pr-2">
        {activeTab === 'chat' && <ChatAI />}
        {activeTab === 'qa' && <QnA />}
        {activeTab === 'notification' && <NotificationPanel />}
        {activeTab === 'evaluate' && <EvaluatePanel />}
        {activeTab !== 'lesson' && activeTab !== 'chat' && activeTab !== 'qa' && activeTab !== 'notification' && activeTab !== 'evaluate' &&(
          <div className="p-4 bg-white rounded-b-xl shadow text-[#6B6B6B]">
            Content for <strong>{tabs.find(tab => tab.id === activeTab)?.label}</strong> coming
            soon.
          </div>
        )}
      </div>
    </div>
  );
}
