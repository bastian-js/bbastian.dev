import { Link } from "react-router-dom";
import { Code2, Terminal, Bot, Globe, Type, Music, Laptop } from "lucide-react";
import Infobox from "../components/Infobox";
import TechnologiesGrid from "../components/TechnologiesGrid";
import VerticalTimeline from "../components/VerticalTimeline";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  link?: { label: string; url: string };
}

function Home() {
  const timelineItems: TimelineItem[] = [
    {
      year: "2020",
      title: "School Start",
      description:
        "Started school and learned C#, HTML and CSS, which marked the beginning of my coding journey.",
    },
    {
      year: "2021",
      title: "JavaScript & Discord Bots",
      description:
        "Began working with JavaScript and published several Discord bots as my first real public coding projects.",
    },
    {
      year: "2022",
      title: "First Portfolio Website",
      description:
        "Released my first personal portfolio website and learned how to build and deploy web projects.",
    },
    {
      year: "2023",
      title: ".NET MAUI & MVVM",
      description:
        "Started developing mobile applications using .NET MAUI and the MVVM architecture to structure scalable apps.",
    },
    {
      year: "2024",
      title: "2D School Game",
      description:
        "Developed a small 2D game for a school project and improved my understanding of game logic and UI design.",
    },
    {
      year: "September 2025",
      title: "Diploma Project: ProPerform",
      description:
        "Started working on ProPerform, a diploma project focused on tracking training sessions and creating gym exercises and workout plans.",
    },
    {
      year: "November 2025",
      title: "Calorie Tracker: DailyBite",
      description:
        "Started building DailyBite, a calorie tracking app with a refined UI and Austrian food products integrated into the database.",
    },
    {
      year: "February 2026",
      title: "Savings App: PiggyTrack",
      description:
        "Started building PiggyTrack, a savings app focused on helping users save money with a simple and intuitive interface, featuring a piggy bank design and goal tracking.",
    },
    {
      year: "February 2026",
      title: "Release: PiggyTrack",
      description: "Official release of PiggyTrack to the public.",
      link: { label: "piggytrack.bbastian.dev", url: "https://piggytrack.bbastian.dev" },
    },
    {
      year: "April 2026",
      title: "Began developing Noury",
      description:
        "Started building Noury, focusing on a clean, modern app experience with features like calorie tracking, exercise integration, and a scalable backend architecture.",
    },
  ];

  const infoboxItems = [
    {
      title: "bastian",
      titleundertitle: "developer • student • austria",
      subtitle: "20-year-old student & developer from Austria",
      description:
        "I am a 20-year-old student attending a coding-focused school program, deeply interested in software development, modern web technologies and building real-world applications through hands-on projects.",
      image: "/profile_picture.png",
    },
  ];

  const technologiesGridItems = [
    { name: "TypeScript", icon: "/typescript.svg" },
    { name: "JavaScript", icon: "/javascript.svg" },
    { name: "React", icon: "/react.svg" },
    { name: "Expo", icon: "/expo.svg" },
    { name: "C#", icon: "/csharp.svg" },
    { name: "HTML", icon: "/html.svg" },
    { name: "CSS", icon: "/css.svg" },
  ];

  return (
    <div className="pt-22">
      <Link to="/noury" className="block mx-auto max-w-6xl px-4 pt-6 group">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-300/25 bg-linear-to-br from-[#111f1a] via-[#101010] to-[#0c1310] px-5 py-4 transition-colors duration-200 group-hover:border-emerald-300/50">
          <div className="pointer-events-none absolute -top-10 -right-8 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-0.5 text-xs font-bold tracking-[0.18em] text-emerald-100 uppercase shadow-[0_0_16px_rgba(52,211,153,0.2)] shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Coming Soon
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white">Noury</span>
              <span className="text-sm text-emerald-300 font-medium">
                /ˈnuː.ri/
              </span>
            </div>
            <p className="text-sm text-gray-400 flex-1 min-w-0">
              AI calorie tracking — log meals by photo or manually.
            </p>
            <span className="text-xs text-emerald-300 font-semibold group-hover:underline shrink-0">
              Learn more →
            </span>
          </div>
        </div>
      </Link>

      <Infobox items={infoboxItems} />

      <VerticalTimeline items={timelineItems} />

      <div className="w-full bg-[#0a0a0a] pt-16 pb-0 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-3">Technologies</h2>
          <p className="text-gray-500 text-sm">
            Languages and frameworks I work with regularly.
          </p>
        </div>
      </div>

      <TechnologiesGrid items={technologiesGridItems} />

      {/* Setup */}
      <div className="w-full bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold mt-5">Setup</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                label: "Editor",
                name: "VS Code",
                detail: "Dark Modern",
                color: "#007ACC",
                Icon: Code2,
              },
              {
                label: "Terminal",
                name: "Warp",
                detail: "AI-powered terminal",
                color: "#01A4FF",
                Icon: Terminal,
              },
              {
                label: "AI Agent",
                name: "Claude Code",
                detail: "by Anthropic",
                color: "#D97706",
                Icon: Bot,
              },
              {
                label: "Browser",
                name: "Firefox",
                detail: "Developer Edition",
                color: "#FF7139",
                Icon: Globe,
              },
              {
                label: "Font",
                name: "Fira Code",
                detail: "with ligatures",
                color: "#A78BFA",
                Icon: Type,
              },
              {
                label: "Music",
                name: "Spotify",
                detail: "always on",
                color: "#1DB954",
                Icon: Music,
              },
              {
                label: "OS",
                name: "macOS",
                detail: "mostly",
                color: "#888888",
                Icon: Laptop,
              },
            ].map(({ label, name, detail, color, Icon }) => (
              <div
                key={name}
                className="flex items-center gap-4 px-4 py-4 bg-[#111] border border-white/6 rounded-xl hover:border-white/10 transition-all duration-150"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: color + "18", color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                    {label}
                  </p>
                  <p className="text-base font-semibold text-white leading-tight">
                    {name}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
