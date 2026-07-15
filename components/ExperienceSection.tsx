'use client';

// ExperienceSection: work history as a stack of admission-ticket stubs — the
// readable, list-oriented cousin of the coral hero ticket (TicketCard). Each
// stint is a cream "ticket" with a coral stub carrying a faux barcode +
// serial, so the timeline reads as a row of event tickets you've collected.
// Echoes the hero's perforation/barcode language without copying its layout.
//
// Tickets stay at their natural, compact size — full detail (narrative,
// highlight bullets, stack, links) opens in a portal-rendered modal instead
// of expanding/flipping the card in place, so the list never reflows or
// balloons to fit hidden content.

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

type Stint = {
  org: string;
  role: string;
  dates: string;
  location: string;
  category: string;
  impact: string;
  serial: string;
  rotate: number;
  narrative?: string;
  highlights?: string[];
  stack?: string[];
  links?: { label: string; href: string }[];
};

const stints: Stint[] = [
  {
    org: 'Premium Food Service',
    role: 'Software Engineering Intern',
    dates: 'Feb 2025 - Present',
    location: 'Lawrenceville, GA',
    category: 'Internship',
    impact:
      'Engineered a full-stack inventory system with React, Supabase, and Azure for 500+ SKUs, backed by a containerized Docker, NGINX, and Linux infrastructure and a GitHub Actions CI/CD pipeline that cut release lead time from 24+ hours to under 30 minutes.',
    serial: '№ 0025',
    rotate: -1.2,
    highlights: [
      'Engineered full-stack inventory management software with React.js, Supabase, and Azure, enabling real-time data sync and automated low-stock alerts for 500+ SKUs.',
      'Designed and deployed a containerized backend infrastructure using Docker Compose, NGINX, and Linux, implementing fault-tolerant storage and secure file access to support internal applications and development workflows.',
      'Implemented CI/CD pipelines with GitHub Actions and Docker, automating build, test, and deploy workflows to staging servers, reducing release lead time from over 24 hours to under 30 minutes.',
    ],
    stack: ['React', 'Supabase', 'Azure', 'Docker'],
  },
  {
    org: 'Progsu',
    role: 'Vice President',
    dates: 'Sept 2025 - Present',
    location: 'Georgia State · Atlanta',
    category: 'Leadership',
    impact:
      'Directed Progsu’s first hackathon, Hacklanta, to 400+ attendees and $20,000+ in corporate sponsorships, leading a 20+ person executive team through a 5-week planning timeline.',
    serial: '№ 0042',
    rotate: 0.9,
    highlights: [
      'Directed operations as Vice President for Progsu’s first hackathon, Hacklanta, achieving 400+ attendees by building end-to-end infrastructure, including logistics, financials, vendor coordination, and the run of show.',
      'Secured $20,000+ in corporate sponsorships for a first-year hackathon by developing and pitching a compelling sponsorship package to industry partners, then maintaining those relationships for the following event.',
      'Onboarded and managed a 20+ person executive team across logistics, growth, and technical, delegating responsibilities and maintaining team alignment under a 5-week planning timeline.',
    ],
    stack: ['Event Ops', 'Sponsorship', 'Team Leadership'],
  },
  {
    org: 'Gwinnett County Government',
    role: 'Frontend Engineering Intern',
    dates: 'Mar 2024 - Dec 2024',
    location: 'Lawrenceville, GA',
    category: 'Internship',
    impact:
      'Refactored the department’s WordPress frontend for responsive, mobile-first performance, integrating React with REST endpoints via Axios to cut page load time 40%, while SEO and modular UI work lifted traffic 15% and cut bundle size ~25%.',
    serial: '№ 0024',
    rotate: -0.8,
    highlights: [
      'Optimized SEO by analyzing Lighthouse and Google Analytics data, implementing long-tail keywords, and updating meta tags to align with best practices, increasing overall website traffic by 15%.',
      'Streamlined UI architecture to support modular design patterns, reducing bundle size by ~25% and improving developer productivity.',
      'Refactored frontend architecture for responsive, mobile-first performance, integrating React components with REST-based WordPress endpoints via Axios and async hooks, improving page load speed by 40%.',
    ],
    stack: ['React', 'Axios', 'WordPress', 'SEO'],
  },
];

// Irregular bar widths (px) so the faux barcode scans as real, like TicketCard.
const BARCODE = [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 2];

function Stub({ serial }: { serial: string }) {
  return (
    <>
      {/* Perforation: dashed line + two punched notches (page-bg colored) */}
      <div className="relative w-0 self-stretch z-10">
        <span className="absolute inset-y-3 left-0 border-l-2 border-dashed border-ink-900/25" />
        <span className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-cream-100" />
        <span className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-cream-100" />
      </div>

      {/* Tear-off stub — coral, echoing the hero ticket. Repeating stripe
          texture instead of a flat fill so it reads as printed security
          paper rather than a blank block of color. */}
      <div className="barcode-fill bg-accent-coral text-cream-50 rounded-r-md px-5 py-6 flex flex-col items-center justify-center gap-2 shrink-0">
        <div className="flex items-stretch gap-[2px] h-9 bg-accent-coral px-1.5 py-1 rounded-sm shadow-sm">
          {BARCODE.map((w, i) => (
            <span key={i} className="block bg-cream-50" style={{ width: `${w}px` }} />
          ))}
        </div>
        <div className="text-[9px] tracking-[0.25em] text-cream-50/85 bg-accent-coral px-1.5 rounded-sm">
          {serial}
        </div>
      </div>
    </>
  );
}

