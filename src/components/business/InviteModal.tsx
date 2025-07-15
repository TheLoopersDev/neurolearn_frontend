'use client';

import { Fragment, useState, ChangeEvent, KeyboardEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';

export interface Course {
  _id: string;
  name: string;
  thumbnailUrl: string;
  category: string;
  purchaseDate: string;
  totalCourses: number;
}

export type InviteStatus = 'Received' | 'Invited' | 'Cancelled';

export interface Invitee {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  status: InviteStatus;
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  invitees: Invitee[];
}

export default function InviteModal({
  isOpen,
  onClose,
  course,
  invitees,
}: InviteModalProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'import'>('email');
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      setEmails(prev => [...prev, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveEmail = (idx: number) => {
    setEmails(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const statusClasses: Record<InviteStatus, string> = {
    Received: 'text-green-600 font-medium',
    Invited:  'text-blue-600 font-medium',
    Cancelled:'text-orange-500 font-medium',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}         
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-30"
          leave="ease-in duration-150"
          leaveFrom="opacity-30"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-2xl w-full max-w-lg p-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b mb-6">
                <Dialog.Title className="text-xl font-bold text-black">
                  Invite Courses
                </Dialog.Title>
                <div className="flex space-x-6">
                  <button
                    className={`pb-2 ${
                      activeTab === 'email'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('email')}
                  >
                    Invite via Email
                  </button>
                  <button
                    className={`pb-2 ${
                      activeTab === 'import'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('import')}
                  >
                    Import XLSX
                  </button>
                </div>
              </div>
              {/* Tab Content */}
              {activeTab === 'email' ? (
                <>
                  {/* Invite via Email */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 border rounded-full px-4 py-2 flex flex-wrap gap-2">
                        {emails.map((e, i) => (
                          <div
                            key={i}
                            className="flex items-center bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full"
                          >
                            <span>{e}</span>
                            <button onClick={() => handleRemoveEmail(i)}>
                              <Image
                                src="/assets/icons/close.svg"
                                alt="Remove"
                                width={12}
                                height={12}
                              />
                            </button>
                          </div>
                        ))}
                        <input
                          className="flex-1 min-w-[120px] focus:outline-none text-sm py-1 text-black"
                          placeholder="Enter email and press Enter"
                          value={inputValue}
                          onChange={e => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                      <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition whitespace-nowrap"
                        onClick={() => {
                          /* TODO: gọi API invite */
                        }}
                      >
                        Invite
                      </button>
                    </div>
                  </div>
                  {/* Course summary */}
                  <div className="mt-6 bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="relative w-20 h-12 flex-shrink-0">
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <Image src="/assets/icons/tag.svg" alt="Tag" width={14} height={14}/>
                        <span>{course.category}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-black">
                        {course.name}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar size={14}/>
                          <span>{course.purchaseDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14}/>
                          <span>{course.totalCourses} Courses</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invitees list */}
                  <ul className="mt-4 max-h-48 overflow-y-auto divide-y">
                    {invitees.map(inv => (
                      <li key={inv.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image
                            src={inv.avatarUrl}
                            alt={inv.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-medium text-sm text-black">{inv.name}</p>
                            <p className="text-xs text-gray-500">{inv.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={statusClasses[inv.status]}>
                            {inv.status}
                          </span>
                          <button className="p-1">
                            <Image
                              src="/assets/icons/more.svg"
                              alt="More"
                              width={16}
                              height={16}
                            />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                /* Import XLSX */
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Upload XLSX file
                    </span>
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      className="mt-2"
                    />
                  </label>
                  {fileName && (
                    <p className="text-sm text-gray-600">Selected: {fileName}</p>
                  )}
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                    onClick={() => {
                      /* TODO: xử lý import */
                    }}
                  >
                    Import
                  </button>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
