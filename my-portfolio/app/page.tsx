"use client";

import React, {
  useState, useEffect, useRef, useCallback,
  KeyboardEvent, ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────
type AppState = "lock" | "loggingIn" | "desktop";
type WinId    = "terminal" | "about" | "projects" | "experience" | "contact";

interface WinState {
  open: boolean; minimized: boolean; maximized: boolean;
  x: number; y: number; z: number; entering: boolean;
}

type LineType = "cmd"|"out"|"err"|"sys"|"accent"|"pre"|"blank"|"boot";
interface Line { id: number; type: LineType; text: string; prompt?: string; ok?: boolean; isNew?: boolean; }

// ─── App definitions ──────────────────────────────────────────────────
const APPS: { id: WinId; label: string; emoji: string; color: string; defaultW: number; defaultH: number }[] = [
  { id: "terminal",   label: "Terminal",   emoji: "⌨️",  color: "linear-gradient(135deg,#1a3a1a,#0e2010)", defaultW: 800, defaultH: 520 },
  { id: "about",      label: "About Me",   emoji: "👤", color: "linear-gradient(135deg,#1e2a4a,#121830)", defaultW: 500, defaultH: 460 },
  { id: "projects",   label: "Projects",   emoji: "🚀", color: "linear-gradient(135deg,#1e3a2e,#0e2018)", defaultW: 580, defaultH: 540 },
  { id: "experience", label: "Experience", emoji: "💼", color: "linear-gradient(135deg,#2e2a1a,#1c1810)", defaultW: 560, defaultH: 520 },
  { id: "contact",    label: "Contact",    emoji: "✉️",  color: "linear-gradient(135deg,#2a1e3e,#18102a)", defaultW: 420, defaultH: 400 },
];

// ─── Hooks ────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return {
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    secs: now.toLocaleTimeString([], { second: "2-digit" }),
    date: now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }),
  };
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

