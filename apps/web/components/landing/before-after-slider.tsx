"use client";

import { useState } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "قبل",
  afterLabel = "بعد",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-high group select-none shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      {/* After Image (Background) */}
      <Image
        src={afterImage}
        alt="After Transformation"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute top-4 start-4 bg-accent text-bg font-bold px-3 py-1 text-xs rounded-full z-20 shadow-md">
        {afterLabel}
      </div>

      {/* Before Image (Foreground with clip-path) */}
      <div
        className="absolute inset-0 z-10 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <Image
          src={beforeImage}
          alt="Before Transformation"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute top-4 end-4 bg-black/70 text-text-1 font-bold px-3 py-1 text-xs rounded-full z-20 border border-white/10 shadow-md">
          {beforeLabel}
        </div>
      </div>

      {/* Divider line & Drag Handle */}
      <div
        className="absolute inset-y-0 z-30 w-1 bg-accent/80 cursor-ew-resize pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-accent text-bg shadow-[0_0_20px_rgba(197, 162, 93,0.5)] flex items-center justify-center border-4 border-bg font-bold text-lg">
          ↔
        </div>
      </div>

      {/* Invisible Input Range for dragging */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 z-40 cursor-ew-resize"
      />
    </div>
  );
}
