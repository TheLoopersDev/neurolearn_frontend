import React, { useEffect, useRef, useState } from 'react';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { Button } from '@/components/common/ui/Button2';
import { DialogType } from '@/types/commons';
import { useResetCodeMutation } from '@/lib/redux/features/auth/authApi';
import { useToast } from '@/hooks/use-toast';
import SpinnerMini from '@/components/common/ui/SpinnerMini';

type VerifyNumber = {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
};

type Props = {
  readonly handleDialogChange: (type: DialogType) => void;
};

export default function VerifyResetCode({ handleDialogChange }: Props) {
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const { token } = useSelector((state: any) => state.auth);
  const [resetCode, { isSuccess, error, isLoading }] = useResetCodeMutation();
  const { toast } = useToast();

  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: 'success',
        title: 'Successfully',
        description: 'Verify reset code successfully!',
      });
      handleDialogChange('reset-password');
    }
    if (error) {
      if ('data' in error) {
        const errorData = error as any;
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: errorData.data.message,
        });
        setInvalidError(true);
      } else {
        console.log('An error occurred: ', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: '',
    1: '',
    2: '',
    3: '',
  });
  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join('');
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await resetCode({
      reset_token: token,
      reset_code: verificationNumber,
    });
  };
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };
  return (
    <div>
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-accent-600 flex items-center justify-center">
          <VscWorkspaceTrusted size={40} className="mt-1" />
        </div>
      </div>
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="text"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex text-primary-800
                            justify-center text-lg outline-none text-center 
                            ${invalidError ? 'shake border-red-500' : 'border-[#0000004a'}`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={e => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center">
        <Button variant="primary" size="rounded" onClick={verificationHandler} className="w-full">
          {isLoading ? (
            <SpinnerMini />
          ) : (
            <>
              <span>Verify OTP</span>
            </>
          )}
        </Button>
      </div>
      <br />
      <h5 className="text-center pt-4 text-sm text-primary-800 font-medium leading-7">
        Go back to sign in?
        <button
          onClick={() => handleDialogChange('login')}
          className="font-medium leading-7 text-accent-900 cursor-pointer"
        >
          {' ' + 'Sign in'}
        </button>
      </h5>
    </div>
  );
}
