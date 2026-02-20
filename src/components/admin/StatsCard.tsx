import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: string;
}

export default function StatsCard({ title, value, icon, color = "#c8567e" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ color }}
          >
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}
