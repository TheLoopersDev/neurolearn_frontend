import { ArrowRight } from 'lucide-react';

export default function HeaderBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent-700 p-8 text-white">
      <div className="relative z-10 max-w-lg">
        <h1 className="text-3xl font-bold">Empower Your Team with Smarter Learning</h1>
        <p className="mt-2 text-primary-50">
          Unlock special savings for businesses with bulk course purchases. Efficiently upskill your
          team with our AI-powered training platform.
        </p>
        <button className="mt-6 flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-primary transition-colors hover:bg-primary-50">
          <span>Get Started</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {/* Hình ảnh trang trí có thể thêm vào đây */}
      <div className="absolute -right-20 -top-10 z-0 opacity-20">
        <svg
          width="400"
          height="250"
          viewBox="0 0 400 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="50" r="150" stroke="white" strokeWidth="20" />
          <circle cx="300" cy="150" r="80" stroke="white" strokeWidth="15" strokeOpacity="0.7" />
        </svg>
      </div>
    </div>
  );
}
