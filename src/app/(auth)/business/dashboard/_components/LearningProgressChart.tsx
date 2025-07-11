import { ArrowRight } from 'lucide-react';

export default function LearningProgressChart() {
  return (
    <div className="rounded-xl bg-background p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Learning Progress over time</h2>
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          <button className="rounded-md bg-primary px-4 py-1 text-sm font-semibold text-white">
            Week
          </button>
          <button className="px-4 py-1 text-sm font-semibold text-gray-600">Month</button>
        </div>
      </div>

      <div className="relative mt-8 h-64">
        {/* Y-axis Labels */}
        <div className="absolute -left-2 top-0 flex h-full flex-col justify-between text-xs text-gray-400">
          <span>100%</span>
          <span>80%</span>
          <span>60%</span>
          <span>40%</span>
          <span>20%</span>
          <span>0%</span>
        </div>

        {/* Chart Lines and Plot */}
        <div className="relative ml-8 h-full">
          {/* Grid lines */}
          <div className="absolute top-0 h-full w-full">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 right-0 h-full w-px bg-gray-200"
                style={{ transform: `translateX(-${i * 25}%)` }}
              ></div>
            ))}
          </div>
          {/* Chart SVG */}
          <svg width="100%" height="100%" viewBox="0 0 500 256" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points="0,230 125,150 250,80 375,100 420,90"
            />
            <circle cx="375" cy="100" r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
          </svg>
          {/* Highlighted area */}
          <div className="absolute right-[10%] top-0 h-[calc(100%-24px)] w-[25%] rounded-lg bg-primary/10 border-r-2 border-primary/50"></div>
          {/* Tooltip */}
          <div className="absolute" style={{ left: 'calc(75% - 40px)', top: '10px' }}>
            <div className="rounded-lg bg-accent-900 px-3 py-2 text-center text-white shadow-lg">
              <p className="text-xs">Rating</p>
              <p className="text-lg font-bold">
                62% <span className="text-xs font-normal text-green-400">↑ 7%</span>
              </p>
            </div>
            <div className="mx-auto mt-[-2px] h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-accent-900"></div>
          </div>
          {/* Arrow Button */}
          <button className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
            <ArrowRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* X-axis Labels */}
        <div className="ml-8 mt-2 flex justify-between pr-12 text-sm text-gray-500">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
        </div>
      </div>
    </div>
  );
}
