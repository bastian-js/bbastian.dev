import AboutSection from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Noury from "./pages/Noury";
import Privacy from "./pages/Privacy";
import Projects from "./pages/Projects";
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
];

export default routes;
