import { useModal } from '@/context/ModalContext';
import AuthDialog from '@/components/learner/auth/AuthDialog';

export default function ModalContainer() {
  const { modalType, hideModal } = useModal();

  if (!modalType) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[999]">
      {(modalType === 'register' || modalType === 'login') && <AuthDialog />}
    </div>
  );
}
