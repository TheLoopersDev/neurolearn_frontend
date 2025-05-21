'use client';

import Image from 'next/image';
import InputField from './InputField';
import PasswordField from './PasswordField';
import SocialLogin from './SocialLogin';
import { useModal } from '@/context/ModalContext';

const SignUpForm = ({ onClose }: { onClose: () => void }) => {
  const { showModal } = useModal();

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

        {/* Left: Sign up form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign Up</h2>

          <InputField label="Full Name" type="text" />
          <InputField label="Email" type="email" />
          <PasswordField placeholder="Password" />
          <PasswordField placeholder="Confirm Password" />

          <button className="w-full bg-gray-800 text-white py-2 rounded-full text-sm font-medium hover:bg-gray-600 transition cursor-pointer mt-2">
            Create Account
          </button>

          <div className="text-center mt-6 text-gray-800 text-sm">Or sign up with</div>
          <SocialLogin />

          <div className="text-sm mt-6 text-center text-gray-800">
            Already have an account?{' '}
            <span
              onClick={() => showModal('login')}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Login
            </span>
          </div>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block md:w-1/2 bg-[#ECECEC]">
          <Image
            src="/assets/home/login-bg.png"
            alt="Sign up visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
