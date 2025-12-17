import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

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

interface SpotifyStatus {
  status: "playing" | "idle" | "error";
  track?: SpotifyTrack;
  lastPlayed?: {
    title: string;
    artist: string;
    albumArt: string;
  };
}

function NavBar() {
  const [showSpotify, setShowSpotify] = useState(false);
  const [spotifyData, setSpotifyData] = useState<SpotifyStatus>({
    status: "idle",
  });
  const [audioData, setAudioData] = useState<number[]>(new Array(50).fill(0));

  // Fetch Spotify data
  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/spotify/now-playing"
        );

        const data = await response.json();
        setSpotifyData(data);
      } catch (error) {
        setSpotifyData({ status: "error" });
      }
    };

    fetchSpotify();
    const interval = setInterval(fetchSpotify, 5000);
    return () => clearInterval(interval);
  }, []);

  // Visualizer animation with completely random pattern
  useEffect(() => {
    if (spotifyData.status === "playing" && showSpotify) {
      const interval = setInterval(() => {
        setAudioData(new Array(50).fill(0).map(() => Math.random() * 100));
      }, 150);
      return () => clearInterval(interval);
    }
  }, [spotifyData.status, showSpotify]);

  const getStatusColor = () => {
    switch (spotifyData.status) {
      case "playing":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (spotifyData.status) {
      case "playing":
        return "Now Playing";
      case "idle":
        return "Last Played";
      case "error":
        return "Offline";
      default:
        return "Now Playing";
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[#0a0a0a] flex items-center justify-between px-8 py-4 z-50 border-b border-white/5">
        {/* Logo */}
        <div className="text-xl font-semibold tracking-tight">
          <a href="/">bbastian.dev</a>
        </div>

        {/* Now Playing */}
        <button
          onClick={() => setShowSpotify(!showSpotify)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full border border-white/5 hover:border-white/10 transition-all hover:scale-105"
        >
          <div
            className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}
          ></div>
          <span className="text-sm font-medium">NOW PLAYING</span>
        </button>

        {/* Navigation Items */}
        <div className="flex items-center gap-10 text-sm font-medium">
          <a href="/projects" className="hover:opacity-70 transition">
            PROJECTS
          </a>
          <a href="/socials" className="hover:opacity-70 transition">
            SOCIALS
          </a>
          <a href="/contact" className="hover:opacity-70 transition">
            CONTACT
          </a>
        </div>
      </nav>

      {/* Dynamic Island Popup */}
      {showSpotify && (
        <div
          className="fixed z-50 animate-in fade-in slide-in-from-top-5 duration-300"
          style={{ top: "80px", left: "50%", transform: "translateX(-50%)" }}
        >
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 w-96 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor()}`}
                ></div>
                <h3 className="text-white font-semibold">{getStatusText()}</h3>
              </div>
              <button
                onClick={() => setShowSpotify(false)}
                className="text-gray-400 hover:text-white transition cursor-pointer group"
              >
                <X className="w-5.5 h-5.5 transition-transform duration-500 ease-in-out group-hover:rotate-180" />
              </button>
            </div>

            {spotifyData.status === "playing" && spotifyData.track ? (
              <>
                <div className="flex gap-4 mb-4">
                  {spotifyData.track.url ? (
                    <a
                      href={spotifyData.track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                    >
                      <img
                        src={spotifyData.track.albumArt}
                        alt={spotifyData.track.album}
                        className="w-20 h-20 rounded-lg"
                      />
                    </a>
                  ) : (
                    <img
                      src={spotifyData.track.albumArt}
                      alt={spotifyData.track.album}
                      className="w-20 h-20 rounded-lg"
                    />
                  )}
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    {spotifyData.track.url ? (
                      <a
                        href={spotifyData.track.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer group"
                      >
                        <h4 className="text-white font-semibold text-lg break-words group-hover:text-green-400 transition-colors">
                          {spotifyData.track.title}
                        </h4>
                      </a>
                    ) : (
                      <h4 className="text-white font-semibold text-lg break-words">
                        {spotifyData.track.title}
                      </h4>
                    )}
                    <p className="text-gray-400 text-sm truncate">
                      {spotifyData.track.artist}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {spotifyData.track.album}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="relative h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
                      style={{
                        width: `${
                          (spotifyData.track.progress /
                            spotifyData.track.duration) *
                          100
                        }%`,
                        boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {Math.floor(spotifyData.track.progress / 60000)}:
                      {String(
                        Math.floor((spotifyData.track.progress % 60000) / 1000)
                      ).padStart(2, "0")}
                    </span>
                    <span>
                      {Math.floor(spotifyData.track.duration / 60000)}:
                      {String(
                        Math.floor((spotifyData.track.duration % 60000) / 1000)
                      ).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </>
            ) : spotifyData.status === "idle" && spotifyData.lastPlayed ? (
              <div className="flex gap-4">
                <img
                  src={spotifyData.lastPlayed.albumArt}
                  alt="Last played"
                  className="w-20 h-20 rounded-lg opacity-60"
                />
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-white font-semibold text-lg truncate">
                    {spotifyData.lastPlayed.title}
                  </h4>
                  <p className="text-gray-400 text-sm truncate">
                    {spotifyData.lastPlayed.artist}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">Not playing</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Unable to fetch Spotify data</p>
                <p className="text-gray-500 text-sm mt-2">
                  Check API connection
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
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
