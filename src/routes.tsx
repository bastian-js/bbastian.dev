import AboutSection from "./pages/About";
import Contact from "./pages/Contact";
import DropNote from "./pages/DropNote";
import Home from "./pages/Home";
import Noury from "./pages/Noury";
import PiggyTrack from "./pages/PiggyTrack";
import Privacy from "./pages/Privacy";
import Projects from "./pages/Projects";
import ProPerform from "./pages/ProPerform";
import Socials from "./pages/Socials";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/noury",
    element: <Noury />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/socials",
    element: <Socials />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/about",
    element: <AboutSection />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/piggytrack",
    element: <PiggyTrack />,
  },
  {
    path: "/dropnote",
    element: <DropNote />,
  },
  {
    path: "/properform",
    element: <ProPerform />,
  },
];

export default routes;
