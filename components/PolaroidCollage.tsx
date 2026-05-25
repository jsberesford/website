// PolaroidCollage.tsx
// Technique: a kraft-paper backdrop hosts absolutely-positioned polaroid prints
// at small random rotations to feel hand-placed. Inline leaf SVGs and a script
// caption add organic warmth over the photographic grid.

import React from 'react';

// Drop /public/images/polaroid-1.jpg ... polaroid-4.jpg to fill the frames.

type Polaroid = { src: string; alt: string; top: string; left: string; rotate: number; z?: number };

const polaroids: Polaroid[] = [
  { src: '/images/polaroid-1.jpg', alt: '', top: '12px', left: '14px', rotate: -7 },
  // Party photo pulled to the front of the stack.
  { src: '/images/polaroid-2.jpg', alt: '', top: '32px', left: '110px', rotate: 5, z: 10 },
  { src: '/images/polaroid-3.jpg', alt: '', top: '94px', left: '50px', rotate: -3 },
  { src: '/images/polaroid-4.jpg', alt: '', top: '78px', left: '160px', rotate: 8 },
];

function Leaf({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width="40"
      height="40"
      aria-hidden="true"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path
        d="M5 35 C 5 15, 25 5, 35 5 C 35 25, 25 35, 5 35 Z"
        fill="#7a9b6e"
      />
      <path
        d="M5 35 C 15 25, 25 15, 35 5"
        stroke="#3f5a39"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export default function PolaroidCollage() {
  return (
    <div className="relative bg-kraft-200 rounded-2xl p-6 shadow-card overflow-hidden w-[320px] h-[260px]">
      {polaroids.map((p, i) => (
        <img
          key={i}
          src={p.src}
          alt={p.alt}
          className="absolute w-32 h-32 bg-cream-50 p-2 pb-6 shadow-md object-cover"
          style={{ top: p.top, left: p.left, transform: `rotate(${p.rotate}deg)`, zIndex: p.z }}
        />
      ))}

      {/* Leaf accents */}
      <Leaf className="absolute -top-2 -left-2 opacity-80" />
      <Leaf className="absolute -bottom-3 -right-1 opacity-70" flip />

      {/* Script caption */}
      <div className="absolute bottom-2 right-3 font-script text-2xl text-ink-900/70 pointer-events-none">
        capture moments
      </div>
    </div>
  );
}
