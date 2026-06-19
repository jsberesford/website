'use client';

// SnapshotSection — "field notes." The PM metrics rendered as a marked-up
// engineering-notebook page: pencil bar charts, a red-pen-circled headline
// number, skills as inked bars, a highlighter toolkit, washi-tape corners and
// script-font margin notes, all on a graph-paper sheet with a notebook margin
// rule. Lives in the same scrapbook/desk family as the rest of the site and
// uses the grid as actual paper. Charts draw themselves in on scroll.
//
// ───────────────────────────────────────────────────────────────────────────
// SAMPLE NUMBERS. Replace the values in `growth`, `retention`, `jots`,
// `skills` and `toolkit` with your real metrics.
// ───────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const usersBig = '600+';
const growth = [22, 35, 30, 52, 68, 92]; // ascending bar heights (% of column)
const retention = 40;
const jots = [
  { label: 'shipped', value: '3' },
  { label: 'led', value: '30' },
];
const skills = [
  { label: 'execution', value: 90 },
  { label: 'comms', value: 88 },
  { label: 'discovery', value: 85 },
  { label: 'strategy', value: 80 },
  { label: 'analytics', value: 78 },
  { label: 'design', value: 72 },
];
const toolkit = ['Figma', 'SQL', 'Amplitude', 'Mixpanel', 'Linear', 'Notion', 'Looker', 'A/B'];
const highlighters = [
  'bg-accent-yellow',
  'bg-accent-mint',
  'bg-accent-sky',
  'bg-accent-lilac',
];

function useInView<T extends Element>(threshold = 0.25) {
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

// A small section label written like a margin annotation.
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-900/50 mb-3">
      {children}
    </div>
  );
}

export default function SnapshotSection() {
  const { ref, inView: live } = useInView<HTMLDivElement>(0.2);

  return (
    <section id="work" className="relative py-24 sm:py-32 px-4 sm:px-8">
      <div className="font-script text-4xl text-ink-900/80 mb-4 text-center">snapshot</div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-900/50 text-center mb-12">
        field notes · by the numbers
      </p>

      <div className="mx-auto max-w-4xl [perspective:1200px]">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-sm bg-cream-50 shadow-window px-7 py-9 sm:px-12 sm:py-12"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(60,80,110,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(60,80,110,0.09) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        >
          {/* notebook margin rule */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-8 sm:left-12 w-px bg-accent-coral/40"
          />
          {/* washi tape */}
          <span
            aria-hidden
            className="absolute -top-3 left-10 w-24 h-6 bg-accent-mint/60 rotate-[-7deg] shadow-sm"
          />
          <span
            aria-hidden
            className="absolute -top-3 right-12 w-20 h-6 bg-accent-yellow/60 rotate-[5deg] shadow-sm"
          />

          {/* page header */}
          <div className="flex items-end justify-between mb-8 pl-6">
            <div className="font-script text-3xl text-ink-900 leading-none">field notes</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-900/45">
              fig. 01–05 · 06 / 2026
            </div>
          </div>

          <div className="pl-6 grid gap-x-12 gap-y-10 lg:grid-cols-2">
            {/* users growth */}
            <div>
              <FieldLabel>fig. 01 · users</FieldLabel>
              <div className="flex items-end gap-5">
                <div className="flex items-end gap-1.5 h-24">
                  {growth.map((h, i) => (
                    <div
                      key={i}
                      className="w-5 bg-ink-900/85 rounded-t-[2px]"
                      style={{
                        height: live ? `${h}%` : '0%',
                        transition: `height .8s cubic-bezier(.2,.7,.2,1) ${i * 0.07}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="relative">
                  <span className="font-script text-5xl text-ink-900 leading-none">{usersBig}</span>
                  <span className="block font-script text-lg text-accent-coral mt-1 -rotate-3">
                    ↗ organic
                  </span>
                </div>
              </div>
            </div>

            {/* retention — circled in red pen */}
            <div>
              <FieldLabel>fig. 02 · retention</FieldLabel>
              <div className="flex items-center gap-5">
                <div className="relative inline-flex items-center justify-center px-3 py-1">
                  <svg
                    viewBox="0 0 120 80"
                    className="absolute inset-0 w-full h-full overflow-visible"
                    aria-hidden
                  >
                    <ellipse
                      cx="60"
                      cy="40"
                      rx="52"
                      ry="32"
                      fill="none"
                      stroke="#FF8C7A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={live ? 0 : 1}
                      style={{ transition: 'stroke-dashoffset 1s ease-out .3s', transform: 'rotate(-4deg)', transformOrigin: 'center' }}
                    />
                  </svg>
                  <span className="relative font-mono text-4xl text-ink-900">{retention}%</span>
                </div>
                <span className="font-script text-lg text-ink-900/70 leading-tight">
                  W4 retention
                  <span className="block text-accent-coral text-base">~2× benchmark</span>
                </span>
              </div>

              {/* quick jots */}
              <div className="mt-6 flex gap-8">
                {jots.map((j) => (
                  <div key={j.label} className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl text-ink-900">{j.value}</span>
                    <span className="font-script text-base text-ink-900/60">{j.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* skills — inked bars */}
            <div className="lg:col-span-2">
              <FieldLabel>fig. 03 · skills (self-assessed)</FieldLabel>
              <div className="grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
                {skills.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="font-mono text-[11px] lowercase tracking-wide text-ink-900/70 w-20 shrink-0">
                      {s.label}
                    </span>
                    <div className="flex-1 h-3.5 border border-ink-900/15 rounded-[2px] overflow-hidden bg-cream-100/40">
                      <div
                        className="h-full bg-ink-900/80"
                        style={{
                          width: live ? `${s.value}%` : '0%',
                          transition: `width .9s cubic-bezier(.2,.7,.2,1) ${0.15 + i * 0.06}s`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-ink-900/45 w-7 text-right">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* toolkit — highlighter tags */}
            <div className="lg:col-span-2">
              <FieldLabel>fig. 04 · toolkit</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {toolkit.map((t, i) => (
                  <span
                    key={t}
                    className={`font-mono text-xs text-ink-900 px-2.5 py-1 rounded-sm ${highlighters[i % highlighters.length]}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="font-script text-lg text-ink-900/45 text-center mt-6">
        — from the lab notebook.
      </p>
    </section>
  );
}
