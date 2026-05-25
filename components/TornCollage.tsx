// TornCollage.tsx
// Technique: a cream paper strip with jagged .torn-paper clip-path and subtle
// paper-texture noise hosts three hand-drawn lifestyle icons (plant / coffee /
// pencil) rendered as inline SVG line art for that sketchbook feel.

import React from 'react';

function PlantIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" className="stroke-ink-900 fill-none" strokeWidth={2}>
      {/* Pot */}
      <path d="M14 32 L34 32 L31 44 L17 44 Z" strokeLinejoin="round" />
      {/* Soil line */}
      <path d="M14 32 L34 32" />
      {/* Leaves */}
      <path d="M24 32 C 20 24, 14 22, 12 14 C 20 14, 24 22, 24 30" strokeLinejoin="round" />
      <path d="M24 32 C 28 24, 34 22, 36 14 C 28 14, 24 22, 24 30" strokeLinejoin="round" />
      <path d="M24 32 L24 18" />
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" className="stroke-ink-900 fill-none" strokeWidth={2}>
      {/* Cup */}
      <path d="M10 18 L34 18 L32 38 C 32 41, 30 42, 28 42 L16 42 C 14 42, 12 41, 12 38 Z" strokeLinejoin="round" />
      {/* Handle */}
      <path d="M34 22 C 40 22, 40 32, 34 32" />
      {/* Steam */}
      <path d="M18 12 C 18 9, 20 9, 20 6" strokeLinecap="round" />
      <path d="M24 12 C 24 9, 26 9, 26 6" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" className="stroke-ink-900 fill-none" strokeWidth={2}>
      {/* Pencil body */}
      <path d="M8 40 L12 36 L34 14 L38 18 L16 40 Z" strokeLinejoin="round" />
      {/* Tip */}
      <path d="M8 40 L14 38 L10 34 Z" strokeLinejoin="round" />
      {/* Eraser line */}
      <path d="M30 18 L34 22" />
    </svg>
  );
}

export default function TornCollage() {
  return (
    <div className="relative torn-paper bg-cream-50 paper-texture w-72 h-36 shadow-card flex items-center justify-around px-4">
      <PlantIcon />
      <CoffeeIcon />
      <PencilIcon />
    </div>
  );
}
