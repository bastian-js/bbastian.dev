import { Link } from "react-router-dom";
import {
  PiggyBank,
  Dices,
  Target,
  Lock,
  ExternalLink,
  HelpCircle,
  Shield,
} from "lucide-react";

const PINK = "#FF2E8C";

export default function PiggyTrack() {
  return (
    <div className="pt-20 pb-20 px-4 text-left">
      {/* Back */}
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-[#130810]">
          {/* Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Glows */}
          <div
            className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full blur-[80px]"
            style={{ background: `${PINK}30` }}
          />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-purple-500/15 blur-[60px]" />

          <div className="relative p-8 md:p-14">
            {/* Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-[0.2em] uppercase border"
                style={{
                  borderColor: `${PINK}50`,
                  background: `${PINK}15`,
                  color: "#ffb3d4",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: PINK }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: PINK }}
                  />
                </span>
                Available Now
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-gray-400">
                React Native · Expo · TypeScript
              </span>
            </div>

            <div className="mt-6">
              <h1 className="text-6xl font-black tracking-tight text-white md:text-7xl">
                PiggyTrack
              </h1>
            </div>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
              Track your cash savings, roll the Lucky Dice to grow your balance
              daily, and hit every goal — one piggy bank at a time. All your
              data stays on your device.
            </p>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "Cash Savings",
                "Lucky Dice",
                "Goal Tracking",
                "100% Offline",
              ].map((label) => (
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

        {/* App Store CTA */}
        <a
          href="https://apps.apple.com/us/app/piggytrack-budget/id6760363320"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 px-6 py-5 hover:border-white/15 hover:bg-white/5 transition-all duration-150 group"
        >
          <div>
            <p className="text-sm font-semibold text-white">Available on iOS</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Download on the App Store now
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-3 rounded-xl bg-black border border-white/15 px-5 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={1.6}
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line
                  x1="12"
                  y1="18"
                  x2="12.01"
                  y2="18"
                  strokeLinecap="round"
                  strokeWidth={2}
                />
              </svg>
              <div className="text-left leading-tight">
                <p className="text-[10px] font-medium text-white/60 tracking-wide">
                  Download on the
                </p>
                <p className="text-[15px] font-bold text-white tracking-tight">
                  App Store
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </div>
        </a>

        {/* Features */}
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              icon: PiggyBank,
              title: "Track Your Savings",
              desc: "See exactly how much is in each of your piggy banks. Know your balance at a glance, always up to date.",
              color: PINK,
            },
            {
              icon: Dices,
              title: "Lucky Dice",
              desc: "Roll the Lucky Dice once a day for a chance to grow your savings balance. A little luck goes a long way.",
              color: "#A78BFA",
            },
            {
              icon: Target,
              title: "Goal Tracking",
              desc: "Set a savings target for each piggy bank and watch your progress fill up as you get closer to your goal.",
              color: "#F59E0B",
            },
            {
              icon: Lock,
              title: "100% Private",
              desc: "All data lives on your device only. No account, no cloud sync, no tracking. Your savings stay yours.",
              color: "#34d399",
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
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/6 bg-[#0d0d0d] px-6 py-4">
          <p className="text-xs text-gray-600">
            Built with Expo · React Native · TypeScript
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://piggytrack.bbastian.dev/support"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Support
            </a>
            <a
              href="https://piggytrack.bbastian.dev/privacy"
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
