// src/app/(auth)/dashboard/setting/_components/ProfileEditorForm.tsx
import React from 'react';
import EditInformationForm from './EditInformationForm';
import ChangePasswordForm from './ChangePasswordForm';

// Định nghĩa các kiểu dữ liệu cho state của form
interface InfoData {
  name: string;
  age: string; // <<-- Nhận 'age' dưới dạng chuỗi từ page.tsx
}
interface PasswordData {
  newPassword: string;
  retypePassword: string;
}

interface ProfileEditorFormProps {
  infoData: InfoData;
  passwordData: PasswordData;
  onInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileEditorForm: React.FC<ProfileEditorFormProps> = ({
  infoData,
  passwordData,
  onInfoChange,
  onPasswordChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="w-full lg:flex-1 bg-white p-6 sm:p-8 rounded-2xl ">
      <form
        onSubmit={e => {
          e.preventDefault();
          onSave();
        }}
      >
        <EditInformationForm
          nameValue={infoData.name}
          ageValue={infoData.age} // Truyền ageValue dưới dạng chuỗi
          onChange={onInfoChange}
        />
        <hr className="my-8 border-gray-200" />
        <ChangePasswordForm
          newPasswordValue={passwordData.newPassword}
          retypePasswordValue={passwordData.retypePassword}
          onChange={onPasswordChange}
        />
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-10 py-2.5 hover:cursor-pointer rounded-3xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-12 py-2.5 rounded-3xl hover:cursor-pointer text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditorForm;
