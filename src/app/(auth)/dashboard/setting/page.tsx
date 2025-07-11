'use client';
import React, { useState, useEffect } from 'react';
import ProfileSidebar from './_components/ProfileSidebar';
import ProfileEditorForm from './_components/ProfileEditorForm';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import {
  getCurrentUserAPI,
  updateCurrentUserInfoAPI,
  updateUserAvatarAPI,
} from '@/services/api/user';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const SettingPage: React.FC = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [infoFormData, setInfoFormData] = useState({ name: '', age: '' });
  console.log(infoFormData);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Giới hạn 2MB
        toast({
          title: 'Error',
          description: 'Image file is too large. Maximum 2MB.',
          variant: 'destructive',
        });
        return;
      }
      setNewAvatarFile(file); // Lưu file vào state
      setNewAvatarPreview(URL.createObjectURL(file)); // Tạo URL để xem trước
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const userData = await getCurrentUserAPI();
        setUser(userData);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, [toast]);

  // Hàm save giờ nhận dữ liệu đã được validate từ react-hook-form
  const handleSaveChanges = async (formData: {
    name: string;
    age?: string;
    newPassword?: string;
  }) => {
    if (!user) return;
    setIsSaving(true);
    try {
      let finalUpdatedUser = user;
      let hasChanges = false;

      // 1. Xử lý upload và cập nhật avatar nếu có file mới
      if (newAvatarFile) {
        hasChanges = true;
        const avatarBase64 = await fileToBase64(newAvatarFile);
        const avatarUpdateResult = await updateUserAvatarAPI(avatarBase64);
        finalUpdatedUser = avatarUpdateResult.user; // Cập nhật user từ kết quả API avatar
        console.log('Avatar updated successfully.');
      }

      // 2. Xử lý cập nhật thông tin text nếu có thay đổi
      const ageAsNumber = formData.age ? parseInt(formData.age, 10) : null;
      if (formData.name.trim() !== user.name || ageAsNumber !== user.age) {
        hasChanges = true;
        const infoToUpdate: Partial<User> = {
          name: formData.name.trim(),
          age: ageAsNumber,
        };
        const infoUpdateResult = await updateCurrentUserInfoAPI(infoToUpdate);
        finalUpdatedUser = infoUpdateResult.user; // Cập nhật user từ kết quả API info
        console.log('User info updated successfully.');
      }

      // 3. Xử lý cập nhật mật khẩu nếu có
      if (formData.newPassword) {
        hasChanges = true;
        // ... gọi API đổi mật khẩu ở đây ...
        console.log('Password would be updated here.');
      }

      // Cập nhật state cuối cùng và hiển thị toast
      if (hasChanges) {
        setUser(finalUpdatedUser);
        setInfoFormData({
          name: finalUpdatedUser.name,
          age: finalUpdatedUser.age?.toString() || '',
        });
        toast({
          title: 'Success!',
          description: 'Your profile has been updated.',
          variant: 'success',
        });
      } else {
        toast({
          title: 'No Changes',
          description: "You haven't made any changes.",
          variant: 'default',
        });
      }

      // Reset các state tạm thời
      if (newAvatarPreview) URL.revokeObjectURL(newAvatarPreview);
      setNewAvatarFile(null);
      setNewAvatarPreview(null);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="   min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        <ProfileSidebar
          user={user}
          onFileChange={handleFileChange}
          newAvatarPreview={newAvatarPreview}
        />

        {isLoading || !user ? (
          <div className="w-full lg:flex-1 bg-white p-6 sm:p-8 rounded-2xl shadow-sm animate-pulse">
            {/* Skeleton Loader */}
          </div>
        ) : (
          <ProfileEditorForm
            initialData={{
              name: user.name,
              age: user.age?.toString() || '',
              newPassword: '',
              retypePassword: '',
            }}
            onSave={handleSaveChanges}
            onCancel={() => {
              // Logic cancel giờ được quản lý bởi `reset` trong `ProfileEditorForm`
              // Chỉ cần log hoặc không làm gì ở đây
              console.log('Cancel clicked, form was reset.');
            }}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
};

export default SettingPage;
