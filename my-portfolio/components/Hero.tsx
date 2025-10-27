"use client";

import React from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;
import ProfilePicture from "@/components/ProfilePicture";
import Typewriter from "@/components/Typewriter";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft glowy background blobs */}
      <div className="hero-blobs" aria-hidden>
        <span className="blob one" />
        <span className="blob two" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-28 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="md:pr-8 order-2 md:order-1">
            <M.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-6xl md:text-7xl font-extrabold display leading-tight">Hi there</h1>

              <p className="mt-4 text-xl md:text-2xl text-slate-700">
                <Typewriter
                  phrases={["I'm Jared Beresford.", "Welcome to my website."]}
                  typingSpeed={62}
                  deletingSpeed={28}
                  pause={1500}
                  showCaret
                />
              </p>

              <p className="mt-6 max-w-xl text-lg text-slate-700">
                I design and build delightful web experiences with thoughtful motion, polish, and accessibility baked in.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <a href="#projects" className="btn btn--ghost">See projects</a>
                <a href="#contact" className="btn btn--contact">Contact</a>
              </div>
            </M.div>
          </div>

          <div className="flex items-start justify-center md:justify-end order-1 md:order-2">
            <M.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
              <ProfilePicture size={224} />
            </M.div>
          </div>
        </div>
      </div>
    </section>
  );
}
