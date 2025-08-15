'use client';

import React, { useEffect, useState } from 'react';
import EmployeeTable from './_components/EmployeeTable';
import AddEmployeeModal from './_components/AddEmployeeModal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import Loading from '@/components/common/Loading';


const EmployeePage = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useSelector((state: any) => state.auth);
  const businessId = user?.businessInfo?.businessId;
  const { toast } = useToast();

  const fetchEmployees = async () => {
    if (!businessId) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/business/${businessId}/visible-employees`,
        { withCredentials: true }
      );

      const raw = res.data.employees;

      const formatted: any[] = raw
        .filter((emp: any) => emp.user)
        .map((emp: any) => ({
          _id: emp.user._id,
          name: emp.user.name,
          email: emp.user.email,
          role: emp.role,
          phoneNumber: emp.user.phoneNumber || 'Not updated',
          avatar: emp.user.avatar,
          createdAt: emp.createdAt,
        }));
      setEmployees(formatted);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, [businessId]);

  const handleDeleteEmployee = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/business/${user?.businessInfo?.businessId}/employees/${id}`,
        {
          withCredentials: true,
        }
      );
      toast({
        title: 'Success',
        description: 'Employee has been removed',
        variant: 'success',
      });

      setEmployees(currentEmployees => currentEmployees.filter(emp => emp._id !== id));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to delete employee',
        variant: 'destructive',
      });
    }
  };

  const handleUpgradeEmployee = async (id: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/business/${user?.businessInfo?.businessId}/employees/${id}/up-role`,
        {},
        {
          withCredentials: true,
        }
      );
      toast({
        title: 'Success',
        description: 'Employee upgraded to manager',
        variant: 'success',
      });

      setEmployees(currentEmployees =>
        currentEmployees.map(emp => (emp._id === id ? { ...emp, role: 'manager' } : emp))
      );
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to upgrade employee',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <AddEmployeeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onRefresh={fetchEmployees} />

      <div className="">
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

        {loading ? (
          <Loading message="Loading employees..." />
        ) : (
            <EmployeeTable
              employees={employees}
              onUpgrade={handleUpgradeEmployee}
              onDelete={handleDeleteEmployee}
            />
        )}
      </div>
    </>
  );
};

export default EmployeePage;
