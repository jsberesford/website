'use client';

// WorkSection ("Case Files"): product work shown as manila folders in an open
// drawer. A row of folder tabs switches the active file; the selected file's
// "document" — a typed case study (Problem → What I did → Outcome) — slides into
// view inside the open folder. Reuses the desk-object metaphor from the hero
// (the yellow folder) and the site's kraft / cream / accent palette + mono labels.
//
// ───────────────────────────────────────────────────────────────────────────
// SAMPLE CONTENT. Replace the `caseFiles` array below with your real work.
// Keep `featured: true` on the one you want recruiters to read first (the
// startup). Each file reads top→bottom: the problem, the calls you made, the
// result. Lead the outcome with a number wherever you have one.
// ───────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CaseFile = {
  name: string;
  tag: string; // category "stamp" on the document
  accent: AccentKey; // colored index sticker on the folder tab
  role: string;
  timeframe: string;
  problem: string;
  approach: string[]; // the product decisions you made
  outcome: string[]; // results — lead each with a number if you have one
  stack: string[];
  links: { label: string; href: string }[];
  featured?: boolean;
};

// Full class strings so Tailwind doesn't purge them.
type AccentKey = 'coral' | 'sky' | 'mint' | 'lilac';
const ACCENT_DOT: Record<AccentKey, string> = {
  coral: 'bg-accent-coral',
  sky: 'bg-accent-sky',
  mint: 'bg-accent-mint',
  lilac: 'bg-accent-lilac',
};

