'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import login_background from '@/public/assets/home/login-bg.png';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { useActivationMutation } from '@/lib/redux/features/auth/authApi';
import { useModal } from '@/context/ModalContext';
import SpinnerMini from '@/components/common/ui/SpinnerMini';
import Button from '@/components/common/ui/Button';
import { X } from 'lucide-react';

import { Input } from './InputField';

type VerifyNumber = {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
};

const VerifyCodeForm = ({ onClose }: { onClose: () => void }) => {
  const { showModal } = useModal();
  const { toast } = useToast();
  const { token } = useSelector((state: any) => state.auth);

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: '',
    1: '',
    2: '',
    3: '',
  });

  const [invalidError, setInvalidError] = useState(false);
  const [activation, { isLoading, isSuccess, error }] = useActivationMutation();

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Account activated successfully!',
      });
      showModal('login');
    }

    if (error && 'data' in error) {
      toast({
        variant: 'destructive',
        title: 'Verification failed',
        description: (error as any).data.message || 'Invalid verification code',
      });
      setInvalidError(true);
    }
  }, [isSuccess, error]);

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const updated = { ...verifyNumber, [index]: value };
    setVerifyNumber(updated);

    if (value === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const verify = async () => {
    const code = Object.values(verifyNumber).join('');
    if (code.length !== 4) {
      setInvalidError(true);
      return;
    }

    await activation({
      activation_token: token,
      activation_code: code,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm font-inter">
      <div className="relative w-full max-w-5xl h-[600px] bg-white overflow-hidden rounded-3xl shadow-xl">
        <Image
          src={login_background}
          alt="Verify background"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          priority
          quality={100}
          sizes="100vw"
        />

        <div className="relative z-10 flex flex-col md:flex-row w-full h-full rounded-3xl">
          <div className="w-full md:w-1/2 p-10">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-600 hover:text-black text-xl"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-3xl font-bold mb-2 text-gray-900 text-left">Enter Verification Code</h2>
            <p className="text-sm text-gray-600 mb-6">Check your email for the 4-digit code</p>

            <div className="flex justify-center gap-4 mb-6">
              {Object.keys(verifyNumber).map((key, index) => (
                <input
                  key={key}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={verifyNumber[key as keyof VerifyNumber]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className={`w-14 h-14 border-2 text-center text-lg font-semibold rounded-md outline-none transition ${invalidError ? 'border-red-500' : 'border-gray-400'} focus:ring-2 focus:ring-blue-500`}
                />
              ))}
            </div>

            <button
              onClick={verify}
              disabled={isLoading}
              className="w-full items-center rounded-full bg-gray-800 py-3 text-white font-semibold transition hover:bg-gray-900 disabled:opacity-50"
            >
              {isLoading ? <SpinnerMini /> : 'Verify'}
            </button>

            <p className="text-sm mt-6 text-center text-gray-700">
              Go back to{' '}
              <button
                type="button"
                onClick={() => showModal('login')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="hidden md:block md:w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default VerifyCodeForm;
