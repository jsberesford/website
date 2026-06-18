'use client';

// HeroSection.tsx
// Technique: a full-viewport "scrapbook" canvas — on lg+ children are absolutely
// positioned with hand-tuned coords and slight rotations to create controlled
// chaos around a giant handwritten name; on small screens it collapses to a
// readable vertical stack. Framer-motion fade-up on enter ties it together.

import React from 'react';
import { motion } from 'framer-motion';

import FloatingDot from './FloatingDot';
import IDBadge from './IDBadge';
import PlaylistCard from './PlaylistCard';
import TerminalWindow from './TerminalWindow';
import PolaroidCollage from './PolaroidCollage';
import TicketCard from './TicketCard';
import ArchedFrame from './ArchedFrame';
import PixelDisplay from './PixelDisplay';

export default function HeroSection() {
  return (
    <motion.section
      id="top"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative min-h-screen w-full overflow-hidden px-4 pt-24 pb-12 sm:px-8 notebook-bg"
    >
      {/* Floating accent dot, top-left */}
      <div className="absolute top-28 left-8 z-20">
        <FloatingDot />
      </div>

      {/* --- Mobile / tablet stack (default) --- */}
      <div className="flex flex-col items-center gap-10 lg:hidden">
        <div className="text-center">
          <h1 className="font-script text-[18vw] sm:text-[14vw] lg:text-[12vw] leading-[0.85] text-ink-900">
            Jared Beresford
          </h1>
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.4em] text-ink-900/60 mt-4">
            If the door is closed, jump out a window
          </p>
        </div>
        <IDBadge />
        <PlaylistCard />
        <TerminalWindow />
        <PolaroidCollage />
        <TicketCard />
        <ArchedFrame />
        <PixelDisplay />
      </div>

      {/* --- Desktop scrapbook layout (lg+) --- */}
      <div className="hidden lg:block relative w-full h-[calc(100vh-6rem)] min-h-[760px]">
        {/* Center: giant handwritten name */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
          <h1 className="font-script text-[12vw] leading-[0.85] text-ink-900">
            Jared Beresford
          </h1>
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.4em] text-ink-900/60 mt-4">
            If the door is closed, jump out a window
          </p>
        </div>

        {/* IDBadge — top-left. No outer rotation: the lanyard inside has its own
            pendulum physics, so the parent stays flat to give the swing a true
            vertical rest position. Its wrapper is ~400px tall, so it owns the
            whole upper-left quadrant — nothing else goes above ~55% on the left. */}
        <div className="absolute left-[2%] top-[1%] z-20">
          <IDBadge />
        </div>

        {/* PlaylistCard — lower-left, clearly below the badge's swing footprint
            so the two read as a tidy pinned column rather than one clump. */}
        <div
          className="absolute left-[3%] bottom-[4%] z-10"
          style={{ transform: 'rotate(-2deg)' }}
        >
          <PlaylistCard />
        </div>

        {/* Terminal — top-right, slight right tilt */}
        <div
          className="absolute right-[3%] top-[3%] z-20"
          style={{ transform: 'rotate(3deg)' }}
        >
          <TerminalWindow />
        </div>

        {/* Polaroid collage — bottom-right corner, mild tilt */}
        <div
          className="absolute right-[2%] bottom-[4%] z-10"
          style={{ transform: 'rotate(-5deg)' }}
        >
          <PolaroidCollage />
        </div>

        {/* Ticket — upper-center, above the name */}
        <div
          className="absolute left-[34%] top-[5%] z-20"
          style={{ transform: 'rotate(-6deg)' }}
        >
          <TicketCard />
        </div>

        {/* Arched frame — bottom-center, sitting under the name */}
        <div
          className="absolute left-[43%] bottom-[5%] z-10"
          style={{ transform: 'rotate(4deg)' }}
        >
          <ArchedFrame />
        </div>

        {/* Pixel display — lower-center-left */}
        <div
          className="absolute left-[22%] bottom-[9%] z-20"
          style={{ transform: 'rotate(-3deg)' }}
        >
          <PixelDisplay />
        </div>
      </div>
    </motion.section>
  );
}
