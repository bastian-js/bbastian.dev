import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProjectsGrid from "../components/ProjectsGrid";
import type { Project } from "../components/ProjectsGrid";

const projects: Project[] = [
  {
    title: "Noury",
    description:
      "A nutrition and fitness app for calorie tracking, meal logging, and personalized progress with a clean minimal UI.",
    technologies: ["TypeScript", "React Native", "Express", "MariaDB"],
    color: "#4ACDB5",
    showGithub: false,
    badge: "COMING SOON",
    liveUrl: "https://bbastian.dev/noury",
    liveDemoLabel: "Visit Website",
    featured: true,
  },
  {
    title: "ProPerform",
    description:
      "Diploma project for tracking training sessions, creating gym exercises and workout plans with a modern UI.",
    technologies: ["TypeScript", "React", "Express", "MariaDB"],
    color: "#6EE7B7",
    showGithub: true,
    badge: "COMING SOON",
    githubUrl: "https://github.com/bastian-js/properform",
    liveUrl: "https://properform.app",
    liveDemoLabel: "Visit Website",
  },
  {
    title: "PiggyTrack",
    description:
      "Track your cash savings, roll the Lucky Dice to grow your balance daily, and hit every goal — one piggy bank at a time.",
    technologies: ["Expo", "React Native", "TypeScript"],
    color: "#FE2E8B",
    showGithub: false,
    liveUrl: "https://piggytrack.bbastian.dev",
    badge: "AVAILABLE NOW",
    liveDemoLabel: "Visit Website",
  },
  {
    title: "DropNote",
    description:
      "A minimal macOS menu bar app for quickly creating and managing notes without interrupting your workflow.",
    longDescription:
      "DropNote is a lightweight macOS menu bar application designed for fast note-taking. It allows users to create and manage multiple tab-based notes, stores all data locally in a JSON file, and focuses on speed, simplicity, and distraction-free usage rather than feature overload.",
    technologies: ["Swift", "SwiftUI", "macOS"],
    color: "#10B981",
    githubUrl: "https://github.com/bastian-js/dropnote",
    showLiveDemo: false,
  },
  {
    title: "Giveaway Discord Bot",
    description:
      "A lightweight Discord giveaway bot for creating and managing community giveaways, previously used on several servers.",
    longDescription:
      "A Discord giveaway bot that was used on multiple servers and is no longer active. It allowed communities to create, delete, and manage giveaways, set end times, and automatically draw winners once a giveaway ended.",
    technologies: ["JavaScript", "Discord.js", "Node.js"],
    color: "#F59E0B",
    githubUrl: "https://github.com/bastian-js/giveaway-bot",
    showLiveDemo: false,
  },
  {
    title: "Echoverse",
    description:
      "Educational 2D game developed for a school project featuring puzzle mechanics and interactive UI elements.",
    technologies: ["JavaScript", "Phaser", "HTML"],
    color: "#EF4444",
    liveUrl: "https://echoverse.bbastian.dev",
    showGithub: false,
    liveDemoLabel: "Play",
  },
];

