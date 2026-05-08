import { useState, useEffect } from "react";
import { X, Menu, Keyboard, BarChart2, Trophy, Mic2, Search } from "lucide-react";
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

          {/* Right: spotify + nav + icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Spotify button */}
            <button
              onClick={() => setShowSpotify(!showSpotify)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/8 hover:border-white/15 hover:bg-white/8 transition cursor-pointer"
            >
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${getStatusColor()}`} />
              <span className="text-xs font-medium tracking-wide text-gray-400">NOW PLAYING</span>
            </button>

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
        className={`fixed z-50 w-[calc(100vw-32px)] max-w-96 transition-[opacity,transform] duration-200 ease-out ${
          showSpotify ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          top: "80px",
          left: "50%",
          transform: `translateX(-50%) translateY(${showSpotify ? "0px" : "-8px"})`,
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

            return (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                {/* Ambient blurred background */}
                {art && (
                  <div
                    className="absolute inset-0 scale-110 opacity-25"
                    style={{
                      backgroundImage: `url(${art})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(28px)",
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-[#0c0c0c]/80 backdrop-blur-sm" />

                <div className="relative p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {isPlaying ? (
                        <div className="flex items-end gap-[3px] h-4">
                          <div className="eq1 w-[3px] rounded-full bg-green-400" />
                          <div className="eq2 w-[3px] rounded-full bg-green-400" />
                          <div className="eq3 w-[3px] rounded-full bg-green-400" />
                        </div>
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                      )}
                      <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                        {getStatusText()}
                      </span>
                    </div>
                    <button
                      className="text-gray-500 hover:text-white transition cursor-pointer group"
                      onClick={() => setShowSpotify(false)}
                    >
                      <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                    </button>
                  </div>

                  {/* Art + Info */}
                  {(art || title) && (
                    <div className="flex gap-4 items-center mb-4">
                      {art && (
                        <img
                          src={art}
                          className={`w-16 h-16 rounded-xl shrink-0 shadow-lg ${isIdle ? "opacity-50 grayscale" : ""}`}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white truncate leading-tight">{title}</p>
                        <p className="text-sm text-gray-400 truncate mt-0.5">{sub}</p>
                        {album && <p className="text-xs text-gray-600 truncate mt-0.5">{album}</p>}
                      </div>
                    </div>
                  )}

                  {/* Progress bar */}
                  {isPlaying && duration > 1 && (
                    <div className="mb-4">
                      <div className="relative h-1 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-linear-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
                          style={{ width: `${(progress / duration) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-600 mt-1.5">
                        <span>{Math.floor(progress / 60000)}:{String(Math.floor((progress % 60000) / 1000)).padStart(2, "0")}</span>
                        <span>{Math.floor(duration / 60000)}:{String(Math.floor((duration % 60000) / 1000)).padStart(2, "0")}</span>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Link
                        to="/spotify/stats"
                        onClick={() => setShowSpotify(false)}
                        className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/8 bg-white/3 hover:border-[#1DB954]/30 hover:bg-[#1DB954]/8 transition-all duration-200 group"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#1DB954] transition-colors shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-gray-300 group-hover:text-white transition-colors leading-none mb-0.5">Top Tracks</p>
                          <p className="text-[10px] text-gray-600 leading-none">Stats</p>
                        </div>
                      </Link>
                      <Link
                        to="/spotify/hall-of-fame"
                        onClick={() => setShowSpotify(false)}
                        className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/8 bg-white/3 hover:border-[#1DB954]/30 hover:bg-[#1DB954]/8 transition-all duration-200 group"
                      >
                        <Trophy className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#1DB954] transition-colors shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-gray-300 group-hover:text-white transition-colors leading-none mb-0.5">Songs</p>
                          <p className="text-[10px] text-gray-600 leading-none">Hall of Fame</p>
                        </div>
                      </Link>
                      <Link
                        to="/spotify/artist-hall-of-fame"
                        onClick={() => setShowSpotify(false)}
                        className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/8 bg-white/3 hover:border-[#1DB954]/30 hover:bg-[#1DB954]/8 transition-all duration-200 group"
                      >
                        <Mic2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#1DB954] transition-colors shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-gray-300 group-hover:text-white transition-colors leading-none mb-0.5">Artists</p>
                          <p className="text-[10px] text-gray-600 leading-none">Hall of Fame</p>
                        </div>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-600 font-medium tracking-wide uppercase">Spotify</span>
                      <div className="flex items-center gap-3">
                        {url && isPlaying && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-gray-500 hover:text-green-400 transition flex items-center gap-1 group"
                          >
                            Open in Spotify
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                          </a>
                        )}
                        {isIdle && <span className="text-[11px] text-gray-600">Not playing</span>}
                        {spotifyData.status === "error" && <span className="text-[11px] text-red-500/70">Unavailable</span>}
                      </div>
                    </div>
                  </div>
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
