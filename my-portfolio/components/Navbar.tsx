"use client";

import Link from "next/link";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-medium text-lg text-slate-900">Jared</Link>

        <div className="hidden gap-6 sm:flex items-center text-sm">
          <a href="#projects" className="text-slate-700 hover:underline">Projects</a>
          <a href="#experience" className="text-slate-700 hover:underline">Experience</a>
          <a href="#contact" className="text-slate-700 hover:underline">Contact</a>
        </div>
      </nav>
    </header>
  );
}
