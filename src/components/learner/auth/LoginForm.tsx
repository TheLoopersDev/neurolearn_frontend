'use client';

import { useState } from 'react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import SocialLogin from './SocialLogin';
import { useModal } from '@/context/ModalContext';
import { useLoginMutation } from '@/lib/redux/features/auth/authApi';
import Image from 'next/image';

const LoginForm = ({ onClose }: { onClose: () => void }) => {
  const { showModal } = useModal();
  const [email, setEmail] = useState('danhmuto@gmail.com');
  const [password, setPassword] = useState('Hayquenlamon@1');
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();

      onClose();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 font-inter px-4">
      <div className="bg-[#ECECEC] rounded-2xl shadow-xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-700 z-[9999] hover:cursor-pointer hover:font-bold"
        >
          ✕
        </button>

        {/* Left: Login form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <PasswordField
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <div
              className="text-right font-semibold text-sm text-blue-600 cursor-pointer hover:underline"
              onClick={() => showModal('forgotPassword')}
            >
              Forgot password?
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded-full text-sm font-medium hover:bg-gray-600 transition cursor-pointer disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-6 text-gray-800 text-sm">Or sign in with</div>
          <SocialLogin />

          <div className="text-sm mt-6 text-center text-gray-800">
            You do not have an account?{' '}
            <span
              onClick={() => showModal('signup')}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </div>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block md:w-1/2 bg-[#ECECEC]">
          <Image
            src="/assets/home/login-bg.png"
            alt="Login visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
