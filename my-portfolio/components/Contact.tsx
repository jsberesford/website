"use client";

import React from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 gradient-text">Contact</h2>
      <M.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl glass">
        <p className="text-slate-700">Email: <a className="underline" href="mailto:jared@example.com">jared@example.com</a></p>
        <p className="text-slate-700 mt-2">Or reach out on LinkedIn / Twitter — links coming soon.</p>
        <div className="mt-4">
          <a href="mailto:jared@example.com" className="inline-block px-4 py-2 bg-amber-500 text-slate-900 rounded-lg">Shoot an email</a>
        </div>
      </M.div>
    </div>
  );
}
