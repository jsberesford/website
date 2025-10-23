"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          YOUR NAME
        </Link>
        <div className="hidden gap-6 sm:flex">
          <a href="#projects" className="opacity-80 transition-opacity hover:opacity-100">Projects</a>
          <a href="#experience" className="opacity-80 transition-opacity hover:opacity-100">Experience</a>
          <a href="#contact" className="opacity-80 transition-opacity hover:opacity-100">Contact</a>
        </div>
        <div className="flex items-center gap-2">
          <a href="#contact" className="hidden sm:block">
            <Button size="sm" variant="secondary">Let’s talk</Button>
          </a>
        </div>
      </nav>
    </header>
  );
}
