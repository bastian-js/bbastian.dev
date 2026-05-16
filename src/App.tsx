import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import routes from "./routes";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Minesweeper from "./components/Minesweeper";
import HackerTerminal from "./components/HackerTerminal";
import ShortcutsOverlay from "./components/ShortcutsOverlay";
import SpotlightSearch from "./components/SpotlightSearch";
import MatrixRain from "./components/MatrixRain";
import Snake from "./components/Snake";
import SplashScreen from "./components/SplashScreen";
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
  const [search, setSearch] = useState(false);
  const [matrix, setMatrix] = useState(false);
  const [snake, setSnake] = useState(false);

  const seqRef = useRef<string[]>([]);
  const konamiIdxRef = useRef(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const histIdxRef = useRef<number>(window.history.state?.idx ?? 0);
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (firstRender.current) {
      firstRender.current = false;
      histIdxRef.current = window.history.state?.idx ?? 0;
      return;
    }
    const idx = window.history.state?.idx ?? 0;
    const isBack = idx < histIdxRef.current;
    histIdxRef.current = idx;
    const el = pageRef.current;
    if (!el) return;
    el.classList.remove("page-enter-forward", "page-enter-back");
    void el.offsetWidth;
    el.classList.add(isBack ? "page-enter-back" : "page-enter-forward");
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // Ctrl+K / Cmd+K → search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((s) => !s);
        return;
      }

      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const key = e.key;

      if (key === "Escape") {
        setMinesweeper(false);
        setHacker(false);
        setShortcuts(false);
        setSearch(false);
        setMatrix(false);
        setSnake(false);
        return;
      }

      // Konami code → hacker terminal
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

      if (key === "/") {
        setSearch((s) => !s);
        return;
      }

      // Typed sequences: mine / snake / matrix
      if (key.length === 1) {
        seqRef.current = [...seqRef.current, key.toLowerCase()].slice(-6);
        const seq = seqRef.current.join("");
        if (seq.endsWith("mine")) {
          seqRef.current = [];
          setMinesweeper(true);
          return;
        }
        if (seq.endsWith("snake")) {
          seqRef.current = [];
          setSnake(true);
          return;
        }
        if (seq.endsWith("matrix")) {
          seqRef.current = [];
          setMatrix(true);
          return;
        }
      }

      // Navigation (only when no overlay open)
      if (minesweeper || hacker || shortcuts || search || matrix || snake) return;
      switch (key.toLowerCase()) {
        case "h": navigate("/"); break;
        case "p": navigate("/projects"); break;
        case "s": navigate("/socials"); break;
        case "a": navigate("/about"); break;
        case "c": navigate("/contact"); break;
        case "n": navigate("/now"); break;
        case "l": navigate("/leave-a-word"); break;
        case "g": window.open("https://github.com/bastian-js", "_blank"); break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, minesweeper, hacker, shortcuts, search, matrix, snake]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavBar
          onOpenShortcuts={() => setShortcuts(true)}
          onOpenSearch={() => setSearch(true)}
        />
        <main className="flex-1 flex justify-center">
          <div ref={pageRef} className="container text-center">
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

      <SplashScreen />
      {minesweeper && <Minesweeper onClose={() => setMinesweeper(false)} />}
      {hacker && <HackerTerminal onClose={() => setHacker(false)} />}
      {shortcuts && <ShortcutsOverlay onClose={() => setShortcuts(false)} />}
      {search && <SpotlightSearch onClose={() => setSearch(false)} />}
      {matrix && <MatrixRain onClose={() => setMatrix(false)} />}
      {snake && <Snake onClose={() => setSnake(false)} />}
    </>
  );
}

export default App;