// ─── Starfield canvas ─────────────────────────────────────────────────
function StarfieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let raf: number;
    let t = 0;

    interface Star { x: number; y: number; r: number; speed: number; op: number; phase: number; hue: number; }
    const stars: Star[] = Array.from({ length: 160 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.18 + 0.04,
      op: Math.random() * 0.55 + 0.08,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() < 0.15 ? (Math.random() < 0.5 ? 220 : 40) : 0,
    }));

    // Shooting stars
    interface Shoot { x: number; y: number; vx: number; vy: number; len: number; life: number; max: number; }
    const shoots: Shoot[] = [];
    const spawnShoot = () => {
      shoots.push({
        x: Math.random() * W * 0.8, y: Math.random() * H * 0.4,
        vx: 4 + Math.random() * 3, vy: 2 + Math.random() * 2,
        len: 80 + Math.random() * 60, life: 0, max: 40 + Math.random() * 20,
      });
    };
    let shootTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.008;
      shootTimer++;
      if (shootTimer > 220 + Math.random() * 180) { spawnShoot(); shootTimer = 0; }

      // Stars
      for (const s of stars) {
        const opacity = s.op * (0.65 + 0.35 * Math.sin(t + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.hue
          ? `hsla(${s.hue},80%,80%,${opacity})`
          : `rgba(255,255,255,${opacity})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
      }

      // Shooting stars
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i];
        const p = sh.life / sh.max;
        const alpha = p < 0.3 ? p / 0.3 : (1 - (p - 0.3) / 0.7);
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * (sh.len / 5), sh.y - sh.vy * (sh.len / 5));
        grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * (sh.len / 5), sh.y - sh.vy * (sh.len / 5));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        sh.x += sh.vx; sh.y += sh.vy; sh.life++;
        if (sh.life >= sh.max) shoots.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={ref} className="starfield" />;
}

// ─── Background blobs ─────────────────────────────────────────────────
function BgBlobs() {
  return (
    <div className="bg-blobs">
      <div className="bg-blob b1" />
      <div className="bg-blob b2" />
      <div className="bg-blob b3" />
      <div className="bg-blob b4" />
    </div>
  );
}

// ─── Terminal data ────────────────────────────────────────────────────
let _id = 0;
const ln = (type: LineType, text: string, extras?: Partial<Line>): Line => ({ id: _id++, type, text, ...extras });
const PROMPT = "visitor@jaredberesford:~$";

const BOOT_LINES: Line[] = [
  ln("boot", "Booting jaredberesford.com v2.0.0..."),
  ln("boot", "[ OK ] Loaded system.slice",        { ok: true }),
  ln("boot", "[ OK ] Started developer.service",  { ok: true }),
  ln("boot", "[ OK ] Mounted portfolio.target",   { ok: true }),
  ln("boot", "[ OK ] Reached target: Online",     { ok: true }),
  ln("blank", ""),
];

const WELCOME: Line[] = [
  ln("pre", "     ██╗ █████╗ ██████╗ ███████╗██████╗ "),
  ln("pre", "     ██║██╔══██╗██╔══██╗██╔════╝██╔══██╗"),
  ln("pre", "     ██║███████║██████╔╝█████╗  ██║  ██║"),
  ln("pre", "██   ██║██╔══██║██╔══██╗██╔══╝  ██║  ██║"),
  ln("pre", "╚█████╔╝██║  ██║██║  ██║███████╗██████╔╝"),
  ln("pre", " ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═════╝ "),
  ln("blank", ""),
  ln("sys",  "  Software Developer, CS Student, Builder"),
  ln("sys",  "  Georgia State University, Expected May 2028"),
  ln("blank", ""),
  ln("sys",  "  Type 'help' to see available commands."),
  ln("blank", ""),
];

const CMD_HINTS: Record<string, string> = {
  help: "list commands", about: "about me", projects: "my projects",
  experience: "work history", education: "academics", contact: "get in touch",
  whoami: "quick intro", ls: "list sections", clear: "clear screen",
};
const ALL_CMDS = Object.keys(CMD_HINTS);

function runCmd(raw: string): Line[] | "CLEAR" {
  const cmd = raw.trim().toLowerCase().split(/\s+/)[0];
  switch (cmd) {
    case "help": return [
      ln("accent","Commands"), ln("blank",""),
      ...ALL_CMDS.map(c => ln("out", `  ${c.padEnd(12)}- ${CMD_HINTS[c]}`)),
      ln("blank",""), ln("sys","  Up/Down: history   Tab: autocomplete"),
    ];
    case "whoami": return [
      ln("accent","Jared Beresford"),
      ln("out","CS Student, Software Developer, Builder"),
      ln("out","Georgia State University, Expected May 2028"),
    ];
    case "about": return [
      ln("accent","about.txt"), ln("blank",""),
      ln("out","  Hi, I'm Jared, a CS student at Georgia State University"),
      ln("out","  and software developer who loves building things that work."),
      ln("blank",""), ln("sys","  Stack: React, Next.js, TypeScript, Python, Supabase, Docker"),
    ];
    case "projects": return [
      ln("accent","projects/"), ln("blank",""),
      ln("accent","  Alphora"),
      ln("out","    React Native, Expo, PostgreSQL, Supabase"),
      ln("out","    Mobile learning platform with 100+ interactive quizzes"),
      ln("blank",""),
      ln("accent","  Personal Website"),
      ln("out","    HTML, CSS, JavaScript, Tailwind CSS"),
      ln("out","    GPT-3.5 integration, SEO optimized"),
    ];
    case "experience": return [
      ln("accent","experience.json"), ln("blank",""),
      ln("accent","  SWE Intern - Premium Food Service"),
      ln("sys","    Aug 2024 - Present"),
      ln("out","    React, Supabase, Azure - real-time sync for 500+ SKUs"),
      ln("blank",""),
      ln("accent","  Frontend Intern - Gwinnett County Government"),
      ln("sys","    May 2024 - Dec 2024"),
      ln("out","    +15% traffic, -25% bundle size, +40% load speed"),
    ];
    case "education": return [
      ln("accent","education.txt"), ln("blank",""),
      ln("accent","  Georgia State University"),
      ln("out","  B.S. Computer Science, GPA 3.82"),
      ln("sys","  Expected May 2028"), ln("blank",""),
      ln("out","  Coursework: CS Principles II, Calculus II, Discrete Math"),
      ln("out","  Involvement: Vice President of PROGSU"),
    ];
    case "contact": return [
      ln("accent","contact.txt"), ln("blank",""),
      ln("out","  Email    -  jaredberesford@gmail.com"),
      ln("out","  GitHub   -  github.com/jsberesford"),
      ln("out","  LinkedIn -  linkedin.com/in/jaredberesford"),
    ];
    case "ls": return [ln("out","  about/  projects/  experience/  education/  contact/")];
    case "clear": return "CLEAR";
    case "": return [];
    default: return [ln("err",`  command not found: ${raw.trim()}`), ln("sys","  Type 'help' for commands.")];
  }
}

// ════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════
export default function Portfolio() {
  const [lockOut,   setLockOut]   = useState(false);
  const [lockGone,  setLockGone]  = useState(false);
  const [loginOut,  setLoginOut]  = useState(false);
  const [loginGone, setLoginGone] = useState(false);
  const [deskVis,   setDeskVis]   = useState(false);
  const { time, secs, date } = useClock();

  const signIn = () => {
    setLockOut(true);
    setTimeout(() => {
      setLockGone(true);
      setTimeout(() => {
        setLoginOut(true);
        setDeskVis(true);
        setTimeout(() => setLoginGone(true), 480);
      }, 1100);
    }, 580);
  };

  return (
    <>
      <StarfieldCanvas />
      <BgBlobs />

      {/* Lock screen */}
      <div className={`lock-screen${lockOut?" out":""}${lockGone?" gone":""}`}>
        <div className="lock-blobs">
          <div className="lock-blob l1" />
          <div className="lock-blob l2" />
          <div className="lock-blob l3" />
          <div className="lock-blob l4" />
        </div>

        <div className="lock-content">
          <div className="lock-time">
            {time}<span className="lock-time-seconds">{secs}</span>
          </div>
          <div className="lock-date">{date}</div>

          <div className="lock-card">
            <div className="lock-avatar">J</div>
            <div className="lock-name">Jared Beresford</div>
            <button className="lock-btn" onClick={signIn}>Sign in</button>
          </div>
        </div>

        <p className="lock-hint">Click to enter portfolio</p>
      </div>

      {/* Login overlay */}
      <div
        className={`login-overlay${loginOut?" out":""}${loginGone?" gone":""}`}
        style={{ display: lockGone ? undefined : "none" }}
      >
        <div className="login-spinner" />
        <div className="login-msg">Welcome back, Jared...</div>
      </div>

      {/* Desktop */}
      <DesktopOS visible={deskVis} time={time} date={date} />
    </>
  );
}

// ════════════════════════════════════════════════════════
// DESKTOP OS
// ════════════════════════════════════════════════════════
function DesktopOS({ visible, time, date }: { visible: boolean; time: string; date: string }) {
  const isMobile = useIsMobile();

  const buildDefault = (): Record<WinId, WinState> =>
    Object.fromEntries(APPS.map(a => [a.id, { open: false, minimized: false, maximized: false, x: 120, y: 60, z: 1, entering: false }])) as Record<WinId, WinState>;

  const [wins, setWins] = useState<Record<WinId, WinState>>(buildDefault);
  const zRef    = useRef(10);
  const dragRef = useRef<{ id: WinId; ox: number; oy: number; wx: number; wy: number } | null>(null);

  // Center windows after mount
  useEffect(() => {
    const vw = window.innerWidth, vh = window.innerHeight - 44;
    const cx = vw / 2, cy = vh / 2;
    const off: Record<WinId, [number,number]> = {
      terminal:   [-400,-260], about:      [-250,-230],
      projects:   [-290,-270], experience: [-280,-260], contact: [-210,-200],
    };
    setWins(prev => {
      const next = { ...prev };
      (Object.keys(off) as WinId[]).forEach(id => {
        const [ox, oy] = off[id];
        next[id] = { ...next[id], x: Math.max(100, cx+ox), y: Math.max(50, cy+oy) };
      });
      return next;
    });
  }, []);

  // Global drag (mouse + touch)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = dragRef.current; if (!d || isMobile) return;
      setWins(p => ({ ...p, [d.id]: { ...p[d.id], x: Math.max(0, d.wx + e.clientX - d.ox), y: Math.max(0, d.wy + e.clientY - d.oy) } }));
    };
    const onUp = () => { dragRef.current = null; };
    const onTouchMove = (e: TouchEvent) => {
      const d = dragRef.current; if (!d || isMobile) return;
      const t = e.touches[0];
      setWins(p => ({ ...p, [d.id]: { ...p[d.id], x: Math.max(0, d.wx + t.clientX - d.ox), y: Math.max(0, d.wy + t.clientY - d.oy) } }));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [isMobile]);

  const focus = (id: WinId) => {
    zRef.current++;
    setWins(p => ({ ...p, [id]: { ...p[id], z: zRef.current } }));
  };
  const open = (id: WinId) => {
    zRef.current++;
    setWins(p => ({ ...p, [id]: { ...p[id], open: true, minimized: false, z: zRef.current, entering: true } }));
    setTimeout(() => setWins(p => ({ ...p, [id]: { ...p[id], entering: false } })), 250);
  };
  const close   = (id: WinId) => setWins(p => ({ ...p, [id]: { ...p[id], open: false } }));
  const toggleMin = (id: WinId) => setWins(p => ({ ...p, [id]: { ...p[id], minimized: !p[id].minimized } }));
  const toggleMax = (id: WinId) => setWins(p => ({ ...p, [id]: { ...p[id], maximized: !p[id].maximized } }));

  const startDrag = (id: WinId, e: React.MouseEvent) => {
    if (wins[id].maximized || isMobile) return;
    e.preventDefault();
    dragRef.current = { id, ox: e.clientX, oy: e.clientY, wx: wins[id].x, wy: wins[id].y };
    focus(id);
  };

  // Auto-open terminal once desktop appears (desktop only)
  useEffect(() => {
    if (!visible || isMobile) return;
    const t = setTimeout(() => open("terminal"), 280);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <div className={`desktop${visible?" visible":""}`}>
      <div className="desktop-area">
        {/* Icons */}
        <div className="desktop-icons">
          {APPS.map(app => (
            <div
              key={app.id}
              className={`app-icon${wins[app.id].open && !wins[app.id].minimized ? " focused" : ""}`}
              onClick={() => wins[app.id].open
                ? (wins[app.id].minimized ? toggleMin(app.id) : focus(app.id))
                : open(app.id)
              }
            >
              <div className="app-icon-box" style={{ background: app.color }}>{app.emoji}</div>
              <span className="app-icon-label">{app.label}</span>
            </div>
          ))}
        </div>

        {/* Windows */}
        {APPS.map(app => {
          const w = wins[app.id];
          if (!w.open || w.minimized) return null;
          return (
            <AppWindow
              key={app.id} id={app.id} app={app} win={w} isMobile={isMobile}
              onFocus={() => focus(app.id)} onClose={() => close(app.id)}
              onMin={() => toggleMin(app.id)} onMax={() => toggleMax(app.id)}
              onDragStart={startDrag}
            >
              {app.id === "terminal"   && <TerminalContent visible={visible} />}
              {app.id === "about"      && <AboutContent />}
              {app.id === "projects"   && <ProjectsContent />}
              {app.id === "experience" && <ExperienceContent />}
              {app.id === "contact"    && <ContactContent />}
            </AppWindow>
          );
        })}
      </div>

      {/* Taskbar */}
      <div className="taskbar">
        <div className="tb-left">
          <div className="tb-logo" onClick={() => open("about")}>⚡</div>
          {APPS.filter(a => wins[a.id].open).map(app => (
            <div
              key={app.id}
              className={`tb-win-btn${!wins[app.id].minimized ? " open" : ""}`}
              onClick={() => wins[app.id].minimized ? toggleMin(app.id) : focus(app.id)}
            >
              <span className="tb-win-icon">{app.emoji}</span>
              <span className="tb-win-label">{app.label}</span>
            </div>
          ))}
          {APPS.every(a => !wins[a.id].open) && (
            <span className="tb-hint">Click an icon to open an app</span>
          )}
        </div>
        <div className="tb-right">
          <div className="tb-clock">{time}<span>{date}</span></div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// APP WINDOW WRAPPER
// ════════════════════════════════════════════════════════
function AppWindow({
  id, app, win, isMobile,
  onFocus, onClose, onMin, onMax, onDragStart, children,
}: {
  id: WinId; app: typeof APPS[0]; win: WinState; isMobile: boolean;
  onFocus(): void; onClose(): void; onMin(): void; onMax(): void;
  onDragStart(id: WinId, e: React.MouseEvent): void;
  children: ReactNode;
}) {
  const forceMax = isMobile;
  const style: React.CSSProperties = (forceMax || win.maximized)
    ? { zIndex: win.z }
    : { left: win.x, top: win.y, width: app.defaultW, height: app.defaultH, zIndex: win.z };

  return (
    <div
      className={`app-window${win.entering ? " entering" : ""}${(forceMax || win.maximized) ? " maximized" : ""}`}
      style={style}
      onMouseDown={onFocus}
    >
      <div
        className={`win-titlebar${(forceMax || win.maximized) ? " is-max" : ""}`}
        onMouseDown={e => onDragStart(id, e)}
        onDoubleClick={onMax}
      >
        <div className="win-dots" onMouseDown={e => e.stopPropagation()}>
          <span className="win-dot c" onClick={onClose} />
          <span className="win-dot m" onClick={onMin}  />
          <span className="win-dot x" onClick={onMax}  />
        </div>
        <span className="win-titlebar-icon">{app.emoji}</span>
        <span className="win-title">{app.label}</span>
      </div>
      <div className="win-body" style={{ display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// TERMINAL CONTENT
// ════════════════════════════════════════════════════════
function TerminalContent({ visible }: { visible: boolean }) {
  const [lines,   setLines]   = useState<Line[]>([]);
  const [input,   setInput]   = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [booting, setBooting] = useState(true);
  const [acList,  setAcList]  = useState<string[]>([]);
  const [acIdx,   setAcIdx]   = useState(0);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const booted   = useRef(false);

  const scrollDown = useCallback(() => {
    setTimeout(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, 20);
  }, []);

  useEffect(() => {
    if (!visible || booted.current) return;
    booted.current = true;
    let i = 0;
    const tick = () => {
      if (i < BOOT_LINES.length) {
        setLines(p => [...p, { ...BOOT_LINES[i], isNew: true }]);
        i++; scrollDown();
        setTimeout(tick, i === 1 ? 240 : 95);
      } else {
        setTimeout(() => {
          setLines(p => [...p, ...WELCOME.map(l => ({ ...l, isNew: true }))]);
          setBooting(false); scrollDown();
        }, 140);
      }
    };
    setTimeout(tick, 300);
  }, [visible, scrollDown]);

  const exec = useCallback((raw: string) => {
    const result = runCmd(raw);
    if (result === "CLEAR") { setLines([]); return; }
    setLines(p => [
      ...p,
      { ...ln("cmd", raw, { prompt: PROMPT }), isNew: true },
      ...result.map(l => ({ ...l, isNew: true })),
      ln("blank", ""),
    ]);
    scrollDown();
    if (raw.trim()) setHistory(h => [raw.trim(), ...h].slice(0, 50));
  }, [scrollDown]);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (acList.length) {
      if (e.key === "ArrowDown") { e.preventDefault(); setAcIdx(i => (i+1)%acList.length); return; }
      if (e.key === "ArrowUp")   { e.preventDefault(); setAcIdx(i => (i-1+acList.length)%acList.length); return; }
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        const ch = acList[acIdx];
        if (e.key === "Tab") { setInput(ch); setAcList([]); return; }
        setInput(""); setAcList([]); exec(ch); setHistIdx(-1); return;
      }
      if (e.key === "Escape") { setAcList([]); return; }
    }
    if (e.key === "Enter")     { e.preventDefault(); exec(input); setInput(""); setHistIdx(-1); setAcList([]); return; }
    if (e.key === "Tab")       { e.preventDefault(); const v=input.trim().toLowerCase(); if(!v) return; const m=ALL_CMDS.filter(c=>c.startsWith(v)); if(m.length===1){setInput(m[0]);setAcList([]);}else if(m.length>1){setAcList(m);setAcIdx(0);} return; }
    if (e.key === "ArrowUp")   { e.preventDefault(); const n=Math.min(histIdx+1,history.length-1); setHistIdx(n); setInput(history[n]??""); setAcList([]); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); const n=histIdx-1; if(n<0){setHistIdx(-1);setInput("");}else{setHistIdx(n);setInput(history[n]);} setAcList([]); return; }
    if (acList.length && e.key !== "Shift") setAcList([]);
  };

  return (
    <>
      <div className="terminal-body" ref={bodyRef} style={{ flex: 1 }} onClick={() => inputRef.current?.focus()}>
        {lines.map(l => (
          <span key={l.id} className={`t-line ${l.type}${l.ok?" ok":""}${l.isNew?" line-new":""}`} data-prompt={l.prompt}>{l.text}</span>
        ))}
        {booting && <span className="t-cursor" />}
      </div>
      <div className="terminal-input-row">
        {acList.length > 0 && (
          <div className="autocomplete">
            {acList.map((c,i) => (
              <div key={c} className={`ac-item${i===acIdx?" sel":""}`} onClick={() => { setInput(c); setAcList([]); inputRef.current?.focus(); }}>
                <span>{c}</span><span className="ac-hint">{CMD_HINTS[c]}</span>
              </div>
            ))}
          </div>
        )}
        <span className="t-prompt">visitor@jaredberesford:~<span>$</span></span>
        <input
          ref={inputRef} className="t-input" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
          spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
          placeholder={booting ? "" : "type a command..."} disabled={booting}
        />
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// ABOUT CONTENT
// ════════════════════════════════════════════════════════
const SKILLS = [
  { label: "React",          bg: "#1e3a5f", color: "#7caae8" },
  { label: "Next.js",        bg: "#1a2a3a", color: "#a0c4e8" },
  { label: "TypeScript",     bg: "#1a2a4a", color: "#6090e0" },
  { label: "Python",         bg: "#1a3a2a", color: "#7ec89b" },
  { label: "Supabase",       bg: "#1a3a2a", color: "#50c896" },
  { label: "PostgreSQL",     bg: "#1a2a3a", color: "#7caae8" },
  { label: "Docker",         bg: "#1a2e3e", color: "#7cc8e8" },
  { label: "React Native",   bg: "#1e3a5f", color: "#7caae8" },
  { label: "GitHub Actions", bg: "#2a1a2a", color: "#c88ce8" },
  { label: "Azure",          bg: "#1a2a4a", color: "#80aaff" },
  { label: "NGINX",          bg: "#1a3020", color: "#6ec87e" },
  { label: "HTML/CSS",       bg: "#3a1e1a", color: "#e8a87c" },
];

function AboutContent() {
  return (
    <div className="about-content" style={{ overflowY: "auto", flex: 1, userSelect: "text" }}>
      <div className="about-hero">
        <div className="about-avatar">J</div>
        <div>
          <div className="about-name">Jared Beresford</div>
          <div className="about-role">Software Developer, Founder</div>
          <div className="about-school">Georgia State University, CS, Expected May 2028</div>
        </div>
      </div>

      <p className="about-bio">
        Hi, I'm Jared, a Computer Science student and software developer who loves building things that actually work.
        I design full-stack applications with a focus on performance, clean architecture, and real-world impact.
        Currently building <strong style={{ color: "var(--accent)" }}>Alphora</strong>, a mobile learning platform, while interning at Premium Food Service.
      </p>

      <div className="about-section-title">GPA</div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>3.82</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>/ 4.0</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", width: "100%", maxWidth: 220 }}>
          <div style={{ height: "100%", width: "95.5%", borderRadius: 3, background: "linear-gradient(90deg, var(--accent), var(--yellow))" }} />
        </div>
      </div>

      <div className="about-section-title">Tech Stack</div>
      <div className="skill-chips">
        {SKILLS.map(s => (
          <span key={s.label} className="skill-chip" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}22` }}>{s.label}</span>
        ))}
      </div>

      <div className="about-section-title">Involvement</div>
      <p style={{ fontSize: 13, color: "rgba(226,226,240,0.75)", lineHeight: 1.7 }}>
        Vice President of <span style={{ color: "var(--accent)" }}>PROGSU</span>, Georgia State's premier entrepreneurship and programming student org.
        Planned all operations and finance for a 500-person hackathon, coordinating logistics, budgeting, and vendor relationships end-to-end.
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// PROJECTS CONTENT  (includes Alphora)
// ════════════════════════════════════════════════════════
const PROJECTS = [
  {
    name: "Alphora",
    tags: [
      { label: "React Native",   bg: "#1e3a5f", color: "#7caae8" },
      { label: "Expo",           bg: "#1a2a3a", color: "#a0c4e8" },
      { label: "PostgreSQL",     bg: "#1a2a4a", color: "#7caae8" },
      { label: "Supabase",       bg: "#1a3a2a", color: "#50c896" },
      { label: "GitHub Actions", bg: "#2a1a2a", color: "#c88ce8" },
    ],
    desc: "Mobile learning platform with 100+ interactive quizzes, secure real-time auth, and live progress tracking.",
    bullets: [
      "Architected with React Native, Expo, PostgreSQL, and Supabase for stateless scaling",
      "Secure auth/session model with live data syncing - ~100 users with 20% retention",
      "CI/CD via GitHub Actions, cutting deploy time from ~4 minutes to under 2 minutes",
    ],
    github: "#",
    demo: "#",
  },
  {
    name: "Personal Website",
    tags: [
      { label: "HTML",       bg: "#3a1e1a", color: "#e8a87c" },
      { label: "CSS",        bg: "#1e2a3e", color: "#7caae8" },
      { label: "JavaScript", bg: "#2e2a10", color: "#e8d87c" },
      { label: "Tailwind",   bg: "#1a2e3a", color: "#7ce8d8" },
    ],
    desc: "Personal portfolio with a user-friendly interface and full responsiveness across mobile and desktop.",
    bullets: [
      "Integrated a custom-prompted GPT-3.5 model for real-time user support",
      "Implemented SEO best practices including meta tags, structured data, and performance optimization",
    ],
    github: "#",
    demo: "#",
  },
];

