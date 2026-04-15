import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
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

function NavBar() {
  const location = useLocation();
  const path = location.pathname;

  const [showSpotify, setShowSpotify] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [spotifyData, setSpotifyData] = useState<SpotifyStatus>({
    status: "idle",
  });
  const [, setAudioData] = useState<number[]>(new Array(50).fill(0));

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

  const renderProgress = (progress: number, duration: number) => (
    <>
      <div className="relative h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-green-500 to-green-400"
          style={{ width: `${(progress / duration) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>
          {Math.floor(progress / 60000)}:
          {String(Math.floor((progress % 60000) / 1000)).padStart(2, "0")}
        </span>
        <span>
          {Math.floor(duration / 60000)}:
          {String(Math.floor((duration % 60000) / 1000)).padStart(2, "0")}
        </span>
      </div>
    </>
  );

  const navLinks = ["/projects", "/socials", "/about", "/contact"];

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full bg-[#0a0a0a] px-4 sm:px-6 lg:px-8 py-4 z-50 border-b border-white/5 grid grid-cols-3 items-center">
        {/* Left */}
        <Link to="/" className="text-xl font-semibold">
          bbastian.dev
        </Link>

        {/* Center */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowSpotify(!showSpotify)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1a1a1a] rounded-full border border-white/5 hover:scale-105 transition cursor-pointer"
          >
            <div
              className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${getStatusColor()}`}
            />
            <span className="text-sm">NOW PLAYING</span>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center justify-end">
          {/* Desktop nav links */}
          <div className="hidden md:flex gap-8 lg:gap-10 text-sm">
            {navLinks.map((href) => (
              <Link
                key={href}
                to={href}
                className={`relative pb-2 transition-colors
                  ${
                    path === href
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
              >
                {href.replace("/", "").toUpperCase()}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 rounded-full transition-all
                    ${
                      path === href
                        ? "w-full bg-emerald-400"
                        : "w-0 bg-emerald-400 hover:w-full"
                    }`}
                />
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5 transition-transform duration-300 rotate-0" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="fixed top-[57px] left-0 w-full bg-[#0a0a0a] border-b border-white/5 z-40 px-6 py-2 md:hidden flex flex-col">
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
      {showSpotify && (
        <div
          className="fixed z-50 w-[calc(100vw-32px)] max-w-96"
          style={{ top: "72px", left: "50%", transform: "translateX(-50%)" }}
        >
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor()}`}
                />
                <h3 className="font-semibold">{getStatusText()}</h3>
              </div>
              <button
                className="text-gray-400 hover:text-white transition cursor-pointer group"
                onClick={() => setShowSpotify(false)}
              >
                <X className="w-5.5 h-5.5 transition-transform duration-500 ease-in-out group-hover:rotate-180" />
              </button>
            </div>

            {/* TRACK */}
            {spotifyData.status === "playing" &&
              spotifyData.type === "track" &&
              spotifyData.track && (
                <>
                  <div className="flex gap-4 mb-4">
                    <img
                      src={spotifyData.track.albumArt}
                      className="w-20 h-20 rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold truncate">
                        {spotifyData.track.title}
                      </h4>
                      <p className="text-sm text-gray-400 truncate">
                        {spotifyData.track.artist}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {spotifyData.track.album}
                      </p>
                    </div>
                  </div>
                  {renderProgress(
                    spotifyData.track.progress,
                    spotifyData.track.duration,
                  )}
                </>
              )}

            {/* PODCAST */}
            {spotifyData.status === "playing" &&
              spotifyData.type === "episode" &&
              spotifyData.episode && (
                <>
                  <div className="flex gap-4 mb-4">
                    <img
                      src={spotifyData.episode.image}
                      className="w-20 h-20 rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold truncate">
                        {spotifyData.episode.title}
                      </h4>
                      <p className="text-sm text-gray-400 truncate">
                        {spotifyData.episode.show}
                      </p>
                    </div>
                  </div>
                  {renderProgress(
                    spotifyData.episode.progress,
                    spotifyData.episode.duration,
                  )}
                </>
              )}

            {/* IDLE */}
            {spotifyData.status === "idle" && spotifyData.lastPlayed && (
              <div className="flex gap-4">
                <img
                  src={spotifyData.lastPlayed.albumArt}
                  className="w-20 h-20 rounded-lg opacity-60 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-semibold truncate">
                    {spotifyData.lastPlayed.title}
                  </h4>
                  <p className="text-sm text-gray-400 truncate">
                    {spotifyData.lastPlayed.artist}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Not playing</p>
                </div>
              </div>
            )}

            {spotifyData.status === "error" && (
              <p className="text-center text-gray-400">
                Unable to fetch Spotify data
              </p>
            )}
          </div>
        </div>
      )}

      {showSpotify && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSpotify(false)}
        />
      )}
    </>
  );
}

export default NavBar;
