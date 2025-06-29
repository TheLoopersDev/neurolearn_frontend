'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import EditInformationForm from './EditInformationForm';
import ChangePasswordForm from './ChangePasswordForm';
import { cn } from '@/lib/utils';

// --- Định nghĩa Schema Validation bằng Zod ---
const profileFormSchema = z
  .object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
    age: z
      .string()
      .refine(
        val => val === '' || (!isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) < 120),
        {
          message: 'Please enter a valid age.',
        }
      )
      .optional(),
    newPassword: z.string().optional(),
    retypePassword: z.string().optional(),
  })
  .refine(
    data => {
      if (data.newPassword && data.newPassword.length > 0 && data.newPassword.length < 6) {
        return false;
      }
      return true;
    },
    {
      message: 'Password must be at least 6 characters.',
      path: ['newPassword'],
    }
  )
  .refine(
    data => {
      if (data.newPassword) {
        return data.newPassword === data.retypePassword;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['retypePassword'],
    }
  );

// <<-- THAY ĐỔI 1: EXPORT KIỂU DỮ LIỆU NÀY -->>
// Lấy kiểu dữ liệu từ schema để sử dụng trong form
export type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileEditorFormProps {
  initialData: Partial<ProfileFormData>; // Dữ liệu ban đầu có thể không đầy đủ
  onSave: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const ProfileEditorForm: React.FC<ProfileEditorFormProps> = ({
  initialData,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
  });

  const onSubmitHandler: SubmitHandler<ProfileFormData> = async data => {
    await onSave(data);
  };

  const handleCancelClick = () => {
    reset(initialData);
    onCancel();
  };

  return (
    <div className="w-full lg:flex-1 bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <fieldset disabled={isSaving} className="space-y-8">
          <EditInformationForm register={register} errors={errors} />
          <hr className="border-gray-200" />
          <ChangePasswordForm register={register} errors={errors} />
        </fieldset>
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={isSaving}
            className="px-10 py-2.5 hover:cursor-pointer rounded-3xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" /* ... */
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={
              'px-12 py-2.5 rounded-3xl hover:cursor-pointer text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors'
            }
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditorForm;
