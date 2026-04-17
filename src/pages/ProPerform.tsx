import { Link } from "react-router-dom";
import {
  Target,
  Zap,
  Users,
  ExternalLink,
  HelpCircle,
  Shield,
  TrendingUp,
} from "lucide-react";

const BLUE = "#1F3A8A";

export default function ProPerform() {
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
        <div className="relative overflow-hidden rounded-3xl border border-blue-900/20 bg-[#080d0a]">
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
            style={{ background: `${BLUE}28` }}
          />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-blue-900/10 blur-[60px]" />

          <div className="relative p-8 md:p-14">
            {/* Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-[0.2em] uppercase border"
                style={{
                  borderColor: `${BLUE}50`,
                  background: `${BLUE}15`,
                  color: "#93c5fd",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: BLUE }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: BLUE }}
                  />
                </span>
                Soon in the App Store
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-gray-400">
                React Native · Web · TypeScript
              </span>
            </div>

            <div className="mt-6">
              <h1 className="text-6xl font-black tracking-tight text-white md:text-7xl">
                ProPerform
              </h1>
            </div>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
              The all-in-one training platform for athletes and coaches. Plan
              smarter, track live, and achieve your fitness goals with real-time
              feedback and intelligent workouts.
            </p>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "Training Plans",
                "Live Tracking",
                "Coach Connect",
                "Performance Analytics",
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

        {/* Download CTA - Disabled */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 px-6 py-5 opacity-50">
          <div>
            <p className="text-sm font-semibold text-white">Available on iOS</p>
            <p className="mt-0.5 text-xs text-gray-500">Coming soon</p>
          </div>
          <div className="flex items-center gap-3 pointer-events-none">
            <div
              className="inline-flex items-center gap-3 rounded-xl border px-5 py-3"
              style={{ background: `${BLUE}18`, borderColor: `${BLUE}40` }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke={BLUE}
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
                <p
                  className="text-[10px] font-medium tracking-wide"
                  style={{ color: `${BLUE}99` }}
                >
                  Download on the
                </p>
                <p className="text-[15px] font-bold text-white tracking-tight">
                  App Store
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Website CTA */}
        <a
          href="https://properform.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 px-6 py-5 hover:border-white/15 hover:bg-white/5 transition-all duration-150 group"
        >
          <div>
            <p className="text-sm font-semibold text-white">Visit Website</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Learn more at properform.app
            </p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
        </a>

        {/* Features */}
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              icon: Target,
              title: "Custom Training Plans",
              desc: "Create tailored workout programs for every athlete. Flexible, structured, and aligned with individual fitness goals.",
              color: BLUE,
            },
            {
              icon: Zap,
              title: "Live Tracking",
              desc: "Record sets, reps, and weights in real-time. Monitor your progress continuously and stay accountable to your plan.",
              color: "#f59e0b",
            },
            {
              icon: Users,
              title: "Coach Connection",
              desc: "Connect directly with athletes for instant feedback, form corrections, and personalized motivation during workouts.",
              color: "#8b5cf6",
            },
            {
              icon: TrendingUp,
              title: "Performance Analytics",
              desc: "Detailed insights into your progress. Identify strengths, weaknesses, and improvements over time with comprehensive data.",
              color: "#ef4444",
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
            Built with React Native · Web · TypeScript
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://properform.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Support
            </a>
            <a
              href="https://properform.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Privacy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
