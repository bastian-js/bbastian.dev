import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
  const [spotifyData, setSpotifyData] = useState<SpotifyStatus>({
    status: "idle",
  });
  const [, setAudioData] = useState<number[]>(new Array(50).fill(0));

  // Fetch Spotify
  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const res = await fetch(
          "https://api.bbastian.dev/api/spotify/now-playing",
        );
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
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400"
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

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full bg-[#0a0a0a] px-8 py-4 z-50 border-b border-white/5 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">
          bbastian.dev
        </Link>

        <button
          onClick={() => setShowSpotify(!showSpotify)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full border border-white/5 hover:scale-105 transition cursor-pointer"
        >
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor()}`}
          />
          <span className="text-sm">NOW PLAYING</span>
        </button>

        {/* NAV ITEMS */}
        <div className="flex gap-10 text-sm">
          {["/projects", "/socials", "/about", "/contact"].map((href) => (
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
                className={`absolute left-0 bottom-0 h-[2px] rounded-full transition-all
                  ${
                    path === href
                      ? "w-full bg-emerald-400"
                      : "w-0 bg-emerald-400 hover:w-full"
                  }`}
              />
            </Link>
          ))}
        </div>
      </nav>

      {/* SPOTIFY POPUP */}
      {showSpotify && (
        <div
          className="fixed z-50"
          style={{ top: "80px", left: "50%", transform: "translateX(-50%)" }}
        >
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 w-96 shadow-2xl">
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
                      className="w-20 h-20 rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold">
                        {spotifyData.track.title}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {spotifyData.track.artist}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
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
                      className="w-20 h-20 rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold">
                        {spotifyData.episode.title}
                      </h4>
                      <p className="text-sm text-gray-400">
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
                  className="w-20 h-20 rounded-lg opacity-60"
                />
                <div>
                  <h4 className="font-semibold">
                    {spotifyData.lastPlayed.title}
                  </h4>
                  <p className="text-sm text-gray-400">
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
