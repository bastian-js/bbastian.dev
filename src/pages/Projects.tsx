import ProjectsGrid from "../components/ProjectsGrid";

const projects = [
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
    title: "Noury",
    description:
      "A nutrition and fitness app for calorie tracking, meal logging, and personalized progress with a clean minimal UI.",
    technologies: ["TypeScript", "React Native", "Express", "MariaDB"],
    color: "#4ACDB5",
    showGithub: false,
    badge: "COMING SOON",
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
  },
  {
    title: "Echoverse",
    description:
      "Educational 2D game developed for a school project featuring puzzle mechanics and interactive UI elements.",
    technologies: ["JavaScript", "Phaser", "HTML"],
    color: "#EF4444",
    liveUrl: "https://echoverse.bbastian.dev",
    showGithub: false,
  },
];

function Projects() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-16 px-4">
      {/* Header */}
      <div className="max-w-lg mx-auto mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 text-xs text-gray-400 font-medium tracking-wide mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {projects.length} PROJECTS
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
          Projects
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          A collection of things I've built — from mobile apps and macOS tools
          to web apps and Discord bots.
        </p>
      </div>

      <ProjectsGrid projects={projects} />
    </div>
  );
}

export default Projects;
