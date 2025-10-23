// app/page.tsx
import Navbar from "@/components/site/Navbar";

export default function Home() {
  return (
    <div className="min-h-dvh bg-black text-white">
      <Navbar />

      <main className="grid place-items-center p-6">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Your Portfolio Boilerplate
          </h1>
          <p className="mt-3 text-white/70">
            Next.js + Tailwind v4 + shadcn/ui are wired up. Replace this page
            with your real layout when you’re ready.
          </p>
          <div className="mt-6 inline-flex gap-3">
            <a
              className="rounded-xl px-4 py-2 ring-1 ring-white/15 bg-white/10 hover:bg-white/15 transition"
              href="#"
            >
              Placeholder Action
            </a>
            <a
              className="rounded-xl px-4 py-2 ring-1 ring-white/15 hover:bg-white/10 transition"
              href="/projects"
            >
              Placeholder Link
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
