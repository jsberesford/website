'use client';

// AboutSection: combines a tactile "sticky note" object with a large typographic
// statement. The sticky note tilts on hover via framer-motion to reinforce the
// physical metaphor, while pill-highlighted keywords in mono type create a
// scannable, editorial rhythm beneath it.

import React from 'react';
import { motion } from 'framer-motion';

const pillBase =
  'inline-block px-3 py-0.5 rounded-full border-2 border-ink-900';

function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 px-4 sm:px-8"
    >
      <motion.div
        whileHover={{ rotate: -1, y: -4 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="relative bg-accent-yellow text-ink-900 shadow-sticky p-8 max-w-xl mx-auto font-sans text-lg leading-relaxed -rotate-2"
      >
        <span
          aria-hidden
          className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-[60px] h-5 bg-ink-900/10"
          style={{ transform: 'translateX(-50%) rotate(4deg)' }}
        />
        <p>
          [YOUR_BIO_SENTENCE_ONE] [YOUR_BIO_SENTENCE_TWO] [YOUR_BIO_SENTENCE_THREE]
        </p>
      </motion.div>

      <p className="font-mono text-2xl sm:text-4xl leading-relaxed max-w-3xl mx-auto mt-20 text-center text-ink-900">
        I make{' '}
        <span
          className={`${pillBase} bg-accent-yellow`}
          style={{ transform: 'rotate(-1deg)' }}
        >
          interfaces
        </span>{' '}
        that feel like{' '}
        <span
          className={`${pillBase} bg-accent-mint`}
          style={{ transform: 'rotate(2deg)' }}
        >
          tools
        </span>
        , not{' '}
        <span
          className={`${pillBase} bg-accent-coral`}
          style={{ transform: 'rotate(-1deg)' }}
        >
          forms
        </span>
        . I sweat{' '}
        <span
          className={`${pillBase} bg-accent-lilac`}
          style={{ transform: 'rotate(1deg)' }}
        >
          typography
        </span>
        , obsess over{' '}
        <span
          className={`${pillBase} bg-accent-sky`}
          style={{ transform: 'rotate(-1deg)' }}
        >
          latency
        </span>
        , and ship.
      </p>
    </section>
  );
}

export default AboutSection;
