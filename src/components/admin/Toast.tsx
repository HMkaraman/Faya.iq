"use client";

import React, { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const iconMap: Record<ToastType, string> = {
  success: "check_circle",
  error: "error",
  info: "info",
};

const colorMap: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: "text-green-500",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: "text-red-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: "text-blue-500",
  },
};

export default function Toast({ toast: toastData, onDismiss }: ToastProps) {
  const colors = colorMap[toastData.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toastData.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastData.id, onDismiss]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        animate-slide-right
        ${colors.bg} ${colors.border}
      `}
      style={{ animationDuration: "0.3s" }}
    >
      <span className={`material-symbols-outlined text-[20px] ${colors.icon}`}>
        {iconMap[toastData.type]}
      </span>
      <p className={`text-sm font-medium flex-1 ${colors.text}`}>{toastData.message}</p>
      <button
        onClick={() => onDismiss(toastData.id)}
        className={`p-0.5 rounded hover:bg-black/5 transition-colors ${colors.text}`}
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}
