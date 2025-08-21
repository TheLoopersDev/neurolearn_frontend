import Image from 'next/image';
import { signIn } from 'next-auth/react';

type SocialLoginProps = {
  showFacebook?: boolean;
};

const SocialLogin = ({ showFacebook = true }: SocialLoginProps) => (
  <div className="flex justify-center gap-4 mt-2">
    <button className="bg-white p-3 rounded-full hover:bg-gray-200 cursor-pointer">
      <Image
        src="/assets/home/Google.svg"
        alt="Google"
        width={16}
        height={16}
        onClick={() => signIn('google')}
      />
    </button>
    {showFacebook && (
      <button className="bg-white p-3 rounded-full hover:bg-gray-200 cursor-pointer">
        <Image src="/assets/home/facebook.svg" alt="Facebook" width={18} height={18} />
      </button>
    )}
  </div>
);
export default SocialLogin;