function Projects() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex items-end justify-between gap-4 mb-4">
          <h1
            className="font-black tracking-tight text-white leading-none"
            style={{ fontSize: "clamp(36px, 7vw, 56px)" }}
          >
            Projects
          </h1>
          <span
            className="text-xs font-mono mb-1 shrink-0"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {String(projects.length).padStart(2, "0")} total
          </span>
        </div>
        <p className="text-left text-gray-500 text-sm leading-relaxed max-w-md">
          A collection of things I've built — from mobile apps and macOS tools
          to web apps and Discord bots.
        </p>
      </div>

      <ProjectsGrid projects={projects} />

      {/* Live Apps */}
      <div className="max-w-3xl mx-auto mt-24">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-green-400">
            Live
          </span>
        </div>
        <div className="flex items-end justify-between gap-4 mb-3">
          <h2
            className="font-black tracking-tight text-white"
            style={{ fontSize: "clamp(26px, 5vw, 38px)" }}
          >
            Shipped Apps
          </h2>
          <span
            className="text-xs font-mono mb-1 shrink-0"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            02 apps
          </span>
        </div>
        <p className="text-sm text-left text-gray-500 leading-relaxed max-w-md mb-8">
          Apps I've shipped and are available to download right now.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* DropNote */}
          <div
            className="group relative overflow-hidden rounded-3xl border bg-[#080d14] p-7 transition-all duration-200 hover:-translate-y-1"
            style={{ borderColor: "rgba(57,148,231,0.18)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(57,148,231,0.4)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(57,148,231,0.18)")
            }
          >
            <div
              className="pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full blur-[70px]"
              style={{ background: "#3994E722" }}
            />
            <div
              className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full blur-[50px]"
              style={{ background: "#3994E710" }}
            />

            <span
              className="relative mb-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase"
              style={{
                background: "#3994E712",
                color: "#3994E7",
                border: "1px solid #3994E728",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: "#3994E7" }}
                />
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: "#3994E7" }}
                />
              </span>
              macOS App
            </span>

            <div className="relative flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "#3994E718",
                  border: "1px solid #3994E730",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#3994E7"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white">DropNote</h3>
            </div>
            <p className="text-left relative mt-3 text-sm leading-relaxed text-gray-500">
              A minimal macOS menu bar app for quickly capturing notes without
              interrupting your workflow.
            </p>

            <div className="relative mt-5 flex flex-wrap gap-1.5">
              {["Swift", "SwiftUI", "macOS"].map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] font-medium text-gray-500"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Download links */}
            <div className="relative mt-6 border-t border-white/6 pt-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600">
                Download at
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/bastian-js/dropnote/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-gray-300 transition-all duration-150 hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub Releases
                </a>
                <a
                  href="https://apps.apple.com/app/dropnote-quick-notes/id6761221463?mt=12"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-gray-300 transition-all duration-150 hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 384 512"
                    fill="currentColor"
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  App Store
                </a>
              </div>
            </div>

            <Link
              to="/dropnote"
              className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: "#3994E7" }}
            >
              View Details
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* PiggyTrack */}
          <div
            className="group relative overflow-hidden rounded-3xl border bg-[#0d080d] p-7 transition-all duration-200 hover:-translate-y-1"
            style={{ borderColor: "rgba(254,46,139,0.18)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(254,46,139,0.4)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(254,46,139,0.18)")
            }
          >
            <div
              className="pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full blur-[70px]"
              style={{ background: "#FE2E8B22" }}
            />
            <div
              className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full blur-[50px]"
              style={{ background: "#FE2E8B10" }}
            />

            <span
              className="relative mb-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase"
              style={{
                background: "#FE2E8B12",
                color: "#FE2E8B",
                border: "1px solid #FE2E8B28",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: "#FE2E8B" }}
                />
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: "#FE2E8B" }}
                />
              </span>
              iOS App
            </span>

            <div className="relative flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "#FE2E8B18",
                  border: "1px solid #FE2E8B30",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#FE2E8B"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white">PiggyTrack</h3>
            </div>
            <p className="text-left relative mt-3 text-sm leading-relaxed text-gray-500">
              Track your cash savings, roll the Lucky Dice to grow your balance,
              and hit every goal — one piggy bank at a time.
            </p>

            <div className="relative mt-5 flex flex-wrap gap-1.5">
              {["Expo", "React Native", "TypeScript"].map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] font-medium text-gray-500"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Download links */}
            <div className="relative mt-6 border-t border-white/6 pt-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600">
                Download at
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://apps.apple.com/us/app/piggytrack-budget/id6760363320"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-gray-300 transition-all duration-150 hover:border-white/20 hover:bg-white/8 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 384 512"
                    fill="currentColor"
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  App Store
                </a>
              </div>
            </div>

            <Link
              to="/piggytrack"
              className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: "#FE2E8B" }}
            >
              View Details
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
