'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState } from 'react';

const data = [
  { name: 'Apr', revenue: 500000 },
  { name: 'May', revenue: 800000 },
  { name: 'Jun', revenue: 1200000 },
  { name: 'July', revenue: 1000000 },
  { name: 'Aug', revenue: 1200000 },
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg px-6 py-4" style={{ border: 'none' }}>
        <div className="text-gray-500 font-semibold text-base flex items-center gap-2">
          Total Revenue
          <span className="text-green-500 flex items-center text-xs font-bold ml-2">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M12 19V5M12 5l-7 7M12 5l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            33%
          </span>
        </div>
        <div className="text-2xl font-bold text-black mt-1">800.000 VND</div>
      </div>
    );
  }
  return null;
}

export default function RevenueStatisticChart() {
  const [mode, setMode] = useState<'month' | 'year'>('month');

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-black">Revenue Statistics</h2>
        <div className="flex gap-2">
          <button
            className={`px-6 py-2 rounded-xl font-semibold text-base transition ${mode === 'month' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-500'}`}
            onClick={() => setMode('month')}
          >
            Month
          </button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold text-base transition ${mode === 'year' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-500'}`}
            onClick={() => setMode('year')}
          >
            Year
          </button>
        </div>
      </div>
      <div className="w-full h-96 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 18, fill: '#222', fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={v => v.toLocaleString('vi-VN')}
              tick={{ fontSize: 16, fill: '#222' }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#colorRevenue)"
              dot={{ r: 6, fill: '#fff', stroke: '#2563eb', strokeWidth: 3 }}
              activeDot={{ r: 10, fill: '#fff', stroke: '#2563eb', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <button className="absolute top-1/2 right-2 -translate-y-1/2 border border-blue-600 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-50 transition">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M13 5l7 7-7 7M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
