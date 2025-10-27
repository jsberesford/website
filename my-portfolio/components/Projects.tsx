"use client";

import React from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

export default function Projects() {
  const dummy = [
    {
      title: "Personal Website",
      desc: "A modern, responsive portfolio showcasing my work and experience with smooth animations."
    }
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
        {dummy.map((p, i) => (
          <M.div key={i} variants={card} className="card-stack">
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
            <div className="exp-card p-6 w-full max-w-xl">
              <div>
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-slate-700 mt-2">{p.desc}</p>
                <div className="mt-4 flex gap-2">
                  <a className="text-xs px-3 py-1 rounded-full bg-amber-50 text-slate-900 hover:bg-amber-100 transition">View</a>
                  <a className="text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-900 hover:bg-slate-50 transition">Source</a>
                </div>
              </div>
            </div>
          </M.div>
        ))}
      </M.div>
    </div>
  );
}
