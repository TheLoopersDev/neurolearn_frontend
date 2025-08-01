'use client';

import { Fragment, useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  invitees?: any[];
}

export default function InviteModal({ isOpen, onClose, course }: InviteModalProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'import'>('email');
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [inviteesData, setInviteesData] = useState<any[]>([]);
  const [filteredInvitees, setFilteredInvitees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth);

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

  useEffect(() => {
    const fetchInvitees = async () => {
      if (!isOpen || !course?._id) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/business/courses/${course._id}/unassigned-employees`,
          { withCredentials: true }
        );
        const raw = res.data.employees;

        const formatted: any[] = raw.map((emp: any) => ({
          id: emp.user._id,
          name: emp.user.name,
          email: emp.user.email,
          avatarUrl: emp.user.avatar?.url || '/assets/images/default-avatar.png',
        }));

        setInviteesData(formatted);
        setFilteredInvitees(formatted);
      } catch (error) {
        console.error('Failed to fetch invitees:', error);
      }
    };

    fetchInvitees();
  }, [isOpen, course]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredInvitees(inviteesData);
      return;
    }

    const lowerInput = inputValue.toLowerCase();
    const filtered = inviteesData.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lowerInput) ||
        emp.email.toLowerCase().includes(lowerInput)
    );

    setFilteredInvitees(filtered);
  }, [inputValue, inviteesData]);

  const handleInvite = (employee: any) => {
    setSelectedEmployee(employee);
    setStartDate('');
    setDueDate('');
    setIsDateModalOpen(true);
  };

  const confirmInvite = async () => {
    if (!selectedEmployee || !startDate || !dueDate) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/business/${user?.businessInfo?.businessId}/employees/${selectedEmployee.id}/assign-course`,
        {
          courseId: course._id,
          startDate,
          dueDate,
        },
        { withCredentials: true }
      );

      toast({
        title: 'Success',
        description: 'Assigned successfully!',
        variant: 'success',
      });
      setIsDateModalOpen(false);
      onClose();
    } catch (error) {
      console.error('Error inviting:', error);
      toast({
        title: 'Error',
        description: 'Assigning failed. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
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
              <div className="flex justify-between items-center border-b mb-6">
                <Dialog.Title className="text-xl font-bold text-black">
                  Assign Courses
                </Dialog.Title>
                <div className="flex space-x-6">
                  <button
                    className={`pb-2 ${activeTab === 'email' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('email')}
                  >
                    Assign via Email
                  </button>
                </div>
              </div>

              {activeTab === 'email' ? (
                <>
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
                              <Image src="/assets/icons/close.svg" alt="Remove" width={12} height={12} />
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
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="relative w-40 h-24 flex-shrink-0">
                      <Image
                        src={course?.thumbnail?.url}
                        alt={course.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-black">{course.name}</h4>
                      <h6 className="text-sm text-gray-600">
                        {course.description?.split(' ').slice(0, 10).join(' ') + (course.description?.split(' ').length > 10 ? '...' : '')}
                      </h6>
                    </div>
                  </div>

                  <ul className="mt-4 max-h-48 overflow-y-auto divide-y">
                    {filteredInvitees?.map(inv => (
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
                        <button
                          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition whitespace-nowrap"
                          onClick={() => handleInvite(inv)}
                        >
                          Invite
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="space-y-4">
                  <label className="block">
                      <span className="text-sm font-medium text-gray-700">Upload XLSX file</span>
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
                      onClick={() => { }}
                  >
                    Import
                  </button>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>

        <Transition appear show={isDateModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsDateModalOpen(false)}>
            <div className="fixed inset-0 bg-black/40" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-xl p-6 max-w-sm w-full">
                <Dialog.Title className="text-lg font-semibold text-black mb-4">
                  Set Start and Due Dates
                </Dialog.Title>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-black">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full border px-3 py-2 rounded mt-1 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-black">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="w-full border px-3 py-2 rounded mt-1 text-black"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={confirmInvite}
                      className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </Dialog>
    </Transition>
  );
}
