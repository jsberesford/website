'use client';

// SnapshotSection: the whole section is a Finder-style file browser, not just a
// dashboard in a window. State machine:
//   - `tab`          : which sidebar destination is selected
//   - `openedFolder` : when on the "projects" tab, which folder (if any) is open
// The right pane renders different content per (tab, openedFolder). The title bar
// becomes a live POSIX path, the toolbar exposes a back arrow + breadcrumb, and
// the status bar shows item counts — exactly what a real macOS window does.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import MacWindow from './MacWindow';
import Folder, { FolderColor } from './snapshot/Folder';
import DesignNotes from './snapshot/DesignNotes';
import EnergyRing from './snapshot/EnergyRing';
import FuelRadar from './snapshot/FuelRadar';
import JourneyList from './snapshot/JourneyList';
import FunFacts from './snapshot/FunFacts';

// =====================================================================
// Sidebar
// =====================================================================
type TabId = 'projects' | 'snapshot' | 'achievements' | 'garden';

const sidebarIconCls = 'w-4 h-4 shrink-0';

const sidebarItems: Array<{
  id: TabId;
  label: string;
  pathSeg: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'projects',
    label: 'Projects',
    pathSeg: 'projects',
    icon: (
      <svg className={sidebarIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 9.5V21h14V9.5" />
        <rect x="10" y="14" width="4" height="7" />
      </svg>
    ),
  },
  {
    id: 'snapshot',
    label: 'Snapshot',
    pathSeg: 'snapshot',
    icon: (
      <svg className={sidebarIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    id: 'achievements',
    label: 'Achievements',
    pathSeg: 'achievements',
    icon: (
      <svg className={sidebarIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" />
      </svg>
    ),
  },
  {
    id: 'garden',
    label: 'Garden',
    pathSeg: 'garden',
    icon: (
      <svg className={sidebarIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V11" />
        <path d="M12 11c0-3 2-5 5-5 0 3-2 5-5 5z" />
        <path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" />
      </svg>
    ),
  },
];

// =====================================================================
// Project folders (only visible when on the Projects tab + no folder opened)
// =====================================================================
const folderIconCls = 'w-full h-full';
const FolderIcons = {
  briefcase: (
    <svg className={folderIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  ),
  spark: (
    <svg className={folderIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  burst: (
    <svg className={folderIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5V3M12 21v-2M19 12h2M3 12h2M16.95 7.05l1.41-1.41M5.64 18.36l1.41-1.41M16.95 16.95l1.41 1.41M5.64 5.64l1.41 1.41" />
    </svg>
  ),
  camera: (
    <svg className={folderIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13.5" r="3.5" />
      <path d="M8 7l1.5-3h5L16 7" />
    </svg>
  ),
  pencil: (
    <svg className={folderIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4l6 6L8 22H2v-6L14 4z" />
      <path d="M13 5l6 6" />
    </svg>
  ),
};

type ProjectFolder = {
  id: string;
  name: string;
  color: FolderColor;
  icon: React.ReactNode;
  items: Array<{ title: string; blurb: string; img: string }>;
};

// NOTE: folder names and item details are placeholders — replace freely.
const projectFolders: ProjectFolder[] = [
  {
    id: 'work',
    name: '[YOUR_FOLDER_1_NAME]',
    color: 'sky',
    icon: FolderIcons.briefcase,
    items: [
      { title: '[YOUR_WORK_1_TITLE]', blurb: '[YOUR_WORK_1_BLURB]', img: '/images/folder-work-1.jpg' },
      { title: '[YOUR_WORK_2_TITLE]', blurb: '[YOUR_WORK_2_BLURB]', img: '/images/folder-work-2.jpg' },
      { title: '[YOUR_WORK_3_TITLE]', blurb: '[YOUR_WORK_3_BLURB]', img: '/images/folder-work-3.jpg' },
    ],
  },
  {
    id: 'side',
    name: '[YOUR_FOLDER_2_NAME]',
    color: 'kraft',
    icon: FolderIcons.spark,
    items: [
      { title: '[YOUR_SIDE_1_TITLE]', blurb: '[YOUR_SIDE_1_BLURB]', img: '/images/folder-side-1.jpg' },
      { title: '[YOUR_SIDE_2_TITLE]', blurb: '[YOUR_SIDE_2_BLURB]', img: '/images/folder-side-2.jpg' },
    ],
  },
  {
    id: 'community',
    name: '[YOUR_FOLDER_3_NAME]',
    color: 'mint',
    icon: FolderIcons.burst,
    items: [
      { title: '[YOUR_COMMUNITY_1_TITLE]', blurb: '[YOUR_COMMUNITY_1_BLURB]', img: '/images/folder-community-1.jpg' },
      { title: '[YOUR_COMMUNITY_2_TITLE]', blurb: '[YOUR_COMMUNITY_2_BLURB]', img: '/images/folder-community-2.jpg' },
    ],
  },
  {
    id: 'lens',
    name: '[YOUR_FOLDER_4_NAME]',
    color: 'coral',
    icon: FolderIcons.camera,
    items: [
      { title: '[YOUR_LENS_1_TITLE]', blurb: '[YOUR_LENS_1_BLURB]', img: '/images/folder-lens-1.jpg' },
      { title: '[YOUR_LENS_2_TITLE]', blurb: '[YOUR_LENS_2_BLURB]', img: '/images/folder-lens-2.jpg' },
      { title: '[YOUR_LENS_3_TITLE]', blurb: '[YOUR_LENS_3_BLURB]', img: '/images/folder-lens-3.jpg' },
    ],
  },
  {
    id: 'sketches',
    name: '[YOUR_FOLDER_5_NAME]',
    color: 'lilac',
    icon: FolderIcons.pencil,
    items: [
      { title: '[YOUR_SKETCH_1_TITLE]', blurb: '[YOUR_SKETCH_1_BLURB]', img: '/images/folder-sketch-1.jpg' },
      { title: '[YOUR_SKETCH_2_TITLE]', blurb: '[YOUR_SKETCH_2_BLURB]', img: '/images/folder-sketch-2.jpg' },
    ],
  },
];

// =====================================================================
// Toolbar (back + breadcrumb)
// =====================================================================
function Toolbar({
  pathParts,
  canGoBack,
  onBack,
}: {
  pathParts: string[];
  canGoBack: boolean;
  onBack: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Back"
        className={`w-6 h-6 rounded flex items-center justify-center transition ${
          canGoBack
            ? 'text-ink-800 hover:bg-cream-200'
            : 'text-ink-900/25 cursor-not-allowed'
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        disabled
        aria-label="Forward"
        className="w-6 h-6 rounded flex items-center justify-center text-ink-900/25"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <div className="ml-2 font-mono text-[11px] text-ink-700 flex items-center gap-1 truncate">
        {pathParts.map((part, i) => (
          <React.Fragment key={i}>
            <span className={i === pathParts.length - 1 ? 'text-ink-900' : 'text-ink-700/60'}>
              {part}
            </span>
            {i < pathParts.length - 1 && <span className="text-ink-700/40">/</span>}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

// =====================================================================
// Views
// =====================================================================
function ProjectsRootView({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-6">
      {projectFolders.map((f) => (
        <Folder key={f.id} name={f.name} color={f.color} icon={f.icon} onOpen={() => onOpen(f.id)} />
      ))}
    </div>
  );
}

function FolderContentsView({ folder }: { folder: ProjectFolder }) {
  return (
    <div>
      <div className="font-script text-3xl text-ink-900 mb-4">{folder.name}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folder.items.map((it, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="bg-cream-50 border border-ink-900/10 rounded-lg overflow-hidden shadow-card cursor-pointer"
          >
            <img
              src={it.img}
              alt={it.title}
              className="w-full aspect-[4/3] object-cover bg-cream-200"
            />
            <div className="p-3">
              <div className="font-mono text-xs uppercase tracking-wider text-ink-900/60">
                {it.title}
              </div>
              <p className="text-sm text-ink-800 mt-1 leading-snug">{it.blurb}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SnapshotDashboardView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DesignNotes />
        <EnergyRing value={72} />
        <FuelRadar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JourneyList />
        <FunFacts />
      </div>
    </div>
  );
}

function AchievementsView() {
  return (
    <div className="max-w-3xl mx-auto">
      <JourneyList />
    </div>
  );
}

function GardenView() {
  // A simple photo wall — image slots the user can fill from /public/images.
  const photos = Array.from({ length: 8 }).map((_, i) => `/images/garden-${i + 1}.jpg`);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map((src, i) => (
        <motion.img
          key={i}
          src={src}
          alt={`garden ${i + 1}`}
          whileHover={{ scale: 1.03 }}
          className="w-full aspect-square object-cover rounded-md bg-cream-200 shadow-card cursor-pointer"
        />
      ))}
    </div>
  );
}

// =====================================================================
// Mobile-only phone home screen
// ---------------------------------------------------------------------
// On phones the Finder window is replaced by an iOS-style home screen:
// each project folder becomes an app icon, the other Finder tabs live in
// the dock, and tapping an app opens it full-screen with a large title.
// This is deliberately phone-only (lg:hidden) — desktop keeps the Finder
// window untouched.
// =====================================================================

// App-icon gradients + glyph tints, derived from the folder palette.
const appStyle: Record<FolderColor, { gradient: string; iconColor: string }> = {
  sky:    { gradient: 'linear-gradient(150deg,#CDE8F4,#7AB0CA)', iconColor: '#33586B' },
  kraft:  { gradient: 'linear-gradient(150deg,#E8D7B4,#B89868)', iconColor: '#6A5230' },
  mint:   { gradient: 'linear-gradient(150deg,#C6ECD4,#73BD90)', iconColor: '#36633F' },
  coral:  { gradient: 'linear-gradient(150deg,#FFB0A2,#D0604F)', iconColor: '#7A2D22' },
  lilac:  { gradient: 'linear-gradient(150deg,#E0D5F4,#9C8AC4)', iconColor: '#503E78' },
  yellow: { gradient: 'linear-gradient(150deg,#FFE893,#D4B330)', iconColor: '#6A5810' },
};

// Dock glyphs sized to fill the app tile (the sidebar icons are fixed-small).
const phoneIconCls = 'w-full h-full';
const DockGlyphs = {
  monitor: (
    <svg className={phoneIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  star: (
    <svg className={phoneIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" />
    </svg>
  ),
  plant: (
    <svg className={phoneIconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V11" />
      <path d="M12 11c0-3 2-5 5-5 0 3-2 5-5 5z" />
      <path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" />
    </svg>
  ),
};

type DockAppId = 'snapshot' | 'achievements' | 'garden';
const dockApps: Array<{ id: DockAppId; label: string; gradient: string; iconColor: string; icon: React.ReactNode }> = [
  { id: 'snapshot',     label: 'Snapshot', gradient: 'linear-gradient(150deg,#D6E0E8,#8A9BAA)', iconColor: '#3A4A57', icon: DockGlyphs.monitor },
  { id: 'achievements', label: 'Awards',   gradient: 'linear-gradient(150deg,#FFE893,#D4B330)', iconColor: '#6A5810', icon: DockGlyphs.star },
  { id: 'garden',       label: 'Garden',   gradient: 'linear-gradient(150deg,#C6ECD4,#73BD90)', iconColor: '#36633F', icon: DockGlyphs.plant },
];

function PhoneAppIcon({
  label,
  gradient,
  iconColor,
  icon,
  onTap,
}: {
  label: string;
  gradient: string;
  iconColor: string;
  icon: React.ReactNode;
  onTap: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={onTap}
      className="flex flex-col items-center gap-1.5 outline-none"
    >
      <div
        className="w-[56px] h-[56px] rounded-[15px] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
        style={{ background: gradient, color: iconColor }}
      >
        <div className="w-7 h-7 opacity-90">{icon}</div>
      </div>
      <span className="text-[11px] text-ink-900/75 leading-none text-center max-w-[66px] truncate">
        {label}
      </span>
    </motion.button>
  );
}

function PhoneStatusBar() {
  return (
    <div className="relative flex items-center justify-between px-7 pt-3.5 pb-1 text-ink-900 text-[13px] font-semibold tracking-tight z-20">
      <span>9:41</span>
      <div className="flex items-center gap-1.5 text-ink-900">
        {/* signal */}
        <svg viewBox="0 0 18 12" className="w-4 h-3 fill-current" aria-hidden>
          <rect x="0"  y="8"   width="3" height="4"    rx="0.5" />
          <rect x="5"  y="5.5" width="3" height="6.5"  rx="0.5" />
          <rect x="10" y="3"   width="3" height="9"    rx="0.5" />
          <rect x="15" y="0.5" width="3" height="11.5" rx="0.5" />
        </svg>
        {/* wifi */}
        <svg viewBox="0 0 16 12" className="w-4 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <path d="M1 4.5a10 10 0 0 1 14 0" />
          <path d="M3.5 7a6.5 6.5 0 0 1 9 0" />
          <path d="M6 9.5a3 3 0 0 1 4 0" />
        </svg>
        {/* battery */}
        <svg viewBox="0 0 26 12" className="w-6 h-3" aria-hidden>
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
          <rect x="23.5" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

function PhoneSnapshot() {
  const [openApp, setOpenApp] = useState<string | null>(null);

  const openedFolder = projectFolders.find((f) => f.id === openApp) ?? null;
  const dockApp = dockApps.find((d) => d.id === openApp) ?? null;
  const title = openedFolder ? openedFolder.name : dockApp ? dockApp.label : '';

  return (
    // Phone bezel
    <div className="w-full max-w-[330px] mx-auto rounded-[46px] bg-ink-900 p-3 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)]">
      {/* Screen */}
      <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-b from-cream-100 via-cream-100 to-cream-200 min-h-[620px] flex flex-col">
        {/* Dynamic island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-7 rounded-full bg-ink-900 z-30" />

        <PhoneStatusBar />

        <AnimatePresence mode="wait" initial={false}>
          {openApp === null ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex-1 flex flex-col"
            >
              {/* App grid — project folders become apps */}
              <div className="grid grid-cols-4 gap-x-2 gap-y-5 px-5 pt-8">
                {projectFolders.map((f) => (
                  <PhoneAppIcon
                    key={f.id}
                    label={f.name}
                    gradient={appStyle[f.color].gradient}
                    iconColor={appStyle[f.color].iconColor}
                    icon={f.icon}
                    onTap={() => setOpenApp(f.id)}
                  />
                ))}
              </div>

              {/* Page dots */}
              <div className="mt-auto flex justify-center gap-1.5 pb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-900/50" />
              </div>

              {/* Dock — the other Finder tabs */}
              <div className="mx-3 mb-3 rounded-[28px] bg-cream-50/60 backdrop-blur-md border border-cream-50/70 px-4 py-3 flex justify-around">
                {dockApps.map((d) => (
                  <PhoneAppIcon
                    key={d.id}
                    label={d.label}
                    gradient={d.gradient}
                    iconColor={d.iconColor}
                    icon={d.icon}
                    onTap={() => setOpenApp(d.id)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex-1 flex flex-col bg-cream-50"
            >
              {/* App top bar */}
              <div className="flex items-center px-3 pt-1 pb-2 border-b border-ink-900/10">
                <button
                  type="button"
                  onClick={() => setOpenApp(null)}
                  className="flex items-center gap-0.5 text-sm font-medium text-[#3F6F87]"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Home
                </button>
                <div className="flex-1 text-center text-sm font-semibold text-ink-900 pr-14 truncate">
                  {title}
                </div>
              </div>

              {/* App content — reuses the same views as the Finder window */}
              <div className="p-4 flex-1">
                {openedFolder && <FolderContentsView folder={openedFolder} />}
                {openApp === 'snapshot' && <SnapshotDashboardView />}
                {openApp === 'achievements' && <AchievementsView />}
                {openApp === 'garden' && <GardenView />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home indicator — tap to return home when an app is open */}
        <button
          type="button"
          onClick={() => setOpenApp(null)}
          disabled={openApp === null}
          aria-label="Home"
          className="relative z-30 mx-auto mb-2 mt-1 h-1.5 w-32 rounded-full bg-ink-900/30 disabled:cursor-default"
        />
      </div>
    </div>
  );
}

// =====================================================================
// Main component
// =====================================================================
export default function SnapshotSection() {
  const [tab, setTab] = useState<TabId>('projects');
  const [openedFolder, setOpenedFolder] = useState<string | null>(null);

  const activeTab = sidebarItems.find((s) => s.id === tab)!;
  const opened = openedFolder ? projectFolders.find((f) => f.id === openedFolder) ?? null : null;

  // Build the path that shows in the title bar + breadcrumb
  const pathSegments = ['~', 'jared', activeTab.pathSeg];
  if (tab === 'projects' && opened) pathSegments.push(opened.id);
  const pathString = pathSegments.join('/');

  const canGoBack = tab !== 'projects' || opened !== null;
  const handleBack = () => {
    if (tab === 'projects' && opened) {
      setOpenedFolder(null);
    } else if (tab !== 'projects') {
      setTab('projects');
      setOpenedFolder(null);
    }
  };

  // Key used by AnimatePresence so view transitions actually crossfade
  const viewKey = tab === 'projects' ? (opened ? `projects/${opened.id}` : 'projects') : tab;

  // Item count for the status bar
  const itemCount = (() => {
    if (tab === 'projects' && !opened) return `${projectFolders.length} folders`;
    if (tab === 'projects' && opened) return `${opened.items.length} items`;
    if (tab === 'snapshot') return '5 widgets';
    if (tab === 'achievements') return '8 milestones';
    if (tab === 'garden') return '8 photos';
    return '';
  })();

  return (
    <section id="work" className="relative py-24 sm:py-32 px-4 sm:px-8">
      <div className="font-script text-4xl text-ink-900/80 mb-4 text-center">snapshot</div>

      {/* Mobile: iOS-style phone home screen */}
      <div className="lg:hidden">
        <PhoneSnapshot />
      </div>

      {/* Desktop: Finder window */}
      <div className="hidden lg:block max-w-6xl mx-auto">
        <MacWindow
          title={pathString}
          toolbar={
            <Toolbar
              pathParts={pathSegments}
              canGoBack={canGoBack}
              onBack={handleBack}
            />
          }
          statusBar={
            <>
              <span>{itemCount}</span>
              <span className="hidden sm:inline">↑↓ to navigate · ↵ to open</span>
            </>
          }
        >
          {/* Horizontal-scroll wrapper for phones; flush on desktop. */}
          <div
            className="overflow-x-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#D9CFBC transparent' }}
          >
            <div className="min-w-[860px] flex">
              {/* Sidebar */}
              <aside
                className="w-48 shrink-0 bg-cream-100/60 border-r border-ink-900/10 p-3"
                role="tablist"
                aria-orientation="vertical"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-900/40 px-2 mb-2">
                  Favorites
                </div>
                <ul className="space-y-0.5">
                  {sidebarItems.map((item) => {
                    const isActive = item.id === tab;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => {
                            setTab(item.id);
                            setOpenedFolder(null);
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                            isActive
                              ? 'bg-accent-sky/60 text-ink-900 font-medium'
                              : 'text-ink-700 hover:bg-cream-200'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Decorative "Tags" section — pure Finder vibes */}
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-900/40 px-2 mt-6 mb-2">
                  Tags
                </div>
                <ul className="space-y-1 px-2">
                  {[
                    { c: '#FF8C7A', l: 'shipped' },
                    { c: '#FFE066', l: 'drafts' },
                    { c: '#B8E6C9', l: 'in review' },
                    { c: '#BDE0F0', l: 'archive' },
                  ].map((t) => (
                    <li key={t.l} className="flex items-center gap-2 text-xs text-ink-700/80">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.c }} />
                      <span>{t.l}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Content pane — animated crossfade between views */}
              <div className="flex-1 p-6 bg-cream-50 min-h-[480px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewKey}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    {tab === 'projects' && !opened && (
                      <ProjectsRootView onOpen={(id) => setOpenedFolder(id)} />
                    )}
                    {tab === 'projects' && opened && <FolderContentsView folder={opened} />}
                    {tab === 'snapshot' && <SnapshotDashboardView />}
                    {tab === 'achievements' && <AchievementsView />}
                    {tab === 'garden' && <GardenView />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </MacWindow>
      </div>
    </section>
  );
}
