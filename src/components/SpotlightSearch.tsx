import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchItem {
  label: string;
  description: string;
  path: string;
  category: string;
}

const ITEMS: SearchItem[] = [
  { label: "Home", description: "About me, timeline, tech stack, setup", path: "/", category: "Pages" },
  { label: "Projects", description: "All my projects", path: "/projects", category: "Pages" },
  { label: "About", description: "More about me", path: "/about", category: "Pages" },
  { label: "Now", description: "What I'm currently up to", path: "/now", category: "Pages" },
  { label: "Contact", description: "Get in touch", path: "/contact", category: "Pages" },
  { label: "Socials", description: "Social media links", path: "/socials", category: "Pages" },
  { label: "Drop Note", description: "Leave me an anonymous message", path: "/dropnote", category: "Pages" },
  { label: "Noury", description: "AI calorie tracking app", path: "/noury", category: "Projects" },
  { label: "PiggyTrack", description: "Savings tracking app", path: "/piggytrack", category: "Projects" },
  { label: "ProPerform", description: "Workout tracking diploma project", path: "/properform", category: "Projects" },
  { label: "Spotify Stats", description: "My listening stats & top tracks", path: "/spotify/stats", category: "Spotify" },
  { label: "Song Hall of Fame", description: "My most played songs", path: "/spotify/hall-of-fame", category: "Spotify" },
  { label: "Artist Hall of Fame", description: "My most played artists", path: "/spotify/artist-hall-of-fame", category: "Spotify" },
];

interface Props {
  onClose: () => void;
}

export default function SpotlightSearch({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = query.trim()
    ? ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      )
    : ITEMS;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        if (results[selected]) {
          navigate(results[selected].path);
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [results, selected, navigate, onClose]);

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-xl bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, projects..."
            className="flex-1 bg-transparent text-white text-base outline-none placeholder:text-gray-600"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-gray-600 hover:text-gray-400 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="text-xs bg-[#1a1a1a] border border-white/10 text-gray-600 px-1.5 py-0.5 rounded font-mono shrink-0">
              Esc
            </kbd>
          )}
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="text-center text-gray-600 text-sm py-8">No results</p>
          ) : (
            (() => {
              let lastCat = "";
              return results.map((item, i) => {
                const showCat = item.category !== lastCat;
                lastCat = item.category;
                return (
                  <div key={item.path}>
                    {showCat && (
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest px-4 pt-3 pb-1.5 first:pt-1">
                        {item.category}
                      </p>
                    )}
                    <button
                      className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors text-left group ${
                        i === selected ? "bg-white/5" : "hover:bg-white/3"
                      }`}
                      onClick={() => go(item.path)}
                      onMouseEnter={() => setSelected(i)}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                      </div>
                      <ArrowRight
                        className={`w-3.5 h-3.5 text-gray-600 shrink-0 ml-3 transition-opacity ${
                          i === selected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </button>
                  </div>
                );
              });
            })()
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-4 text-[10px] text-gray-600 font-mono">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
