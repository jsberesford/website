"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "Sorry, no response.";
      setMessages((m) => [...m, { role: "assistant", text: String(reply) }]);
    } catch (error) {
      const fallback = error instanceof Error ? error.message : "Error contacting the server.";
      setMessages((m) => [...m, { role: "assistant", text: fallback }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed right-6 bottom-6 z-50">
        <M.button
          onClick={() => setOpen(true)}
          aria-label="Open Jared&apos;s AI"
          whileHover={{ scale: 1.06 }}
          transition={{ type: "spring", stiffness: 260 }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-rose-300 shadow-lg flex items-center justify-center ring-1 ring-slate-200/40 hover:scale-105 transition-transform animate-floaty"
        >
          <span className="font-semibold">AI</span>
        </M.button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          <M.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative w-full md:w-[720px] max-h-[80vh] bg-white/95 border border-slate-200 rounded-2xl shadow-2xl p-4 m-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Ask Jared&apos;s AI</h3>
              <button onClick={() => setOpen(false)} className="text-slate-600 hover:text-slate-800">Close</button>
            </div>
            <div className="space-y-3 overflow-auto h-[50vh] p-2 rounded-md bg-white/50">
              {messages.length === 0 && <p className="text-sm text-slate-600">Ask a question about Jared — projects, experience, or general info.</p>}
              {messages.map((m, i) => (
                <M.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className={`p-3 rounded-md ${m.role === "user" ? "bg-amber-50 self-end text-slate-900" : "bg-white text-slate-900"}`}>
                  <div className="text-sm">{m.text}</div>
                </M.div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-lg bg-white border border-slate-200 px-3 py-2 focus:outline-none text-slate-900"
                placeholder="Ask something about Jared..."
              />
              <button type="submit" disabled={loading} className="rounded-lg px-4 py-2 bg-amber-500 text-slate-900 hover:bg-amber-600 transition">
                {loading ? "..." : "Send"}
              </button>
            </form>
          </M.div>
        </div>
      )}
    </>
  );
}
