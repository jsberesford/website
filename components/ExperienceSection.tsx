'use client';

// ExperienceSection: work history as a stack of admission-ticket stubs — the
// readable, list-oriented cousin of the coral hero ticket (TicketCard). Each
// stint is a cream "ticket" with a torn coral stub carrying a faux barcode +
// serial, so the timeline reads as a row of event tickets you've collected.
// Echoes the hero's perforation/barcode language without copying its layout.
//
// ───────────────────────────────────────────────────────────────────────────
// SAMPLE CONTENT. Replace the `stints` array with your real history (newest
// first). `category` is the small stamp ("FOUNDER" / "INTERNSHIP" / ...).
// ───────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';

type Stint = {
  org: string;
  role: string;
  dates: string;
  location: string;
  category: string;
  impact: string;
  serial: string;
  rotate: number;
};

const stints: Stint[] = [
  {
    org: 'Premium Food Service',
    role: 'Software Engineering Intern',
    dates: 'Feb 2025 - Present',
    location: 'Snellville, GA',
    category: 'Internship',
    impact:
      'Built an inventory system + dashboard tracking 600+ SKUs across 2 warehouses and 3 kitchens, cutting surplus ~18%; automated $55K/week cost reporting (−40% manual time).',
    serial: '№ 0025',
    rotate: -1.2,
  },
  {
    org: 'Progsu',
    role: 'Vice President',
    dates: 'Sept 2025 - Present',
    location: 'Georgia State · Atlanta',
    category: 'Leadership',
    impact:
      'Lead operations for 500+ members: fiscal decisions, vendor negotiation, and large-scale events (hackathons, workshops, speaker panels).',
    serial: '№ 0042',
    rotate: 0.9,
  },
  {
    org: 'Gwinnett County Sheriff’s Office',
    role: 'Frontend Engineering Intern',
    dates: 'Mar 2024 - Dec 2024',
    location: 'Lawrenceville, GA',
    category: 'Internship',
    impact:
      'Optimized gogcso.com for 700+ staff (+22% session time, −18% bounce) and shipped a campaign that lifted engagement 30% and followers 40%.',
    serial: '№ 0024',
    rotate: -0.8,
  },
];

// Irregular bar widths (px) so the faux barcode scans as real, like TicketCard.
const BARCODE = [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 2];

function Ticket({ stint, index }: { stint: Stint; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, rotate: stint.rotate }}
      whileInView={{ opacity: 1, y: 0, rotate: stint.rotate }}
      whileHover={{ rotate: 0, y: -4 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
      className="relative flex w-full max-w-2xl items-stretch shadow-card rounded-md font-mono"
    >
      {/* Main body — cream paper, ink text */}
      <div className="flex-1 bg-cream-50 border border-ink-900/10 border-r-0 rounded-l-md px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-ink-900/60">
            <span className="border border-ink-900/40 px-1.5 py-[2px]">Admit One</span>
            <span className="text-accent-coral">{stint.category}</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-ink-700/70">
            {stint.dates}
          </span>
        </div>

        <div className="font-sans font-bold text-xl sm:text-2xl tracking-wide leading-none mt-3 text-ink-900">
          {stint.org}
        </div>

        <div className="text-[10px] uppercase tracking-[0.25em] mt-2 text-ink-700/80">
          {stint.role}
          <span className="text-ink-900/30"> · </span>
          {stint.location}
        </div>

        <p className="font-sans text-[15px] leading-relaxed text-ink-900/80 mt-3">
          {stint.impact}
        </p>
      </div>

      {/* Perforation: dashed line + two punched notches (page-bg colored) */}
      <div className="relative w-0 self-stretch z-10">
        <span className="absolute inset-y-3 left-0 border-l-2 border-dashed border-ink-900/25" />
        <span className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-cream-100" />
        <span className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-cream-100" />
      </div>

      {/* Tear-off stub — coral, echoing the hero ticket */}
      <div className="bg-accent-coral text-cream-50 rounded-r-md px-4 py-5 flex flex-col items-center justify-center gap-2 shrink-0">
        <div className="flex items-stretch gap-[2px] h-8">
          {BARCODE.map((w, i) => (
            <span key={i} className="block bg-cream-50" style={{ width: `${w}px` }} />
          ))}
        </div>
        <div className="text-[8px] tracking-[0.25em] text-cream-50/85">{stint.serial}</div>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  return (
    <section id="experience" className="relative py-24 sm:py-32 px-4 sm:px-8">
      <p className="font-script text-4xl text-ink-900/80 mb-4 text-center">
        experience
      </p>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-900/50 text-center mb-12">
        admit one · the short version
      </p>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-7">
        {stints.map((stint, i) => (
          <Ticket key={stint.serial} stint={stint} index={i} />
        ))}
      </div>
    </section>
  );
}
