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
    </div>
  );
}

export default Projects;
