'use client';

import React, { useState } from 'react';
import EmployeeTable from './_components/EmployeeTable';
import { User } from './_components/EmployeeTableRow';
import AddEmployeeModal from './_components/AddEmployeeModal';

const initialEmployees: User[] = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    avatar: { url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    phoneNumber: '555-0101',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'manager',
    avatar: { url: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    phoneNumber: '555-0102',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'employee',
    avatar: { url: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    phoneNumber: '555-0103',
    createdAt: '2024-03-10T09:00:00Z',
  },
  {
    _id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'employee',
    avatar: { url: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
    phoneNumber: 'Not updated',
    createdAt: '2024-05-01T11:45:00Z',
  },
];

const EmployeePage = () => {
  const [employees, setEmployees] = useState<User[]>(initialEmployees);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleDeleteEmployee = (id: string) => {
    setEmployees(currentEmployees => currentEmployees.filter(emp => emp._id !== id));
  };

  const handleUpgradeEmployee = (id: string) => {
    setEmployees(currentEmployees =>
      currentEmployees.map(emp => (emp._id === id ? { ...emp, role: 'manager' } : emp))
    );
  };

  return (
    <>
      <AddEmployeeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Employees</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage the information and roles of employees in the system.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:cursor-pointer"
            >
              Add Employee
            </button>
          </div>
        </div>

        <EmployeeTable
          employees={employees}
          onUpgrade={handleUpgradeEmployee}
          onDelete={handleDeleteEmployee}
        />
      </div>
    </>
  );
};

export default EmployeePage;
