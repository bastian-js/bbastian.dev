import Infobox from "../components/Infobox";
import TechnologiesGrid from "../components/TechnologiesGrid";
import VerticalTimeline from "../components/VerticalTimeline";

function Home() {
  const timelineItems = [
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
    { name: "C#", icon: "/csharp.svg" },
    { name: "HTML", icon: "/html.svg" },
    { name: "CSS", icon: "/css.svg" },
  ];

  return (
    <div className="pt-22">
      <Infobox items={infoboxItems} />

      <VerticalTimeline items={timelineItems} />

      <h2 className="text-4xl font-bold mt-5">Technologies</h2>

      <TechnologiesGrid items={technologiesGridItems} />
    </div>
  );
}

export default Home;
