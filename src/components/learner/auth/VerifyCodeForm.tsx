import Image from 'next/image';
import React from 'react';

const VerifyCodeForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 font-inter px-4">
      <div className="bg-[#ECECEC] rounded-2xl shadow-xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-700 z-[9999] hover:cursor-pointer hover:font-bold"
        >
          ✕
        </button>

        {/* Left: Verify Code form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Verify Code</h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Please enter the verification code sent to your email.
          </p>
          <input
            type="text"
            placeholder="Enter verification code"
            className="border border-gray-300 text-black rounded px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full bg-gray-800 text-white py-2 rounded-full text-sm font-medium hover:bg-gray-600 transition cursor-pointer">
            Verify
          </button>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block md:w-1/2 bg-[#ECECEC]">
          <Image
            src="/assets/home/login-bg.png"
            alt="Verify visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyCodeForm;
