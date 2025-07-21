// src/app/(auth)/dashboard/setting/_components/ChangePasswordForm.tsx
import React from 'react';
import FormField from './FormField';

// Định nghĩa props trực tiếp
interface ChangePasswordFormProps {
  newPasswordValue: string;
  retypePasswordValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  newPasswordValue,
  retypePasswordValue,
  onChange,
}) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <FormField
          label="Password"
          id="newPassword"
          name="newPassword"
          type="password"
          value={newPasswordValue} // Sử dụng prop mới
          onChange={onChange}
          placeholder="Enter new password"
        />
        <FormField
          label="Re-Type password"
          id="retypePassword"
          name="retypePassword"
          type="password"
          value={retypePasswordValue} // Sử dụng prop mới
          onChange={onChange}
          placeholder="Re-enter password"
        />
      </div>
    </section>
  );
};

export default ChangePasswordForm;
