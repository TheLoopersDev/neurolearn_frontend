'use client';

import { useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPassword';
import VerifyCodeForm from './VerifyCodeForm';
import NewPasswordForm from './NewPasswordForm';
import VerifyResetCodeForm from './VerifyResetCode';
import AddBankCardModal from '../instructor/revenue/AddBankCardModal';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import ActionModal from '../../app/(auth)/instructor/courses/create-course/_components/ActionModal';
import AddEditSection from '@/app/(auth)/instructor/courses/create-course/_components/step2/AddEditSection';
import AddEditLessonModal from '@/app/(auth)/instructor/courses/create-course/_components/step2/AddEditLesson';


export default function ModalContainer() {
  const { modalType, hideModal, modalData } = useModal();
  const renderModalContent = () => {
    switch (modalType) {
      case 'login':
        return <LoginForm key="login" onClose={hideModal} />;
      case 'signup':
        return <SignUpForm key="signup" onClose={hideModal} />;
      case 'forgotPassword':
        return <ForgotPasswordForm key="forgotPassword" onClose={hideModal} />;
      case 'verifyCode':
        return <VerifyCodeForm key="verifyCode" onClose={hideModal} />;
      case 'newPassword':
        return <NewPasswordForm key="newPassword" onClose={hideModal} />;
      case 'verifyResetCode':
        return <VerifyResetCodeForm key="verifyResetCode" onClose={hideModal} />;
      case 'addBankCard':
        return <AddBankCardModal key="addBankCard" onClose={hideModal} />;
      case 'actionConfirm':
        return (
          <ActionModal
            isOpen
            onClose={hideModal}
            onConfirm={() => {
              modalData?.onConfirm?.();  // gọi callback từ ngoài
              hideModal();
            }}
            title={modalData?.title || "Confirm Action"}
            description={modalData?.description}
            confirmText={modalData?.confirmText || "Confirm"}
            cancelText={modalData?.cancelText || "Cancel"}
            variant={modalData?.variant || "default"}
          />
        );
      case 'addEditSection':
        return (
          <AddEditSection
            key="addEditSection"
            courseId={modalData?.courseId}
            mode={modalData?.mode || 'add'}
            initialData={modalData?.initialData}
            onSubmit={(data) => {
              modalData?.onSubmit?.(data);
              hideModal();
            }}
            onClose={hideModal}
          />
        );
      case 'addEditLesson':
        return (
          <AddEditLessonModal
            key="addEditLesson"
            lesson={modalData?.lesson}
            onSubmit={modalData?.onSubmit}
            onClose={hideModal}
          />
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => e.key === 'Escape' && hideModal();
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, [hideModal]);

  return (
    <AnimatePresence mode="sync">
      {modalType && (
        <motion.div
          layout
          key="modal-backdrop"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
          onClick={hideModal}
        >
          <motion.div
            key="modal"
            layout
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: 60,
              transition: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
            transition={{
              type: 'spring',
              stiffness: 250,
              damping: 30,
              mass: 0.8,
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              transformOrigin: 'center center',
              willChange: 'opacity, transform',
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[600px] rounded-3xl"
          >
            {renderModalContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
