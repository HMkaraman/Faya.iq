"use client";

import React, { useState, useRef, useCallback } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  caption?: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage, caption }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  function handleMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    updatePosition(e.clientX);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }

  function handleMouseUp() {
    isDragging.current = false;
  }

  function handleTouchStart(e: React.TouchEvent) {
    isDragging.current = true;
    updatePosition(e.touches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging.current) return;
    e.preventDefault();
    updatePosition(e.touches[0].clientX);
  }

  function handleTouchEnd() {
    isDragging.current = false;
  }

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden select-none cursor-col-resize"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* After image (full) */}
        <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />

        {/* Before image (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${containerRef.current?.offsetWidth || 600}px` }} />
        </div>

        {/* Slider line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px]">drag_handle</span>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded">Before</div>
        <div className="absolute top-3 right-3 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded">After</div>
      </div>
      {caption && <p className="text-sm text-gray-600 text-center">{caption}</p>}
    </div>
  );
}
