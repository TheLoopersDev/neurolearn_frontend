// src/app/(auth)/dashboard/setting/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import ProfileSidebar from './_components/ProfileSidebar';
import ProfileEditorForm from './_components/ProfileEditorForm';
import { User } from '@/types/user';

// Interface cục bộ cho state của form
interface InfoFormData {
  name: string;
  age: string; // <<-- QUAN TRỌNG: Quản lý tuổi trong form dưới dạng chuỗi
}
interface PasswordFormData {
  newPassword: string;
  retypePassword: string;
}

// --- Dữ liệu người dùng mẫu ---
const initialUserData: User = {
  _id: '12345',
  name: 'Dao Tuan Kiet',
  email: 'daotuankiet123@gmail.com',
  role: 'user',
  avatar: {
    url: '/assets/images/avatar.png',
  },
  socialLinks: {
    facebook: 'https://facebook.com/daotuankiet',
  },
  profession: 'Student',
  age: 23, // Dữ liệu gốc là number | null
};
// ------------------------------------

const SettingPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [infoFormData, setInfoFormData] = useState<InfoFormData>({
    name: '',
    age: '', // Khởi tạo là chuỗi rỗng
  });
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    newPassword: '',
    retypePassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Tải dữ liệu và đồng bộ vào form
  useEffect(() => {
    setIsLoading(true);
    const userData = initialUserData;
    setUser(userData);

    // Chuyển đổi age (number | null) thành chuỗi để hiển thị trong input
    setInfoFormData({
      name: userData.name,
      age: userData.age?.toString() || '', // Chuyển số thành chuỗi, hoặc thành chuỗi rỗng nếu là null/undefined
    });
    setIsLoading(false);
  }, []);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Nếu là trường 'age', chỉ cho phép nhập số
    if (name === 'age' && value !== '' && !/^\d+$/.test(value)) {
      return; // Không cập nhật state nếu không phải là số
    }
    setInfoFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    if (!user) return;

    // Chuyển đổi age từ chuỗi trong form về number | null trước khi lưu
    const ageAsNumber = infoFormData.age ? parseInt(infoFormData.age, 10) : null;
    if (isNaN(ageAsNumber as number)) {
      // Xử lý trường hợp chuỗi không hợp lệ nếu cần, mặc dù đã chặn ở trên
      alert('Invalid age value.');
      return;
    }

    const updatedUserData: User = {
      ...user,
      name: infoFormData.name.trim(),
      age: ageAsNumber, // Lưu tuổi dưới dạng number | null
    };

    setUser(updatedUserData);
    console.log('Saving Information:', updatedUserData);
    alert('Profile information updated! (Check console log)');

    // ... (logic lưu password giữ nguyên) ...
    if (passwordFormData.newPassword) {
      if (passwordFormData.newPassword !== passwordFormData.retypePassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Saving New Password:', passwordFormData.newPassword);
      alert('Password updated successfully!');
    }
    setPasswordFormData({ newPassword: '', retypePassword: '' });
  };

  const handleCancel = () => {
    if (!user) return;
    setInfoFormData({
      name: user.name,
      age: user.age?.toString() || '',
    });
    setPasswordFormData({ newPassword: '', retypePassword: '' });
    console.log('Changes cancelled.');
  };

  const handlePhotoEdit = () => {
    console.log('Edit photo clicked');
    alert('Functionality to edit photo is not implemented yet.');
  };

  return (
    <div className="min-h-screen">
      {/* Container này sử dụng `lg:flex-row`, là điều kiện để `align-items: stretch` hoạt động */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        <ProfileSidebar user={user} onPhotoEditClick={handlePhotoEdit} />

        {isLoading ? (
          <div className="w-full lg:flex-1 bg-white p-6 sm:p-8 rounded-2xl shadow-sm animate-pulse">
            {/* ... skeleton loader ... */}
          </div>
        ) : (
          <ProfileEditorForm
            infoData={infoFormData}
            passwordData={passwordFormData}
            onInfoChange={handleInfoChange}
            onPasswordChange={handlePasswordChange}
            onSave={handleSaveChanges}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default SettingPage;
