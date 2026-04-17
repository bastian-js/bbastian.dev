import {
  Code,
  Rocket,
  Sparkles,
  MapPin,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

const CODING_SINCE = 2021;
const yearsCoding = new Date().getFullYear() - CODING_SINCE;

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-24 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            About Me
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            A little bit about me, how I got here and what I'm working on.
          </p>
        </div>

        {/* Bio card */}
        <div className="bg-[#111] border border-white/6 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-white/8">
              <img
                src="/profile_picture.png"
                alt="Bastian"
                className="w-full h-full object-cover object-[50%_10%]"
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-white text-left">
                Bastian
              </p>
              <p className="text-base text-gray-500 text-left">
                Full-Stack Developer
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-5 text-left">
            I'm a 20-year-old developer and student from Austria, attending a
            coding-focused school. I'm deeply interested in building real-world
            applications — from mobile apps and web platforms to macOS tools —
            with a focus on clean design and solid architecture.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: MapPin, label: "Austria" },
              { icon: GraduationCap, label: "HAK Student" },
              { icon: Calendar, label: `Coding since ${CODING_SINCE}` },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-gray-500"
              >
                <Icon className="w-3.5 h-3.5 text-gray-600" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: `${yearsCoding}+`, label: "Years coding" },
            { value: "7+", label: "Projects shipped" },
            { value: "3", label: "Apps live" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-[#111] border border-white/6 rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* What I do */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: "Clean Code",
              text: "Readable, maintainable and built to scale without pain.",
              icon: Code,
              color: "#007ACC",
            },
            {
              title: "Fast Products",
              text: "Performance matters. Speed is a feature, not an afterthought.",
              icon: Rocket,
              color: "#34d399",
            },
            {
              title: "Polished UX",
              text: "Interfaces should feel effortless and intentional.",
              icon: Sparkles,
              color: "#A78BFA",
            },
          ].map(({ title, text, icon: Icon, color }) => (
            <div
              key={title}
              className="bg-[#111] border border-white/6 rounded-2xl p-5 hover:border-white/10 transition-all duration-150"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: color + "18", color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2 text-left">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed text-left">
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Currently building */}
        <Link
          to="/noury"
          className="block hover:scale-[1.01] transition-transform"
        >
          <div className="bg-[#111] border border-emerald-500/15 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mt-1.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Currently building
              </p>
              <p className="text-base font-semibold text-white mb-1">
                Noury — AI Calorie Tracker
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                A nutrition and fitness app focused on calorie tracking, meal
                logging and personalized progress with a clean minimal UI and
                scalable backend.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
