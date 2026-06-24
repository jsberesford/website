'use client';

// SnapshotSection — "two modes." A lab-notebook spread split down the middle:
// the left page is the Engineer (what I build), the right is the Operator (what
// I run). Frames the SWE + leadership combo as deliberate range. Hard numbers
// are résumé-backed; the bars are self-rated "reps" (labeled as such). Keeps the
// graph-paper sheet, washi tape, margin rule and draw-in-on-scroll animation.
//
// ───────────────────────────────────────────────────────────────────────────
// Numbers below are pulled from the résumé. Bars are self-assessed range.
// ───────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Stat = { value: string; label: string };
type Bar = { label: string; value: number };
type Mode = {
  index: string;
  title: string;
  tagline: string;
  barAccent: string; // tailwind bg-* for the bar fill
  tagAccent: string; // tailwind bg-* for the tag chips
  stats: Stat[];
  bars: Bar[];
  barsLabel: string;
  tagsLabel: string;
  tags: string[];
};

const modes: Mode[] = [
  {
    index: '01',
    title: 'Engineer',
    tagline: 'what I build',
    barAccent: 'bg-accent-sky',
    tagAccent: 'bg-accent-sky',
    stats: [
      { value: '3', label: 'apps shipped' },
      { value: '<300ms', label: 'parse latency' },
      { value: '600+', label: 'SKUs tracked' },
    ],
    barsLabel: 'where the reps are · self-rated',
    bars: [
      { label: 'frontend', value: 90 },
      { label: 'backend', value: 80 },
      { label: 'mobile', value: 75 },
      { label: 'data', value: 70 },
      { label: 'devops', value: 65 },
    ],
    tagsLabel: 'stack',
    tags: [
      'TypeScript',
      'Python',
      'C++',
      'React Native',
      'Next.js',
      'FastAPI',
      'Supabase',
      'PostgreSQL',
      'Prisma',
    ],
  },
  {
    index: '02',
    title: 'Operator',
    tagline: 'what I run',
    barAccent: 'bg-accent-coral',
    tagAccent: 'bg-accent-yellow',
    stats: [
      { value: '500+', label: 'members led' },
      { value: '$55K/wk', label: 'budget managed' },
      { value: '300+', label: 'event attendees' },
    ],
    barsLabel: 'where the reps are · self-rated',
    bars: [
      { label: 'operations', value: 90 },
      { label: 'leadership', value: 88 },
      { label: 'events', value: 85 },
      { label: 'finance', value: 80 },
      { label: 'strategy', value: 75 },
    ],
    tagsLabel: 'focus',
    tags: [
      'Process Optimization',
      'Budget Allocation',
      'Vendor Negotiation',
      'Cross-Team Leadership',
      'Cost Analysis',
    ],
  },
];

function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-900/45 mb-3">
      {children}
    </div>
  );
}

function ModePage({ mode, live, side }: { mode: Mode; live: boolean; side: number }) {
  return (
    <div className="flex flex-col gap-9">
      {/* header */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-ink-900/35">{mode.index}</span>
          <h3 className="font-script text-5xl sm:text-6xl text-ink-900 leading-none">
            {mode.title}
          </h3>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-900/45 mt-3 pl-9">
          {mode.tagline}
        </p>
      </div>

      {/* hero stats — two-column ledger so wide values never collide */}
      <motion.div
        className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-5 items-baseline"
        initial={{ opacity: 0, y: 12 }}
        animate={live ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: side * 0.1 + 0.05 }}
      >
        {mode.stats.map((s) => (
          <React.Fragment key={s.label}>
            <div className="font-sans font-bold text-4xl sm:text-5xl leading-none text-ink-900 whitespace-nowrap">
              {s.value}
            </div>
            <div className="font-script text-xl text-ink-900/55">{s.label}</div>
          </React.Fragment>
        ))}
      </motion.div>

      {/* reps bars */}
      <div>
        <FieldLabel>{mode.barsLabel}</FieldLabel>
        <div className="space-y-3">
          {mode.bars.map((b, i) => (
            <div key={b.label} className="flex items-center gap-4">
              <span className="font-mono text-xs lowercase tracking-wide text-ink-900/70 w-24 shrink-0">
                {b.label}
              </span>
              <div className="flex-1 h-4 border border-ink-900/15 rounded-[2px] overflow-hidden bg-cream-100/40">
                <div
                  className={`h-full ${mode.barAccent}`}
                  style={{
                    width: live ? `${b.value}%` : '0%',
                    transition: `width 1s cubic-bezier(.2,.7,.2,1) ${side * 0.1 + i * 0.07}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* tags */}
      <div>
        <FieldLabel>{mode.tagsLabel}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {mode.tags.map((t) => (
            <span
              key={t}
              className={`font-mono text-xs text-ink-900 px-2.5 py-1 rounded-sm ${mode.tagAccent}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SnapshotSection() {
  const { ref, inView: live } = useInView<HTMLDivElement>(0.15);

  return (
    <section id="work" className="relative py-28 sm:py-36 px-4 sm:px-8">
      <div className="font-script text-5xl text-ink-900/80 mb-4 text-center">snapshot</div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-900/50 text-center mb-14">
        field notes · two modes
      </p>

      <div className="mx-auto max-w-6xl [perspective:1600px]">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, rotate: -0.8 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.4 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-sm bg-cream-50 shadow-window px-7 py-10 sm:px-14 sm:py-16"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(60,80,110,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(60,80,110,0.09) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        >
          {/* washi tape */}
          <span
            aria-hidden
            className="absolute -top-3 left-12 w-28 h-7 bg-accent-mint/60 rotate-[-7deg] shadow-sm"
          />
          <span
            aria-hidden
            className="absolute -top-3 right-14 w-24 h-7 bg-accent-yellow/60 rotate-[5deg] shadow-sm"
          />

          {/* page header */}
          <div className="flex items-end justify-between mb-12">
            <div className="font-script text-3xl text-ink-900 leading-none">field notes</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-900/45">
              builder / operator · 06 / 2026
            </div>
          </div>

          {/* two-page spread */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
            <div className="lg:pr-14">
              <ModePage mode={modes[0]} live={live} side={0} />
            </div>

            {/* center binding / fold */}
            <div className="relative lg:pl-14">
              <span
                aria-hidden
                className="hidden lg:block absolute left-0 inset-y-0 w-px border-l border-dashed border-ink-900/20"
              />
              <ModePage mode={modes[1]} live={live} side={1} />
            </div>
          </div>
        </motion.div>
      </div>

      <p className="font-script text-lg text-ink-900/45 text-center mt-7">
        I build the thing, then I run the thing.
      </p>
    </section>
  );
}
