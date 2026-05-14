import AboutSection from "./pages/About";
import Contact from "./pages/Contact";
import DropNote from "./pages/DropNote";
import Home from "./pages/Home";
import Now from "./pages/Now";
import Privacy from "./pages/Privacy";
import Projects from "./pages/Projects";
import ProPerform from "./pages/ProPerform";
import Setup from "./pages/Setup";
import Socials from "./pages/Socials";
import Terms from "./pages/Terms";

// Noury
import Noury from "./pages/noury/Page";
import NouryPrivacy from "./pages/noury/Privacy";
import NouryTerms from "./pages/noury/Terms";

// Spotify
import SpotifyCallback from "./pages/spotify/Callback";
import SpotifyArtistHallOfFame from "./pages/spotify/ArtistHallOfFame";
import SpotifyHallOfFame from "./pages/spotify/HallOfFame";
import SpotifyStats from "./pages/spotify/Stats";

// Apps
import PiggyTrack from "./pages/PiggyTrack";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/projects", element: <Projects /> },
  { path: "/socials", element: <Socials /> },
  { path: "/contact", element: <Contact /> },
  { path: "/about", element: <AboutSection /> },
  { path: "/now", element: <Now /> },
  { path: "/setup", element: <Setup /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/terms", element: <Terms /> },

  // Noury
  { path: "/noury", element: <Noury /> },
  { path: "/noury/privacy", element: <NouryPrivacy /> },
  { path: "/noury/terms", element: <NouryTerms /> },

  // Spotify
  { path: "/spotify/stats", element: <SpotifyStats /> },
  { path: "/spotify-callback", element: <SpotifyCallback /> },
  { path: "/spotify/hall-of-fame", element: <SpotifyHallOfFame /> },
  { path: "/spotify/artist-hall-of-fame", element: <SpotifyArtistHallOfFame /> },

  // Apps
  { path: "/piggytrack", element: <PiggyTrack /> },
  { path: "/dropnote", element: <DropNote /> },
  { path: "/properform", element: <ProPerform /> },
];

export default routes;
