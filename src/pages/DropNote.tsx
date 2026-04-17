import { Link } from "react-router-dom";
import { MenuSquare, Layers, HardDrive, Zap, ExternalLink, Shield } from "lucide-react";

const BLUE = "#3994E7";

export default function DropNote() {
  return (
    <div className="pt-20 pb-20 px-4 text-left">
      {/* Back */}
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-[#080d14]">
          {/* Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Glows */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full blur-[80px]" style={{ background: `${BLUE}28` }} />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-indigo-500/10 blur-[60px]" />

          <div className="relative p-8 md:p-14">
            {/* Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-[0.2em] uppercase border"
                style={{ borderColor: `${BLUE}50`, background: `${BLUE}15`, color: "#a8ccf5" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: BLUE }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: BLUE }} />
                </span>
                Available Now
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-gray-400">
                Swift · SwiftUI · macOS
              </span>
            </div>

            <div className="mt-6">
              <h1 className="text-6xl font-black tracking-tight text-white md:text-7xl">
                DropNote
              </h1>
            </div>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
              A minimal macOS menu bar app for quickly creating and managing notes
              without interrupting your workflow. Fast, focused and always one click away.
            </p>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["Menu Bar", "Tab Notes", "Local Storage", "No Account"].map((label) => (
                <span
                  key={label}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-400"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <a
          href="https://dropnote.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 px-6 py-5 hover:border-white/15 hover:bg-white/5 transition-all duration-150 group"
        >
          <div>
            <p className="text-sm font-semibold text-white">Available on macOS</p>
            <p className="mt-0.5 text-xs text-gray-500">Download for free at dropnote.dev</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center gap-3 rounded-xl border px-5 py-3"
              style={{ background: `${BLUE}18`, borderColor: `${BLUE}40` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={BLUE} strokeWidth={1.6}>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" />
              </svg>
              <div className="text-left leading-tight">
                <p className="text-[10px] font-medium tracking-wide" style={{ color: `${BLUE}99` }}>Download for</p>
                <p className="text-[15px] font-bold text-white tracking-tight">macOS</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </div>
        </a>

        {/* Features */}
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              icon: MenuSquare,
              title: "Lives in Your Menu Bar",
              desc: "DropNote sits quietly in your macOS menu bar. One click and your notes are right there — no app switching, no interruptions.",
              color: BLUE,
            },
            {
              icon: Layers,
              title: "Tab-based Notes",
              desc: "Organize multiple notes in clean tabs. Switch between them instantly and keep everything neatly separated.",
              color: "#A78BFA",
            },
            {
              icon: HardDrive,
              title: "Stored Locally",
              desc: "All your notes are stored in a JSON file on your Mac. No cloud, no account, no subscription. Your notes are yours.",
              color: "#34d399",
            },
            {
              icon: Zap,
              title: "Fast & Minimal",
              desc: "Built for speed and simplicity. No feature overload — just a clean, distraction-free space to write your thoughts.",
              color: "#F59E0B",
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/8 bg-white/3 p-5 flex flex-col gap-3 hover:border-white/12 transition-all duration-150"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: color + "20", color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/6 bg-[#0d0d0d] px-6 py-4">
          <p className="text-xs text-gray-600">Built with Swift · SwiftUI · macOS</p>
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Contact
            </Link>
            <a
              href="https://dropnote.dev/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Privacy Policy
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
