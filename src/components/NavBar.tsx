import { useState, useEffect } from "react";
import { X, Menu, Keyboard, BarChart2, Trophy, Mic2, Search, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  url?: string;
}

interface SpotifyEpisode {
  title: string;
  show: string;
  image: string;
  progress: number;
  duration: number;
  url?: string;
}

interface SpotifyStatus {
  status: "playing" | "idle" | "error";
  type?: "track" | "episode";
  track?: SpotifyTrack;
  episode?: SpotifyEpisode;
  lastPlayed?: {
    title: string;
    artist: string;
    albumArt: string;
  };
}

interface NavBarProps {
  onOpenShortcuts?: () => void;
  onOpenSearch?: () => void;
}

function NavBar({ onOpenShortcuts, onOpenSearch }: NavBarProps) {
  const location = useLocation();
  const path = location.pathname;

  const [showSpotify, setShowSpotify] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spotifyData, setSpotifyData] = useState<SpotifyStatus>({
    status: "idle",
  });
  const [, setAudioData] = useState<number[]>(new Array(50).fill(0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu and spotify on route change
  useEffect(() => {
    setMenuOpen(false);
    setShowSpotify(false);
  }, [location.pathname]);

  // Fetch Spotify
  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const res = await fetch("https://api.bbastian.dev/spotify/now-playing");
        const data = await res.json();
        setSpotifyData(data);
      } catch {
        setSpotifyData({ status: "error" });
      }
    };

    fetchSpotify();
    const i = setInterval(fetchSpotify, 5000);
    return () => clearInterval(i);
  }, []);

  // Fake visualizer
  useEffect(() => {
    if (spotifyData.status === "playing" && showSpotify) {
      const i = setInterval(() => {
        setAudioData(new Array(50).fill(0).map(() => Math.random() * 100));
      }, 150);
      return () => clearInterval(i);
    }
  }, [spotifyData.status, showSpotify]);

  const getStatusColor = () =>
    spotifyData.status === "playing"
      ? "bg-green-500"
      : spotifyData.status === "idle"
        ? "bg-yellow-500"
        : "bg-red-500";

  const getStatusText = () =>
    spotifyData.status === "playing"
      ? "Now Playing"
      : spotifyData.status === "idle"
        ? "Last Played"
        : "Offline";

  const navLinks = ["/projects", "/socials", "/about", "/contact"];

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-5xl">
        <div className={`flex items-center justify-between px-4 sm:px-5 py-3 rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 shadow-xl shadow-black/30"
            : "bg-[#0a0a0a]/75 backdrop-blur-md border-white/6"
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group w-fit shrink-0">
            <span className="relative font-mono text-sm leading-none select-none overflow-hidden block">
              <span className="flex transition-transform duration-300 group-hover:-translate-y-full">
                <span className="text-emerald-400">&lt;</span>
                <span className="text-white font-bold">B</span>
                <span className="text-emerald-400">/&gt;</span>
              </span>
              <span className="absolute inset-0 flex translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                <span className="text-emerald-400">&lt;/</span>
                <span className="text-white font-bold">B</span>
                <span className="text-emerald-400">&gt;</span>
              </span>
            </span>
            <span className="relative text-xl font-semibold overflow-hidden block">
              <span className="flex">
                {"bbastian.dev".split("").map((char, i) => (
                  <span
                    key={i}
                    className="inline-block transition-transform duration-300 group-hover:-translate-y-full"
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              <span className="absolute inset-0 flex">
                {"bbastian.dev".split("").map((char, i) => (
                  <span
                    key={i}
                    className="inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-emerald-400"
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>
          </Link>

          {/* Right: nav + icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-7 text-sm">
              {navLinks.map((href) => (
                <Link
                  key={href}
                  to={href}
                  className={`relative transition-colors ${
                    path === href ? "text-white" : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {href.replace("/", "").toUpperCase()}
                  <span className={`absolute left-0 -bottom-2 h-0.5 rounded-full transition-all ${
                    path === href ? "w-full bg-emerald-400" : "w-0 bg-emerald-400 hover:w-full"
                  }`} />
                </Link>
              ))}
              <button
                onClick={onOpenSearch}
                title="Search (Ctrl+K)"
                className="text-gray-500 hover:text-gray-200 transition cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenShortcuts}
                title="Keyboard shortcuts (?)"
                className="text-gray-500 hover:text-gray-200 transition cursor-pointer"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            </div>

            {/* Search (mobile) */}
            <button
              className="md:hidden p-1.5 text-gray-400 hover:text-white transition cursor-pointer"
              onClick={onOpenSearch}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 text-gray-400 hover:text-white transition cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Notch tab */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full">
          <button
            onClick={() => setShowSpotify(!showSpotify)}
            className="flex items-center gap-1.5 px-3 py-1 cursor-pointer group"
            style={{
              background: scrolled ? "rgba(10,10,10,0.95)" : "rgba(10,10,10,0.75)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: "none",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <ChevronDown
              className="w-3 h-3 transition-transform duration-300 group-hover:translate-y-0.5"
              style={{
                color: spotifyData.status === "playing"
                  ? "#22c55e"
                  : spotifyData.status === "idle"
                  ? "#eab308"
                  : "#ef4444",
              }}
            />
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-gray-500 group-hover:text-gray-300 transition-colors duration-150">
              Now Playing
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="fixed top-[76px] left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-5xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl z-40 px-4 py-2 md:hidden flex flex-col shadow-xl shadow-black/30">
          {navLinks.map((href) => (
            <Link
              key={href}
              to={href}
              onClick={() => setMenuOpen(false)}
              className={`py-3.5 text-sm font-medium transition-colors border-b border-white/5 last:border-0
                ${
                  path === href
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              {href.replace("/", "").toUpperCase()}
              {path === href && (
                <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 align-middle" />
              )}
            </Link>
          ))}
        </div>
      )}

      {/* SPOTIFY POPUP */}
      <div
        className={`fixed z-50 w-[calc(100vw-32px)] max-w-sm transition-[opacity,transform] duration-300 ease-out ${
          showSpotify ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          top: "80px",
          left: "50%",
          transform: `translateX(-50%) translateY(${showSpotify ? "0px" : "-10px"})`,
        }}
      >
        <style>{`
          @keyframes eq1 { 0%,100%{height:6px} 50%{height:14px} }
          @keyframes eq2 { 0%,100%{height:12px} 33%{height:4px} }
          @keyframes eq3 { 0%,100%{height:8px} 66%{height:16px} }
          .eq1 { animation: eq1 0.8s ease-in-out infinite; }
          .eq2 { animation: eq2 0.9s ease-in-out infinite 0.15s; }
          .eq3 { animation: eq3 0.75s ease-in-out infinite 0.3s; }
        `}</style>

        {(() => {
          const isPlaying = spotifyData.status === "playing";
          const isIdle = spotifyData.status === "idle";
          const t = spotifyData.track;
          const ep = spotifyData.episode;
          const lp = spotifyData.lastPlayed;
          const art = isPlaying ? (t?.albumArt ?? ep?.image ?? "") : (lp?.albumArt ?? "");
          const title = isPlaying ? (t?.title ?? ep?.title ?? "") : (lp?.title ?? "");
          const sub = isPlaying ? (t?.artist ?? ep?.show ?? "") : (lp?.artist ?? "");
          const album = t?.album ?? "";
          const url = t?.url ?? ep?.url ?? "";
          const progress = t?.progress ?? ep?.progress ?? 0;
          const duration = t?.duration ?? ep?.duration ?? 1;
          const seam = isPlaying ? "#22c55e" : isIdle ? "#eab308" : "#ef4444";

          return (
            <div
              className="overflow-hidden"
              style={{
                background: "#0e0e0e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            >
              {/* Color seam */}
              <div style={{
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${seam}, transparent)`,
                boxShadow: `0 0 16px 3px ${seam}50`,
              }} />

              <div className="p-5">
                {/* Header row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    {isPlaying ? (
                      <div className="flex items-end gap-[3px] h-3.5">
                        <div className="eq1 w-[3px] rounded-full" style={{ background: seam }} />
                        <div className="eq2 w-[3px] rounded-full" style={{ background: seam }} />
                        <div className="eq3 w-[3px] rounded-full" style={{ background: seam }} />
                      </div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: seam }} />
                    )}
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {getStatusText()}
                    </span>
                  </div>
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-white transition-colors cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                    onClick={() => setShowSpotify(false)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Art + Track info */}
                {(art || title) && (
                  <div className="flex gap-4 items-center mb-5">
                    {art && (
                      <img
                        src={art}
                        alt={title}
                        className="w-14 h-14 shrink-0"
                        style={{
                          borderRadius: "10px",
                          filter: isIdle ? "grayscale(1) opacity(0.5)" : "none",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white truncate leading-tight text-sm mb-0.5">{title}</p>
                      <p className="text-xs text-gray-400 truncate">{sub}</p>
                      {album && <p className="text-[11px] text-gray-600 truncate mt-0.5">{album}</p>}
                    </div>
                  </div>
                )}

                {/* Progress */}
                {isPlaying && duration > 1 && (
                  <div className="mb-5">
                    <div className="relative h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                        style={{ width: `${(progress / duration) * 100}%`, background: seam }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1.5 font-mono">
                      <span>{Math.floor(progress / 60000)}:{String(Math.floor((progress % 60000) / 1000)).padStart(2, "0")}</span>
                      <span>{Math.floor(duration / 60000)}:{String(Math.floor((duration % 60000) / 1000)).padStart(2, "0")}</span>
                    </div>
                  </div>
                )}

                {/* Spotify links */}
                <div
                  className="flex gap-2 pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {[
                    { to: "/spotify/stats", Icon: BarChart2, label: "Top Tracks", sub: "Stats" },
                    { to: "/spotify/hall-of-fame", Icon: Trophy, label: "Songs", sub: "Hall of Fame" },
                    { to: "/spotify/artist-hall-of-fame", Icon: Mic2, label: "Artists", sub: "Hall of Fame" },
                  ].map(({ to, Icon, label, sub: s }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setShowSpotify(false)}
                      className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all duration-150 group"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#1DB95430"; (e.currentTarget as HTMLElement).style.background = "#1DB95410"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    >
                      <Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#1DB954] transition-colors" />
                      <p className="text-[10px] font-semibold text-gray-400 group-hover:text-white transition-colors leading-none">{label}</p>
                      <p className="text-[9px] text-gray-700 leading-none">{s}</p>
                    </Link>
                  ))}
                </div>

                {/* Open in Spotify / status */}
                {(url && isPlaying) || isIdle || spotifyData.status === "error" ? (
                  <div className="flex justify-end mt-3">
                    {url && isPlaying && (
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] font-mono text-gray-600 hover:text-[#1DB954] transition-colors flex items-center gap-1">
                        Open in Spotify →
                      </a>
                    )}
                    {isIdle && <span className="text-[10px] font-mono text-gray-700">Nothing playing right now</span>}
                    {spotifyData.status === "error" && <span className="text-[10px] font-mono text-red-500/50">Unavailable</span>}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })()}
      </div>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${
          showSpotify ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowSpotify(false)}
      />
    </>
  );
}

export default NavBar;
