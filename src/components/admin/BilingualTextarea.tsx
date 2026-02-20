"use client";

import React from "react";

interface BilingualTextareaProps {
  label: string;
  nameEn: string;
  nameAr: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (v: string) => void;
  onChangeAr: (v: string) => void;
  required?: boolean;
  error?: string;
  rows?: number;
}

export default function BilingualTextarea({
  label,
  nameEn,
  nameAr,
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  required,
  error,
  rows = 4,
}: BilingualTextareaProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* English */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">English</label>
          <textarea
            name={nameEn}
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            placeholder="English..."
            rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
          />
        </div>
        {/* Arabic */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Arabic</label>
          <textarea
            name={nameAr}
            value={valueAr}
            onChange={(e) => onChangeAr(e.target.value)}
            placeholder="...عربي"
            dir="rtl"
            rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#c8567e]/30 focus:border-[#c8567e] transition-colors"
            style={{ fontFamily: "var(--font-arabic)" }}
          />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}
