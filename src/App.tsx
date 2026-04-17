import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import routes from "./routes";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Minesweeper from "./components/Minesweeper";
import HackerTerminal from "./components/HackerTerminal";
import ShortcutsOverlay from "./components/ShortcutsOverlay";
import NotFound from "./pages/NotFound";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [minesweeper, setMinesweeper] = useState(false);
  const [hacker, setHacker] = useState(false);
  const [shortcuts, setShortcuts] = useState(false);

  const seqRef = useRef<string[]>([]);
  const konamiIdxRef = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const key = e.key;

      if (key === "Escape") {
        setMinesweeper(false);
        setHacker(false);
        setShortcuts(false);
        return;
      }

      // Konami code (index-based, resets on wrong key)
      if (key === KONAMI[konamiIdxRef.current]) {
        konamiIdxRef.current++;
        if (konamiIdxRef.current === KONAMI.length) {
          konamiIdxRef.current = 0;
          setHacker(true);
          return;
        }
      } else {
        konamiIdxRef.current = key === KONAMI[0] ? 1 : 0;
      }

      if (key === "?") {
        setShortcuts((s) => !s);
        return;
      }

      // "mine" sequence
      if (key.length === 1) {
        seqRef.current = [...seqRef.current, key.toLowerCase()].slice(-4);
        if (seqRef.current.join("") === "mine") {
          seqRef.current = [];
          setMinesweeper(true);
          return;
        }
      }

      // Navigation (only when no overlay open)
      if (minesweeper || hacker || shortcuts) return;
      switch (key.toLowerCase()) {
        case "h":
          navigate("/");
          break;
        case "p":
          navigate("/projects");
          break;
        case "s":
          navigate("/socials");
          break;
        case "a":
          navigate("/about");
          break;
        case "c":
          navigate("/contact");
          break;
        case "g":
          window.open("https://github.com/bastian-js", "_blank");
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, minesweeper, hacker, shortcuts]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavBar onOpenShortcuts={() => setShortcuts(true)} />
        <main className="flex-1 flex justify-center">
          <div className="container text-center">
            <Routes>
              {routes.map((route, i) => (
                <Route key={i} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>

      {minesweeper && <Minesweeper onClose={() => setMinesweeper(false)} />}
      {hacker && <HackerTerminal onClose={() => setHacker(false)} />}
      {shortcuts && <ShortcutsOverlay onClose={() => setShortcuts(false)} />}
    </>
  );
}

export default App;
