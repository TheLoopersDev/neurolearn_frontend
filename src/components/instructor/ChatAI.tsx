'use client';

import Image from 'next/image';

export default function ChatAI() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow text-[#0D0D0D]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-[#3858F8]">Hey, I&apos;m Academix.</h1>
        <p className="text-[#D9D9D9]">Your AI-Powered copilot for the web.</p>
      </div>

      {/* Features */}
      <div className="flex gap-4 mb-6">
        <div className="flex flex-col items-center bg-[#F7F8FA] rounded-xl p-4 w-1/3 text-center shadow-sm">
          <Image src="/assets/icons/summarize.svg" alt="Summarize Icon" width={32} height={32} />
          <p className="text-sm mt-2">Summarize lectures<br />via AI chatbot</p>
        </div>
        <div className="flex flex-col items-center bg-[#F7F8FA] rounded-xl p-4 w-1/3 text-center shadow-sm">
          <Image src="/assets/icons/chat-ai.svg" alt="chat ai Icon" width={32} height={32} />
          <p className="text-sm mt-2">Answer lecture<br />questions via AI chatbot</p>
        </div>
        <div className="flex flex-col items-center bg-[#F7F8FA] rounded-xl p-4 w-1/3 text-center shadow-sm">
          <Image src="/assets/icons/content.svg" alt="Content Icon" width={32} height={32} />
          <p className="text-sm mt-2">Create quality content<br />via AI chatbot</p>
        </div>
      </div>

      {/* Chat history */}
      <div className="text-center text-xs text-gray-400 mb-4">Today 03:28</div>
      <div className="flex flex-col gap-2 mb-6">
        <div className="self-end bg-[#4F46E5] text-white px-4 py-2 rounded-full max-w-[80%] text-sm">
          Hello. Please help summarize this lecture.
        </div>
        <div className="self-start bg-[#EEF0FF] text-[#0D0D0D] px-4 py-2 rounded-full max-w-[80%] text-sm">
          Alright, I will summarize this lecture to help you understand it better.
        </div>
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2 bg-[#F7F8FA] rounded-full px-4 py-2 shadow-inner">
        <input
          type="text"
          placeholder="Ask me anything..."
          className="flex-1 bg-transparent outline-none text-sm placeholder-[#A0AEC0]"
        />
        <button>
          <Image src="/assets/icons/send.svg" alt="Send" width={30} height={30} />
        </button>
      </div>
    </div>
  );
}
