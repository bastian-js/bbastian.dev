import Footer from "../components/Footer";
import Infobox from "../components/Infobox";
import ProjectsGrid from "../components/ProjectsGrid";
import TechnologiesGrid from "../components/TechnologiesGrid";

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
      title: "DailyBite",
      description:
        "Calorie tracking app with a refined UI and Austrian food products integrated into the database for accurate nutrition tracking.",
      technologies: ["Swift", "iOS", "MariaDB"],
      color: "#3B82F6",
      githubUrl: "https://github.com/yourusername/dailybite",
      badgeColor: "#3B82F6",
      badge: "COMING SOON",
      showGithub: false,
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
    {
      title: "Task Manager",
      description:
        "Simple yet effective task management application with priority sorting and deadline tracking functionality.",
      technologies: ["React", "TypeScript", "Local Storage"],
      color: "#EC4899",
      githubUrl: "https://github.com/yourusername/task-manager",
      liveUrl: "#",
    },
  ];

  const technologiesGridItems = [
    { name: "TypeScript", icon: "/typescript.svg" },
    { name: "JavaScript", icon: "/javascript.svg" },
    { name: "React", icon: "/react.svg" },
    { name: "C#", icon: "/csharp.svg" },
    { name: "HTML", icon: "/html.svg" },
    { name: "CSS", icon: "/css.svg" },
  ];

  return (
    <div className="pt-22">
      <Infobox items={infoboxItems} />

      <ProjectsGrid projects={projects} />

      <h2 className="text-4xl font-bold mt-5 text-center -mb-8">
        Technologies
      </h2>

      <TechnologiesGrid items={technologiesGridItems} />

      <Footer currentPage="projects" />
    </div>
  );
}

export default Projects;
