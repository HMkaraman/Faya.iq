import React from "react";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
  completed: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
  cancelled: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
  active: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
  inactive: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

const defaultStyle = { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status.toLowerCase()] ?? defaultStyle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
}