function Ticket({
  stint,
  index,
  onOpen,
}: {
  stint: Stint;
  index: number;
  onOpen: () => void;
}) {
  const hasDetail = Boolean(stint.narrative || stint.highlights?.length || stint.stack?.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, rotate: stint.rotate }}
      whileInView={{ opacity: 1, y: 0, rotate: stint.rotate }}
      whileHover={{ rotate: 0, y: -4 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
      onClick={hasDetail ? onOpen : undefined}
      onKeyDown={
        hasDetail
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen();
              }
            }
          : undefined
      }
      role={hasDetail ? 'button' : undefined}
      tabIndex={hasDetail ? 0 : undefined}
      aria-haspopup={hasDetail ? 'dialog' : undefined}
      className={`relative flex w-full max-w-3xl items-stretch shadow-card rounded-md font-mono ${
        hasDetail ? 'cursor-pointer' : ''
      }`}
    >
      {/* Main body — cream paper, ink text */}
      <div className="flex-1 bg-cream-50 border border-ink-900/10 border-r-0 rounded-l-md px-7 sm:px-8 py-6 sm:py-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-900/60">
            <span className="border border-ink-900/40 px-1.5 py-[2px]">Admit One</span>
            <span className="text-accent-coral">{stint.category}</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-ink-700/70">
            {stint.dates}
          </span>
        </div>

        <div className="font-sans font-bold text-2xl sm:text-3xl tracking-wide leading-none mt-4 text-ink-900">
          {stint.org}
        </div>

        <div className="text-[11px] uppercase tracking-[0.25em] mt-2.5 text-ink-700/80">
          {stint.role}
          <span className="text-ink-900/30"> · </span>
          {stint.location}
        </div>

        <p className="font-sans text-base leading-relaxed text-ink-900/80 mt-4">
          {stint.impact}
        </p>

        {hasDetail && (
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-accent-coral bg-accent-coral/15 border border-accent-coral/30 rounded-full px-3 py-1.5">
            full story
            <span aria-hidden>↗</span>
          </span>
        )}
      </div>

      <Stub serial={stint.serial} />
    </motion.div>
  );
}

function TicketModal({ stint, onClose }: { stint: Stint | null; onClose: () => void }) {
  useEffect(() => {
    if (!stint) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [stint, onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {stint && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink-900/70"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${stint.org}: full story`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] shadow-window rounded-md font-mono"
          >
            <div className="h-full max-h-[85vh] overflow-y-auto bg-cream-50 border border-ink-900/10 rounded-md px-7 sm:px-9 py-7 sm:py-9">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-900/60">
                  <span className="border border-ink-900/40 px-1.5 py-[2px]">Admit One</span>
                  <span className="text-accent-coral">{stint.category}</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="text-ink-900/50 hover:text-ink-900 transition-colors text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              <div className="font-sans font-bold text-2xl sm:text-3xl tracking-wide leading-none mt-4 text-ink-900">
                {stint.org}
              </div>

              <div className="text-[11px] uppercase tracking-[0.25em] mt-2.5 text-ink-700/80">
                {stint.role}
                <span className="text-ink-900/30"> · </span>
                {stint.location}
                <span className="text-ink-900/30"> · </span>
                {stint.dates}
              </div>

              <p className="font-sans text-base leading-relaxed text-ink-900/80 mt-5">
                {stint.impact}
              </p>

              <div className="mt-5 pt-5 border-t border-dashed border-ink-900/15 space-y-4">
                {stint.narrative && (
                  <p className="font-sans text-[15px] leading-relaxed text-ink-900/75">
                    {stint.narrative}
                  </p>
                )}

                {stint.highlights && stint.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {stint.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-ink-900/85 leading-relaxed text-sm font-sans"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-coral"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {stint.stack && stint.stack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {stint.stack.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] text-ink-700 bg-cream-200 border border-ink-900/10 rounded-full px-2.5 py-0.5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {stint.links && stint.links.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {stint.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-900 underline decoration-ink-900/30 hover:decoration-ink-900 transition-colors"
                      >
                        {link.label}
                        <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function ExperienceSection() {
  const [active, setActive] = useState<Stint | null>(null);

  return (
    <section id="experience" className="relative py-24 sm:py-32 px-4 sm:px-8">
      <p className="font-script text-6xl text-ink-900/80 mb-4 text-center">
        experience
      </p>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-900/50 text-center mb-12">
        admit one · tap a ticket for the full story
      </p>

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        {stints.map((stint, i) => (
          <Ticket key={stint.serial} stint={stint} index={i} onOpen={() => setActive(stint)} />
        ))}
      </div>

      <TicketModal stint={active} onClose={() => setActive(null)} />
    </section>
  );
}
