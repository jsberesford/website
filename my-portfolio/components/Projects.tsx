"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

export default function Projects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const projects = [
    {
      title: "Personal Website – Github | Demo",
      tech: "HTML, CSS, JavaScript, Tailwind CSS",
      desc: "Developed a personal website using HTML, CSS, and JavaScript with a user-friendly interface as well as full responsiveness on both mobile and desktop",
      bullets: [
        "Implemented custom-prompted version of GPT-3.5 to enable real time support for users, including responding to common queries and quickly accessing information per the user’s request",
        "Ensured SEO best practices to maximize website visibility",
      ],
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const card = {
    hidden: {
      y: 28,
      opacity: 0,
      scale: 0.96,
    },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 0.9, 0.3, 1.02],
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Projects</h2>
      <M.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-6 justify-items-center"
      >
        {projects.map((p, i) => (
          <M.div key={i} variants={card} className="card-stack w-full max-w-xl">
            <span className="card-shadow" aria-hidden />
            <span className="card-outline" aria-hidden>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <M.path
                  className="card-outline__stroke"
                  d="M 2 16 L 2 2 L 84 2 L 98 2 L 98 16 L 98 84 L 98 98 L 84 98 L 16 98 L 2 98 L 2 84 L 2 16"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileHover={{
                    pathLength: 1,
                    opacity: [0, 0.85, 0.85, 0],
                    transition: {
                      pathLength: { duration: 1.8, ease: "linear" },
                      opacity: { duration: 1.8, times: [0, 0.1, 0.9, 1] },
                    }
                  }}
                />
              </svg>
            </span>
            <div className="exp-card p-6 w-full">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
                  <div className="text-xs text-slate-600 mb-2">{p.tech}</div>
                  <p className="text-sm text-slate-700">{p.desc}</p>
                </div>
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    aria-expanded={openIndex === i}
                    aria-controls={`proj-details-${i}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md border bg-white text-sm text-slate-600 hover:shadow-md focus:outline-none"
                    title="Toggle project details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <M.div
                id={`proj-details-${i}`}
                initial={false}
                animate={openIndex === i ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.33 }}
                style={{ overflow: 'hidden' }}
                className="mt-4 text-sm text-slate-700"
              >
                {p.bullets && (
                  <ul className="list-disc pl-4 space-y-2">
                    {p.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex gap-2">
                  <a className="text-xs px-3 py-1 rounded-full bg-amber-50 text-slate-900 hover:bg-amber-100 transition">View</a>
                  <a className="text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-900 hover:bg-slate-50 transition">Source</a>
                </div>
              </M.div>
            </div>
          </M.div>
        ))}
      </M.div>
    </div>
  );
}
