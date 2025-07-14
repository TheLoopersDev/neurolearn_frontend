// src/app/(auth)/dashboard/setting/_components/FormField.tsx
'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerClassName?: string;
  icon?: React.ReactNode;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  containerClassName,
  icon,
  className,
  error,
  ...props
}) => {
  return (
    <div className={cn('w-full', containerClassName)}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={cn(
            'w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200', // <<-- THAY ĐỔI MÀU VIỀN KHI CÓ LỖI
            icon ? 'pr-10' : '',
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
