'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentStatisticChartProps {
  isLoading: boolean;
  chartData: { name: string; view: number; buy: number }[];
}

export default function StudentStatisticChart({ isLoading, chartData }: StudentStatisticChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold text-black">Statistics Of Student</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-gray-300 inline-block"></span>
            <span className="text-gray-400 text-sm">View courses</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-blue-600 inline-block"></span>
            <span className="text-blue-600 text-sm">Buy courses</span>
          </div>
        </div>
      </div>

      <div className="w-full h-72 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
          </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap={15}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="buy" stackId="a" fill="#2563eb" radius={[0, 0, 10, 10]} barSize={70} />
                <Bar dataKey="view" stackId="a" fill="#D1D5DB" radius={[10, 10, 0, 0]} barSize={70} />
              </BarChart>
            </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
