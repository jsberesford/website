"use client";

import React from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

export default function Experience() {
  const items = [
    { role: "Founder", company: "Alphora", period: "2023 - Present" },
    { role: "Software Engineering Intern", company: "Premium Food Service", period: "Feb 2025 - Present" }
  ];

  const item = {
    hidden: {
      opacity: 0,
      y: 28,
      scale: 0.96,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.22, 0.9, 0.3, 1.02],
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 gradient-text">Experience</h2>
  <div className="space-y-6 md:space-y-8">
        {items.map((it, i) => (
          <M.div
            key={i}
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="card-stack"
          >
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
            <div className="exp-card p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-semibold">{it.role}</h3>
                  <p className="text-sm text-slate-700">{it.company}</p>
                </div>
                <div className="text-sm text-slate-600">{it.period}</div>
              </div>
            </div>
          </M.div>
        ))}
      </div>
    </div>
  );
}
