"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // determine initial theme: localStorage -> prefers-color-scheme -> light
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        setIsDark(true);
        return;
      }
      if (saved === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        setIsDark(false);
        return;
      }
    } catch (e) {
      /* ignore storage errors */
    }

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    setIsDark(prefersDark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch (e) {
      // ignore
    }
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-medium text-lg fade-color-transition" style={{ color: "var(--text-strong)" }}>
          Jared
        </Link>

        <div className="hidden gap-6 sm:flex items-center text-sm">
          <a href="#projects" className="hover:underline fade-color-transition" style={{ color: "var(--text-muted)" }}>Projects</a>
          <a href="#experience" className="hover:underline fade-color-transition" style={{ color: "var(--text-muted)" }}>Experience</a>
          <a href="#contact" className="hover:underline fade-color-transition" style={{ color: "var(--text-muted)" }}>Contact</a>

          {/* Theme toggle */}
          <div className="theme-toggle">
            <span className="sr-only">Toggle theme</span>
            <button
              aria-pressed={!!isDark}
              title={isDark ? "Switch to light" : "Switch to dark"}
              onClick={toggleTheme}
              className="theme-toggle__button"
            >
              <span
                className="theme-toggle__knob"
                style={{ transform: isDark ? "translateX(16px)" : "translateX(0)" }}
              />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
