import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
}

export default function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-background p-5 shadow-sm">
      <div className="rounded-full bg-primary-50 p-3">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}
