"use client";

import React from "react";

interface PageSkeletonProps {
  variant: "table" | "form" | "grid";
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <SkeletonBlock className="h-10 w-72" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-4 w-48 flex-1" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <SkeletonBlock className="h-4 w-32" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-8 w-20" />
          <SkeletonBlock className="h-8 w-8" />
          <SkeletonBlock className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="max-w-4xl space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <SkeletonBlock className="h-5 w-40" />
          <div className="space-y-4">
            <div>
              <SkeletonBlock className="h-3 w-20 mb-2" />
              <SkeletonBlock className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <SkeletonBlock className="h-3 w-16 mb-2" />
                <SkeletonBlock className="h-10 w-full" />
              </div>
              <div>
                <SkeletonBlock className="h-3 w-16 mb-2" />
                <SkeletonBlock className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <SkeletonBlock className="h-40 w-full rounded-lg" />
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function PageSkeleton({ variant }: PageSkeletonProps) {
  switch (variant) {
    case "table":
      return <TableSkeleton />;
    case "form":
      return <FormSkeleton />;
    case "grid":
      return <GridSkeleton />;
  }
}
