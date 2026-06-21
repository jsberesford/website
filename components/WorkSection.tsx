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
    name: 'Shelfboss',
    tag: 'Full-stack',
    accent: 'coral',
    role: 'Solo — design & build',
    timeframe: '2026',
    featured: true,
    problem:
      'Small food operations run inventory and orders on spreadsheets that fall apart under concurrent edits. Shelfboss is a full-stack system that replaces them.',
    approach: [
      'Architected it on Next.js 14 (App Router) with TypeScript, server components, and route handlers, backed by PostgreSQL via Prisma on a normalized relational schema.',
      'Used Prisma transactional writes for stock mutations to prevent race conditions on concurrent inventory adjustments and keep order and stock tables consistent.',
      'Set up CI/CD and production on Vercel — environment-scoped secrets, edge-cached assets, and serverless API routes.',
    ],
    outcome: [
      'Consistent order/stock state under concurrent adjustments — no race conditions.',
      'Resolved an App Router deploy failure by migrating off a static-only host.',
    ],
    stack: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'Vercel'],
    links: [
      { label: 'Live', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
  {
    name: 'Flowdate',
    tag: 'Side Project',
    accent: 'sky',
    role: 'Solo — design & build',
    timeframe: 'Aug — Dec 2025',
    problem:
      'Turning “lunch with Sam next Tuesday at 1” into a real calendar event still means manual entry. Flowdate lets natural language do it.',
    approach: [
      'Architected an NL pipeline that parses time, date, duration, and location from free text into validated JSON.',
      'Returned structured fallback options when the input is ambiguous instead of failing.',
      'Integrated with calendar APIs to create events automatically.',
    ],
    outcome: [
      'Sub-300ms average parse latency.',
      'Saves ~5 hrs/quarter across a dozen weekly events.',
    ],
    stack: ['TypeScript', 'FastAPI', 'Python', 'Calendar APIs'],
    links: [{ label: 'Website', href: '#' }],
  },
  {
    name: 'Progsu Operations System',
    tag: 'Ops Project',
    accent: 'mint',
    role: 'Club VP project',
    timeframe: 'Jan 2026 — Present',
    problem:
      'A 300-person, 12-hour hackathon has dozens of moving parts and no clear owners — a recipe for day-of failures. I built the system that runs it.',
    approach: [
      'Designed a structured run-of-show and task-delegation framework.',
      'Created ownership matrices so every responsibility had a named owner.',
      'Wrote risk-mitigation plans for room access, A/V, food timing, and workshop transitions.',
    ],
    outcome: [
      'Cut execution errors and responsibility gaps ~20%.',
      'Prevented day-of bottlenecks across the full 12-hour event.',
    ],
    stack: ['Notion', 'Excel', 'Google Workspace'],
    links: [{ label: 'Website', href: '#' }],
  },
  {
    name: 'Hacklanta',
    tag: 'Hackathon',
    accent: 'lilac',
    role: 'VP, Operations · Progsu',
    timeframe: 'Jan 2026 — Present',
    problem:
      'Progsu set out to run its hackathon — 300+ attendees, a full day of programming — with no operational playbook to lean on.',
    approach: [
      'Coordinated 30 volunteers across 6 minigames and workshops.',
      'Managed a $7,500 budget across a 12-hour run of show.',
      'Owned logistics, vendor coordination, and day-of execution end to end.',
    ],
    outcome: [
      '300+ attendees over a 12-hour event.',
      'Delivered on a $7,500 budget with 30 volunteers.',
    ],
    stack: ['Notion', 'Google Workspace', 'Trello'],
    links: [{ label: 'Website', href: '#' }],
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