function ProjectsContent() {
  return (
    <div className="projects-content" style={{ overflowY: "auto", flex: 1, userSelect: "text" }}>
      {PROJECTS.map(p => (
        <div key={p.name} className="proj-card">
          <div className="proj-header">
            <div className="proj-name">{p.name}</div>
            <div className="proj-links">
              <a href={p.github} className="proj-link">GitHub</a>
              <a href={p.demo}   className="proj-link">Demo</a>
            </div>
          </div>
          <div className="proj-tags">
            {p.tags.map(t => (
              <span key={t.label} className="proj-tag" style={{ background: t.bg, color: t.color, border: `1px solid ${t.color}22` }}>{t.label}</span>
            ))}
          </div>
          <p className="proj-desc">{p.desc}</p>
          <ul className="proj-bullets">
            {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      ))}
      <div className="proj-soon">More projects on the way</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// EXPERIENCE CONTENT  (Alphora removed, now in projects)
// ════════════════════════════════════════════════════════
const EDU = [
  {
    role: "B.S. Computer Science",
    company: "Georgia State University",
    period: "Expected May 2028, GPA: 3.82",
    color: "#7caae8",
    bullets: [
      "Coursework: CS Principles II, Calculus II, Discrete Mathematics",
      "Vice President of PROGSU",
      "Planned all operations and finance for a 500-person hackathon, coordinating logistics, budgeting, and vendor relationships",
    ],
  },
];

const EXP = [
  {
    role: "Software Engineering Intern",
    company: "Premium Food Service",
    period: "Aug 2024 - Present",
    color: "#e8a87c",
    bullets: [
      "Full-stack inventory management with React, Supabase, Azure - real-time sync for 500+ SKUs",
      "Linux-based RAID file server with NGINX, Samba, Docker Compose - high-availability encrypted access",
      "CI/CD pipelines cut release lead time from 24h to under 30 minutes",
    ],
  },
  {
    role: "Frontend Engineering Intern",
    company: "Gwinnett County Government",
    period: "May 2024 - Dec 2024",
    color: "#b88ce8",
    bullets: [
      "SEO optimization via Lighthouse and Google Analytics, increasing website traffic by 15%",
      "Refactored UI to modular design patterns, reducing bundle size by ~25%",
      "Mobile-first React with REST WordPress via Axios, improving page load speed by 40%",
    ],
  },
];

function ExperienceContent() {
  return (
    <div className="exp-content" style={{ overflowY: "auto", flex: 1, userSelect: "text" }}>
      <div className="exp-section-title">Education</div>
      <div className="exp-list">
        {EDU.map((e, i) => (
          <div key={i} className="exp-item">
            <div className="exp-dot" style={{ background: e.color }} />
            <div className="exp-body">
              <div className="exp-role">{e.role}</div>
              <div className="exp-company">{e.company}</div>
              <div className="exp-period">{e.period}</div>
              <ul className="exp-blist">{e.bullets.map((b,j) => <li key={j}>{b}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>

      <div className="exp-section-title">Work Experience</div>
      <div className="exp-list">
        {EXP.map((e, i) => (
          <div key={i} className="exp-item">
            <div className="exp-dot" style={{ background: e.color }} />
            <div className="exp-body">
              <div className="exp-role">{e.role}</div>
              <div className="exp-company">{e.company}</div>
              <div className="exp-period">{e.period}</div>
              <ul className="exp-blist">{e.bullets.map((b,j) => <li key={j}>{b}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// CONTACT CONTENT
// ════════════════════════════════════════════════════════
function ContactContent() {
  return (
    <div className="contact-content" style={{ overflowY: "auto", flex: 1 }}>
      <div>
        <div className="contact-heading">Get in touch</div>
        <div className="contact-sub">Always open to new opportunities and conversations.</div>
      </div>

      <a
        href="mailto:jaredberesford@gmail.com"
        className="contact-email-btn"
        onClick={e => e.stopPropagation()}
      >
        <span style={{ fontSize: 18 }}>✉️</span>
        Send an email
      </a>
      <div className="contact-email-addr">jaredberesford@gmail.com</div>

      <hr className="contact-divider" />

      <div className="social-cards">
        <a
          href="https://github.com/jsberesford"
          target="_blank" rel="noopener noreferrer"
          className="social-card"
          onClick={e => e.stopPropagation()}
        >
          <span className="social-icon">🐙</span>
          <span className="social-name">GitHub</span>
          <span className="social-handle">@jsberesford</span>
        </a>
        <a
          href="https://linkedin.com/in/jaredberesford"
          target="_blank" rel="noopener noreferrer"
          className="social-card"
          onClick={e => e.stopPropagation()}
        >
          <span className="social-icon">💼</span>
          <span className="social-name">LinkedIn</span>
          <span className="social-handle">in/jaredberesford</span>
        </a>
      </div>
    </div>
  );
}
