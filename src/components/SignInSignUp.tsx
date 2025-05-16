import { useState } from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

interface SignInUpFormProps {
  onClose: () => void;
  defaultToSignUp?: boolean;
}

export default function SignInUpForm({ onClose, defaultToSignUp }: SignInUpFormProps) {
  const [isRightPanelActive, setIsRightPanelActive] = useState(defaultToSignUp ?? false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <>
      <Head>
        <title>Sign In/Up Form</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.3/css/all.min.css"
        />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,800" rel="stylesheet" />
      </Head>

      <div className="flex justify-center items-center flex-col font-['Montserrat']   my-[-20px] mb-[50px] text-[#5B78FF]">
        <div
          className={`bg-white rounded-xl shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)] relative overflow-hidden w-[768px] max-w-full min-h-[480px] ${
            isRightPanelActive ? 'right-panel-active' : ''
          }`}
          id="container"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#333] hover:text-gray-700 z-[9999] hover:cursor-pointer hover:font-bold"
          >
            ✕
          </button>
          {/* Sign Up Form */}
          <div
            className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 opacity-0 z-[1] ${
              isRightPanelActive ? 'translate-x-full opacity-100 z-[5]' : ''
            }`}
          >
            <form className="bg-white flex items-center justify-center flex-col py-0 px-[50px] h-full text-center">
              <h1 className="font-bold my-0 text-[#5B78FF]">Create Account</h1>
              <div className="my-[20px]">
                <a
                  href="#"
                  className="border border-[#DDDDDD] rounded-full inline-flex justify-center items-center mx-[5px] h-[40px] w-[40px]"
                >
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
              </div>
              <span className="text-xs text-[#5B78FF]">or use your email for registration</span>
              <input
                type="text"
                placeholder="Name"
                className="bg-[#eee] border-none py-[12px] px-[15px] my-[8px] w-full"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-[#eee] border-none py-[12px] px-[15px] my-[8px] w-full"
              />
              <input
                type="password"
                placeholder="Password"
                className="bg-[#eee] border-none py-[12px] px-[15px] my-[8px] w-full"
              />
              <button className="rounded-[20px] mt-[15px] hover:cursor-pointer hover:bg-white border border-[#5B78FF] bg-[#5B78FF] text-white text-xs font-bold py-[12px] px-[45px] uppercase tracking-[1px] transition-transform duration-80 ease-in active:scale-95 focus:outline-none hover:text-[#5B78FF]">
                Sign Up
              </button>
            </form>
          </div>

          {/* Sign In Form */}
          <div
            className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-[2] ${
              isRightPanelActive ? 'translate-x-full' : ''
            }`}
          >
            <form className="bg-white flex items-center justify-center flex-col py-0 px-[50px] h-full text-center">
              <h1 className="font-bold my-0">Sign in</h1>
              <div className="my-[20px]">
                <a
                  href="#"
                  className="border border-[#DDDDDD] rounded-full inline-flex justify-center items-center mx-[5px] h-[40px] w-[40px]"
                >
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
              </div>
              <span className="text-xs ">or use your account</span>
              <input
                type="email"
                placeholder="Email"
                className="bg-[#eee] border-none py-[12px] px-[15px] my-[8px] w-full"
              />
              <input
                type="password"
                placeholder="Password"
                className="bg-[#eee] border-none py-[12px] px-[15px] my-[8px] w-full"
              />
              <a
                href="#"
                className="text-[#333] text-xs no-underline my-[15px] hover:text-[#5B78FF] transition-colors duration-200"
              >
                Forgot your password?
              </a>
              <button className="rounded-[20px] hover:cursor-pointer hover:bg-[#F7F8FA] hover:text-[#5B78FF] border border-[#5B78FF] bg-[#5B78FF] text-white text-xs font-bold py-[12px] px-[45px] uppercase tracking-[1px] transition-transform duration-80 ease-in active:scale-95 focus:outline-none ">
                Sign In
              </button>
            </form>
          </div>

          {/* Overlay Container */}
          <div
            className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-[100] ${
              isRightPanelActive ? '-translate-x-full' : ''
            }`}
          >
            <div
              className={`bg-gradient-to-r from-[#F7F8FA] to-[#5B78FF] text-white relative -left-full h-full w-[200%] transition-transform duration-600 ease-in-out ${
                isRightPanelActive ? 'translate-x-[50%]' : 'translate-x-0'
              }`}
            >
              <div
                className={`absolute flex items-center justify-center flex-col py-0 px-[40px] text-center top-0 h-full w-1/2 transition-transform duration-600 ease-in-out  ${
                  isRightPanelActive ? 'translate-x-0' : '-translate-x-[20%]'
                }`}
              >
                <h1 className="font-bold my-0 text-[#5B78FF]">Welcome Back!</h1>
                <p className="text-sm font-thin leading-[20px] tracking-[0.5px] my-[20px] text-[#5B78FF]">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  onClick={handleSignInClick}
                  className="rounded-[20px] border hover:cursor-pointer border-[#5B78FF] bg-transparent text-[#5B78FF] text-xs font-bold py-[12px] px-[45px] uppercase tracking-[1px] transition-transform duration-80 ease-in active:scale-95 focus:outline-none ghost hover:bg-white hover:text-[#5B78FF]"
                >
                  Sign In
                </button>
              </div>
              <div
                className={`absolute flex items-center justify-center flex-col py-0 px-[40px] text-center top-0 h-full w-1/2 transition-transform duration-600 ease-in-out right-0 ${
                  isRightPanelActive ? 'translate-x-[20%]' : 'translate-x-0'
                }`}
              >
                <h1 className="font-bold my-0">Hello, Friend!</h1>
                <p className="text-sm font-thin leading-[20px] tracking-[0.5px] my-[20px]">
                  Enter your personal details and start journey with us
                </p>
                <button
                  onClick={handleSignUpClick}
                  className="rounded-[20px]  border hover:cursor-pointer border-white bg-transparent text-white text-xs font-bold py-[12px] px-[45px] uppercase tracking-[1px] transition-transform duration-80 ease-in active:scale-95 focus:outline-none ghost hover:bg-white hover:text-[#5B78FF]"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#222] text-white text-sm bottom-0 fixed left-0 right-0 text-center z-[999]">
        <p className="my-[10px]">
          Created with <i className="fa fa-heart text-red-500"></i> by
          <a target="_blank" href="https://florin-pop.com" className="text-[#3c97bf] no-underline">
            Florin Pop
          </a>
          - Read how I created this and how you can join the challenge
          <a
            target="_blank"
            href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/"
            className="text-[#3c97bf] no-underline"
          >
            here
          </a>
          .
        </p>
      </footer>
    </>
  );
}
