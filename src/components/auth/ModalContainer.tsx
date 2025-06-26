import { useModal } from '@/context/ModalContext';
import LoginForm from './LoginForm'; // UI mới bạn đang dùng
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPassword';
import VerifyCodeForm from './VerifyCodeForm';
import NewPasswordForm from './NewPasswordForm';
import VerifyResetCodeForm from './VerifyResetCode';
import AddBankCardModal from '../instructor/revenue/AddBankCardModal';


export default function ModalContainer() {
  const { modalType, hideModal } = useModal();

  if (!modalType) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <button
          onClick={hideModal}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>

        {modalType === 'login' && <LoginForm onClose={hideModal} />}
        {modalType === 'signup' && <SignUpForm onClose={hideModal} />}
        {modalType === 'forgotPassword' && <ForgotPasswordForm onClose={hideModal} />}
        {modalType === 'verifyCode' && <VerifyCodeForm onClose={hideModal} />}
        {modalType === 'newPassword' && <NewPasswordForm onClose={hideModal} />}
        {modalType === 'verifyResetCode' && <VerifyResetCodeForm onClose={hideModal} />}
        {modalType === 'addBankCard' && <AddBankCardModal onClose={hideModal} />}
      </div>
    </div>
  );
}
