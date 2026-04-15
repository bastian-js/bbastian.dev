import Infobox from "../components/Infobox";
import ProjectsGrid from "../components/ProjectsGrid";

function Projects() {
  const infoboxItems = [
    {
      title: "projects",
      titleundertitle: "showcase • portfolio • work",
      subtitle: "My personal projects and work",
      description:
        "A collection of projects I've built over the years, ranging from Discord bots and web applications to mobile apps and games. Each project represents a learning experience and a step forward in my development journey.",
      image: "/profile_picture.png",
    },
  ];

  const projects = [
    {
      title: "ProPerform",
      description:
        "Diploma project focused on tracking training sessions, creating gym exercises and workout plans with a modern UI. (showcase images coming soon)",
      technologies: ["TypeScript", "React", "Express", "MariaDB"],
      color: "#6EE7B7",
      showGithub: false,
      badgeColor: "#3B82F6",
      badge: "COMING SOON",
    },
    {
      title: "Noury",
      description:
        "A modern nutrition and fitness app focused on calorie tracking, meal logging, and personalized progress with a clean, minimal UI and scalable backend.",
      technologies: ["TypeScript", "React Native", "Express", "MariaDB"],
      color: "#4ACDB5",
      showGithub: false,
      badgeColor: "#3B82F6",
      badge: "COMING SOON",
    },
    {
      title: "PiggyTrack",
      description:
        "Track your cash savings, roll the Lucky Dice to grow your balance daily, and hit every goal — one piggy bank at a time. All data stays on your device.",
      technologies: ["Expo", "React Native", "TypeScript"],
      color: "#FE2E8B",
      showGithub: false,
      liveUrl: "https://piggytrack.bbastian.dev",
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
        "A lightweight Discord giveaway bot for creating and managing community giveaways, previously used on several servers and now discontinued.",
      longDescription:
        "A Discord giveaway bot that was used on multiple servers and is no longer active. It allowed communities to create, delete, and manage giveaways, set end times, and automatically draw winners once a giveaway ended.",
      technologies: ["JavaScript", "Discord.js", "Node.js"],
      color: "#F59E0B",
      githubUrl: "https://github.com/bastian-js/giveaway-bot",
    },
    {
      title: "Echoverse",
      description:
        "Educational 2D game developed for a school project featuring puzzle mechanics and interactive UI elements. (The Game is working a little bit, there is no Level 9 and ladders don't work.",
      technologies: ["JavaScript", "Phaser", "HTML"],
      color: "#EF4444",
      liveUrl: "https://echoverse.bbastian.dev",
      showGithub: false,
    },
    {
      title: "Portfolio Website v1",
      description:
        "First iteration of my personal portfolio website, showcasing my projects and skills with a clean, modern design.",
      technologies: ["HTML", "CSS", "JavaScript"],
      color: "#8B5CF6",
      githubUrl: "https://github.com/bastian-js/bbastian.xyz-old",
    },
  ];

  return (
    <div className="pt-22">
      <Infobox items={infoboxItems} />

      <ProjectsGrid projects={projects} />
    </div>
  );
}

export default Projects;
