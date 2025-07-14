import { Dialog } from '@headlessui/react';
import Image from 'next/image';

interface PaymentSuccessModalProps {
    open: boolean;
    onClose: () => void;
    onContinue: () => void;
}

export default function PaymentSuccessModal({ open, onClose, onContinue }: PaymentSuccessModalProps) {
    if (!open) return null;
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-xl p-8 w-full max-w-md">
                  {/* Wrapper mới */}
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <Image 
                      src="/assets/icons/success.svg"
                      alt="Success Icon"
                      height={150}
                      width={150}
                    />
                    <h2 className="text-2xl font-bold text-black">
                      Payment Successful
                    </h2>
                    <button
                      className="w-50 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-lg font-semibold"
                      onClick={onContinue}
                    >
                      Continue
                    </button>
                  </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
