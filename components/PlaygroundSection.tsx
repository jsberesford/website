'use client';

// Layout technique: a "pinboard" of project cards on a kraft surface. Each card
// is draggable via framer-motion `drag`, constrained to the board ref so cards
// can't escape. `whileDrag` lifts the card (scale + shadow + straighten rotation),
// raises z-index, and hides the tooltip so the interaction feels physical.
// On lg+ cards start at hand-picked absolute coords for a scattered look; on
// smaller screens they flow with `flex-wrap` so the layout still reads — drag
// still works in either mode.

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Project = {
  name: string;
  blurb: string;
  img: string;
  rot: number;
  top: string;
  left: string;
  w: string;
  href?: string;
};

const projects: Project[] = [
  { name: "Ray's on the River", blurb: 'Dinner at my favorite restaurant', img: '/images/playground-1.jpg', rot: -7, top: '4%',  left: '4%',  w: 'w-56' },
  { name: 'Ariana Grande Concert', blurb: 'My favorite artist', img: '/images/playground-2.jpg', rot:  4, top: '8%',  left: '34%', w: 'w-72' },
  { name: 'My best friend', blurb: 'Eda Mai', img: '/images/playground-3.jpg', rot: -3, top: '6%',  left: '62%', w: 'w-64', href: 'https://www.linkedin.com/in/edamai/' },
  { name: 'Cooking Skills', blurb: 'Creamy garlic cajun shrimp', img: '/images/playground-6.jpg', rot:  8, top: '46%', left: '8%',  w: 'w-60' },
  { name: 'Jamaica', blurb: 'Recent vacation', img: '/images/playground-5.jpg', rot: -5, top: '56%', left: '36%', w: 'w-56' },
  { name: 'Friends', blurb: 'Friends', img: '/images/playground-4.jpg', rot:  6, top: '50%', left: '66%', w: 'w-56' },
];

export default function PlaygroundSection() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  // Track the highest z-index used, so the last picked-up card always sits on top.
  const [topZ, setTopZ] = useState(10);
  const [zFor, setZFor] = useState<Record<number, number>>({});

  const bringToFront = (i: number) => {
    const next = topZ + 1;
    setTopZ(next);
    setZFor((prev) => ({ ...prev, [i]: next }));
  };

  return (
    <section id="off-the-clock" className="relative py-24 sm:py-32 px-4 sm:px-8">
      <p className="font-script text-6xl text-ink-900/80 mb-4 text-center">off the clock</p>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-900/50 text-center mb-8">
        a peek into life beyond the desk
      </p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        ref={boardRef}
        className="relative mx-auto max-w-6xl rounded-3xl bg-kraft-200 paper-texture shadow-card p-8 sm:p-12 min-h-[680px]"
      >
        <span className="font-script text-xl text-ink-900/40 absolute top-4 right-6 pointer-events-none select-none">
          drag me →
        </span>

        <div className="relative flex flex-wrap gap-4 justify-center lg:block lg:h-[580px]">
          {projects.map((project, i) => {
            const isDragging = dragging === i;
            const showTooltip = hovered === i && !isDragging;

            return (
              <motion.div
                key={project.name + i}
                drag
                dragConstraints={boardRef}
                dragElastic={0.15}
                dragMomentum={false}
                onDragStart={() => {
                  setDragging(i);
                  bringToFront(i);
                }}
                onDragEnd={() => setDragging(null)}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered((cur) => (cur === i ? null : cur))}
                onTapStart={() => bringToFront(i)}
                style={{
                  rotate: `${project.rot}deg`,
                  top: project.top,
                  left: project.left,
                  zIndex: zFor[i] ?? 10,
                }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 18px 36px -12px rgba(0,0,0,0.35)',
                }}
                whileDrag={{
                  scale: 1.08,
                  rotate: 0,
                  boxShadow: '0 30px 60px -15px rgba(0,0,0,0.55)',
                  cursor: 'grabbing',
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className={`static lg:absolute ${project.w} bg-cream-50 p-2 pb-3 rounded-lg shadow-card cursor-grab active:cursor-grabbing select-none touch-none`}
              >
                <div className="relative">
                  <img
                    src={project.img}
                    alt={project.name}
                    draggable={false}
                    className="w-full aspect-[4/3] object-cover rounded-md bg-cream-200 pointer-events-none"
                  />
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-3 -top-9 bg-ink-900 text-cream-50 text-xs font-mono px-2 py-1 rounded shadow-card whitespace-nowrap z-30 pointer-events-none"
                      >
                        {project.blurb}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="font-mono text-xs uppercase tracking-wider text-ink-900/70 mt-2 px-1">
                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onPointerDown={(e) => e.stopPropagation()}
                      className="pointer-events-auto underline decoration-dotted hover:text-ink-900"
                    >
                      {project.name}
                    </a>
                  ) : (
                    project.name
                  )}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
