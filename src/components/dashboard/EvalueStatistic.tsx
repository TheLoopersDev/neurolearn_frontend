'use client';

import Image from 'next/image';

const stats = [
  { star: 5, percent: 75 },
  { star: 4, percent: 20 },
  { star: 3, percent: 5 },
  { star: 2, percent: 0 },
  { star: 1, percent: 0 },
];

export default function EvalueStatistic() {
  const average = 4.6;
  const circleRadius = 48; // tăng bán kính
  const circleCircum = 2 * Math.PI * circleRadius;
  const progress = (average / 5) * circleCircum;

  return (
    <div className="bg-white rounded-2xl p-4 w-full h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-black">Evalue Statistics</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 mb-2">
          {/* Background circle */}
          <svg width="128" height="128">
            <circle
              cx="64"
              cy="64"
              r={circleRadius}
              stroke="#E5E7EB"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r={circleRadius}
              stroke="#2563eb"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circleCircum}
              strokeDashoffset={circleCircum - progress}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s' }}
            />
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-black">{average}</span>
            <Image src="/assets/icons/star.svg" alt="star" width={32} height={32} className="mt-1" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {stats.map((item) => (
          <div key={item.star} className="flex items-center gap-3">
            <span className="w-6 text-lg text-gray-700 flex items-center">
              {item.star}
              <Image src="/assets/icons/star.svg" alt="star" width={18} height={18} className="ml-1" />
            </span>
            <div className="flex-1 h-3 bg-gray-100 rounded-full relative">
              <div
                className="h-3 bg-blue-600 rounded-full"
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <span className="w-10 text-base text-gray-500 text-right">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}