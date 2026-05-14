import {
  MapPin,
  Code2,
  BookOpen,
  Zap,
  Calendar,
  Headphones,
} from "lucide-react";
import type { ReactNode } from "react";

// ── Edit this object to update the /now page ──────────────────────────────────
const NOW = {
  lastUpdated: "May 2026",

  building: [
    {
      name: "Noury",
      description:
        "AI calorie tracking app — currently focused on the backend architecture and mobile UI with Expo.",
    },
  ],

  learning: [
    "Expo & React Native deeper patterns",
    "Backend architecture with Node.js, Express and MariaDB",
    "UI/UX design principles",
  ],

  listening: "Mostly german rap like OG Keemo, reezy or Ufo361",

  location: "Austria",

  status: "In school full-time, building projects on the side",

  mood: "Building things that matter",

  notNow: ["Not job hunting — still in school"],
};
// ─────────────────────────────────────────────────────────────────────────────

export default function Now() {
  return (
    <div className="pt-28 pb-20 px-4 text-left">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs font-bold tracking-[0.15em] text-emerald-300 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
            <span className="text-xs text-gray-600">
              Updated {NOW.lastUpdated}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">/now</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            What I'm currently up to — inspired by{" "}
            <a
              href="https://nownownow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition underline underline-offset-2"
            >
              nownownow.com
            </a>
          </p>
        </div>

        {/* Sections */}
        <Section icon={<Code2 className="w-4 h-4" />} label="Building">
          <div className="space-y-4">
            {NOW.building.map((p) => (
              <div key={p.name}>
                <span className="font-semibold text-white">{p.name}</span>
                <p className="text-gray-400 text-sm mt-0.5 leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<BookOpen className="w-4 h-4" />} label="Learning">
          <ul className="space-y-2">
            {NOW.learning.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-gray-400"
              >
                <span className="text-emerald-400 mt-0.5 shrink-0">›</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={<Headphones className="w-4 h-4" />} label="Listening to">
          <p className="text-gray-400 text-sm leading-relaxed">
            {NOW.listening}
          </p>
        </Section>

        <Section icon={<Zap className="w-4 h-4" />} label="Status">
          <p className="text-gray-400 text-sm">{NOW.status}</p>
          <p className="text-gray-600 text-sm italic mt-1.5">"{NOW.mood}"</p>
        </Section>

        <Section icon={<MapPin className="w-4 h-4" />} label="Location">
          <p className="text-gray-400 text-sm">{NOW.location}</p>
        </Section>

        <Section icon={<Calendar className="w-4 h-4" />} label="Not right now">
          <ul className="space-y-2">
            {NOW.notNow.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-gray-500"
              >
                <span className="text-gray-600 mt-0.5 shrink-0">×</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-7 pb-7 border-b border-white/5 last:border-0 last:pb-0 last:mb-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-emerald-400">{icon}</span>
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