const caseFiles: CaseFile[] = [
  {
    name: 'Cadence',
    tag: 'Founder',
    accent: 'coral',
    role: 'Founder & Product',
    timeframe: '2023 — Present',
    featured: true,
    problem:
      'Students juggle classes, clubs, and shifts across five apps that never talk to each other — so plans quietly fall through the cracks. I set out to make one place that turns a messy week into a plan you actually follow.',
    approach: [
      'Cut the v1 scope to a single loop — import your calendar, get one ranked to-do list — and shipped it in 6 weeks.',
      'Ran weekly interviews with 20 students; killed the social feed when nobody used it twice.',
      'Prioritized by a simple reach × confidence rubric so the roadmap survived contact with real feedback.',
    ],
    outcome: [
      '600+ sign-ups in the first semester, fully organic on campus.',
      '40% week-4 retention — roughly 2× the productivity-app benchmark.',
      'Pitched to and accepted into [accelerator/competition].',
    ],
    stack: ['Figma', 'Notion', 'SQL', 'Mixpanel', 'Next.js'],
    links: [
      { label: 'Live', href: '#' },
      { label: 'Deck', href: '#' },
    ],
  },
  {
    name: 'Northwind Labs',
    tag: 'Product Intern',
    accent: 'sky',
    role: 'Product Management Intern',
    timeframe: 'Summer 2024',
    problem:
      'Onboarding drop-off was the team’s top complaint, but nobody could say where it happened. My job was to find the leak and ship a fix that moved the number.',
    approach: [
      'Built the first funnel dashboard the team had — instrumented 6 steps that were previously dark.',
      'Found a permissions screen where 30% of users bounced; wrote the PRD to defer it.',
      'Partnered with one designer + two engineers to ship behind a flag and A/B test it.',
    ],
    outcome: [
      'Activation up 18% in the test cohort; shipped to 100%.',
      'Funnel dashboard adopted as the team’s weekly review artifact.',
    ],
    stack: ['Amplitude', 'SQL', 'Figma', 'Linear'],
    links: [{ label: 'Case study', href: '#' }],
  },
  {
    name: 'Volt Mobility',
    tag: 'PM Intern',
    accent: 'mint',
    role: 'Associate PM Intern',
    timeframe: 'Summer 2023',
    problem:
      'Support was drowning in the same three rider questions. Leadership wanted to know whether self-serve help was worth building before committing a team to it.',
    approach: [
      'Tagged 500 tickets to size the opportunity — 62% were three repeatable issues.',
      'Prototyped an in-app help flow in Figma and tested it with 12 riders.',
      'Wrote the one-pager that scoped a 2-sprint MVP and got it greenlit.',
    ],
    outcome: [
      'Projected ~25% ticket deflection; MVP handed off to a full-time PM.',
      'Recommendation adopted into the next quarter’s roadmap.',
    ],
    stack: ['Figma', 'Looker', 'Zendesk', 'Notion'],
    links: [{ label: 'One-pager', href: '#' }],
  },
  {
    name: 'Campus Market',
    tag: 'Side Project',
    accent: 'lilac',
    role: 'Solo — design & build',
    timeframe: '2024',
    problem:
      'Buying and selling secondhand on campus lived in chaotic group chats. I wanted to see if a lightweight, school-only marketplace could be cleaner than the status quo.',
    approach: [
      'Scoped to one campus and one category (furniture) to validate before expanding.',
      'Designed and built it solo, end to end, in two weekends.',
      'Seeded listings myself to get past the cold-start problem.',
    ],
    outcome: [
      '120 listings and ~30 completed trades in the first month.',
      'Validated demand; documented what I’d change before scaling.',
    ],
    stack: ['Next.js', 'Supabase', 'Figma', 'Vercel'],
    links: [
      { label: 'Live', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
];

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-900/45 mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

export default function WorkSection() {
  const [active, setActive] = useState(0);
  const file = caseFiles[active];

  return (
    <section id="casefiles" className="relative py-24 sm:py-32 px-4 sm:px-8">
      <p className="font-script text-4xl text-ink-900/80 mb-4 text-center">
        case files
      </p>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-900/50 text-center mb-10">
        selected product work · tap a folder
      </p>

      <div className="mx-auto max-w-5xl">
        {/* Folder tabs */}
        <div className="flex flex-wrap gap-1.5 px-2 relative z-10">
          {caseFiles.map((f, i) => {
            const isActive = i === active;
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={`relative rounded-t-lg border border-b-0 border-ink-900/10 px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-kraft-300 text-ink-900'
                    : 'bg-kraft-200/70 text-ink-700/60 hover:bg-kraft-200 hover:text-ink-700'
                }`}
                style={{ transform: isActive ? 'translateY(1px)' : 'translateY(3px)' }}
              >
                <span
                  aria-hidden
                  className={`inline-block w-2 h-2 rounded-[2px] mr-2 align-middle ${ACCENT_DOT[f.accent]}`}
                />
                {f.name}
                {f.featured && (
                  <span className="ml-1.5 text-accent-coral" aria-hidden>
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Open manila folder */}
        <div className="relative rounded-b-2xl rounded-tr-2xl bg-kraft-300 shadow-card p-2.5 sm:p-4">
          {/* faint folder seam */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-4 top-4 h-px bg-ink-900/10"
          />

          {/* Document sheet */}
          <AnimatePresence mode="wait">
            <motion.article
              key={file.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="bg-cream-50 paper-texture rounded-lg shadow-card p-6 sm:p-10"
            >
              {/* Header: title + role, stamped category */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-900/10 pb-5">
                <div>
                  <h3 className="font-sans font-bold text-2xl sm:text-3xl text-ink-900 leading-none">
                    {file.name}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-700/70 mt-2.5">
                    {file.role} · {file.timeframe}
                  </p>
                </div>
                <span
                  className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] border-2 border-accent-coral text-accent-coral rounded px-2.5 py-1 shrink-0"
                  style={{ transform: 'rotate(-6deg)' }}
                >
                  {file.tag}
                </span>
              </div>

              {/* Body */}
              <div className="mt-6 grid gap-7 sm:grid-cols-[1.4fr_1fr]">
                <div className="space-y-6">
                  <FieldBlock label="Problem">
                    <p className="text-ink-900/85 leading-relaxed text-[15px]">
                      {file.problem}
                    </p>
                  </FieldBlock>

                  <FieldBlock label="What I did">
                    <ul className="space-y-2.5">
                      {file.approach.map((a, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-ink-900/85 leading-relaxed text-[15px]"
                        >
                          <span className="font-mono text-ink-900/35 text-xs mt-1 shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </FieldBlock>
                </div>

                <div className="space-y-6">
                  <FieldBlock label="Outcome">
                    <ul className="space-y-2.5">
                      {file.outcome.map((o, i) => (
                        <li
                          key={i}
                          className="flex gap-2.5 text-ink-900/90 leading-relaxed text-[15px]"
                        >
                          <span
                            aria-hidden
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-coral"
                          />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </FieldBlock>

                  <FieldBlock label="Stack">
                    <div className="flex flex-wrap gap-2">
                      {file.stack.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[11px] text-ink-700 bg-cream-200 border border-ink-900/10 rounded-full px-2.5 py-0.5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </FieldBlock>
                </div>
              </div>

              {/* Links */}
              {file.links.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-3 border-t border-ink-900/10 pt-5">
                  {file.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="inline-flex items-center gap-1.5 bg-ink-900 text-cream-50 font-mono text-xs uppercase tracking-wider px-3.5 py-2 rounded hover:bg-ink-800 transition-colors"
                    >
                      {link.label}
                      <span aria-hidden>↗</span>
                    </a>
                  ))}
                </div>
              )}
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
