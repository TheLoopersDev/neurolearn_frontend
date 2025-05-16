import { useModal } from '@/context/ModalContext';
import SignInUpForm from './SignInSignUp';

export default function ModalContainer() {
  const { modalType, hideModal } = useModal();

  if (!modalType) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      {(modalType === 'register' || modalType === 'login') && (
        <SignInUpForm onClose={hideModal} defaultToSignUp={modalType === 'register'} />
      )}
    </div>
  );
}
