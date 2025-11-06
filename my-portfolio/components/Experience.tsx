"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

export default function Experience() {
  const [openEduIndex, setOpenEduIndex] = useState<number | null>(null);
  const [openExpIndex, setOpenExpIndex] = useState<number | null>(null);

  const education = [
    {
      school: "Georgia State University",
      degree: "B.S. in Computer Science",
      period: "Expected May 2028",
      details: [
        "Coursework: Computer Science Principles II, Calculus II, Discrete Math",
        "GPA: 3.82",
        "Involvement: Startup Executive of PROGSU",
      ],
    },
  ];

  const items = [
    {
      role: "Founder",
      company: "Alphora",
      period: "Sep 2025 - Present",
      details: [
        "Architected mobile learning platform with React Native + Expo, PostgresSQL, and Supabase, enabling over 100 interactive quizzes with stateless scaling",
        "Implemented secure user auth/session model with live data syncing using Supabase Auth and PostgreSQL for progress sync and streaks, maintaining ~100 users with a 20% retention",
        "Set up a CI/CD workflow using GitHub Actions to automatically build and deploy web assets to GitHub pages on every merge to main, cutting deployment time from ~4 minutes to under two minutes using build caching",
      ],
    },
    {
      role: "Software Engineering Intern",
      company: "Premium Food Service",
      period: "Aug 2024 - Present",
      details: [
        "Engineered full-stack inventory management software with React.js, Supabase, and Azure, enabling real-time data sync and automated low stock alerts for over 500 SKUs",
        "Architected a Linux-Based RAID file server with NGINX and Samba, containerized via Docker Compose, providing high-availability and encrypted access for all staff workstations",
        "Implemented CI/CD pipelines with GitHub Actions and Docker, automating build/test/deploy workflows to staging servers and reducing release lead time from over 24 hours to under 30 minutes",
      ],
    },
    {
      role: "Frontend Engineering Intern",
      company: "Gwinnett County Government",
      period: "May 2024 - Dec 2024",
      details: [
        "Optimized SEO through analyzing Lighthouse and Google Analytics, implementing Long-Tail keywords, and updating meta to align with best SEO practices, increasing overall website traffic by 15%",
        "Refactored UI architecture to support modular design patterns, reducing bundle size by ~25% and improving developer productivity",
        "Refactored frontend architecture for responsive, mobile-first performance, integrating React components with REST-based WordPress endpoints via Axios and async hooks, improving page load speed by 40%",
      ],
    },
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
        {/* Education section (moved above Experience) */}
        {education.map((ed, j) => (
          <M.div
            key={`edu-${j}`}
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="card-stack w-full"
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
                    },
                  }}
                />
              </svg>
            </span>
            <div className="exp-card p-6 w-full">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{ed.school}</h3>
                  <p className="text-sm text-slate-700">{ed.degree}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-600">{ed.period}</div>
                  <div>
                    <button
                      aria-expanded={openEduIndex === j}
                      aria-controls={`edu-details-${j}`}
                      onClick={() => setOpenEduIndex(openEduIndex === j ? null : j)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md border bg-white text-sm text-slate-600 hover:shadow-md focus:outline-none"
                      title="Toggle education details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <M.div
                id={`edu-details-${j}`}
                initial={false}
                animate={openEduIndex === j ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.33 }}
                style={{ overflow: 'hidden' }}
                className="mt-4 text-sm text-slate-700"
              >
                {ed.details && (
                  <ul className="list-disc pl-4 space-y-2">
                    {ed.details.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                )}
              </M.div>
            </div>
          </M.div>
        ))}

        <h2 className="text-2xl font-bold mb-4 gradient-text">Experience</h2>

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
                    },
                  }}
                />
              </svg>
            </span>
            <div className="exp-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{it.role}</h3>
                  <p className="text-sm text-slate-700">{it.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-600">{it.period}</div>
                  <div>
                    <button
                      aria-expanded={openExpIndex === i}
                      aria-controls={`exp-details-${i}`}
                      onClick={() => setOpenExpIndex(openExpIndex === i ? null : i)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md border bg-white text-sm text-slate-600 hover:shadow-md focus:outline-none"
                      title="Toggle details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              {/* Inline expandable content that animates the card size and pushes content below */}
              <M.div
                id={`exp-details-${i}`}
                initial={false}
                animate={openExpIndex === i ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                style={{ overflow: 'hidden' }}
                className="mt-4 text-sm text-slate-700"
              >
                {it.details && (
                  <ul className="list-disc pl-4 space-y-2">
                    {it.details.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                )}
              </M.div>
            </div>
          </M.div>
        ))}
      </div>
    </div>
  );
}
