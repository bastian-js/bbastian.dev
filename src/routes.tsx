import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Socials from "./pages/Socials";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/socials",
    element: <Socials />,
  },
];

export default routes;
