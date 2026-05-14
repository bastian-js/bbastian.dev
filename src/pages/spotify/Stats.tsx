import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

type TimeRange = "short_term" | "medium_term" | "long_term";

interface Track {
  rank: number;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  url: string;
  previewUrl: string | null;
  duration: number;
  popularity: number;
}

const filters: { label: string; value: TimeRange }[] = [
  { label: "Last Month", value: "short_term" },
  { label: "Last 6 Months", value: "medium_term" },
  { label: "Last Year", value: "long_term" },
];

const medals = [
  {
    label: "Gold",
    color: "#F5A623",
    shadow: "rgba(245,166,35,0.18)",
    border: "rgba(245,166,35,0.28)",
  },
  {
    label: "Silver",
    color: "#A8B8C8",
    shadow: "rgba(168,184,200,0.13)",
    border: "rgba(168,184,200,0.22)",
  },
  {
    label: "Bronze",
    color: "#C87941",
    shadow: "rgba(200,121,65,0.15)",
    border: "rgba(200,121,65,0.25)",
  },
];

function formatDuration(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${m}:${s}`;
}

function formatTotal(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

interface FeaturedCardProps {
  track: Track;
  medal: (typeof medals)[0];
  large?: boolean;
  isPlaying: boolean;
  onToggle: (url: string, e: React.MouseEvent) => void;
}

function FeaturedCard({
  track,
  medal,
  large,
  isPlaying,
  onToggle,
}: FeaturedCardProps) {
  const imgSize = large ? "w-20 h-20" : "w-14 h-14";
  const barH = large ? "h-20" : "h-14";
  const iconSize = large ? "w-6 h-6" : "w-5 h-5";

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative rounded-2xl overflow-hidden group transition-all duration-200"
      style={{
        border: `1px solid ${medal.border}`,
        boxShadow: `0 4px 24px ${medal.shadow}`,
      }}
    >
      <div
        className="absolute inset-0 scale-110 opacity-15 transition-opacity duration-500 group-hover:opacity-25"
        style={{
          backgroundImage: `url(${track.albumArt})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(36px)",
        }}
      />
      <div className="absolute inset-0 bg-[#0e0e0e]/85" />

      <div
        className={`relative flex items-center gap-4 ${large ? "p-6" : "p-4"}`}
      >
        {/* Album art + vertical popularity bar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <img
              src={track.albumArt}
              alt={track.album}
              className={`${imgSize} rounded-xl shadow-2xl shadow-black/60 object-cover transition-all duration-200 ${isPlaying ? "brightness-60" : ""}`}
            />
            {track.previewUrl && (
              <button
                onClick={(e) => onToggle(track.previewUrl!, e)}
                className={`absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 transition-opacity duration-200 cursor-pointer ${
                  isPlaying
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {isPlaying ? (
                  <Pause className={`${iconSize} text-white`} fill="white" />
                ) : (
                  <Play
                    className={`${iconSize} text-white ml-0.5`}
                    fill="white"
                  />
                )}
              </button>
            )}
          </div>
          {/* Vertical popularity bar */}
          <div
            className={`${barH} w-1 bg-white/6 rounded-full overflow-hidden flex flex-col justify-end`}
          >
            <div
              className="w-full rounded-full transition-all duration-700"
              style={{
                height: `${track.popularity}%`,
                background: medal.color + "99",
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
            style={{ color: medal.color }}
          >
            {medal.label}
          </p>
          <p
            className={`${large ? "text-xl" : "text-base"} font-bold text-white truncate leading-tight`}
          >
            {track.title}
          </p>
          <p
            className={`${large ? "text-sm" : "text-xs"} text-gray-400 truncate mt-0.5`}
          >
            {track.artist}
          </p>
          <p className="text-xs text-gray-600 truncate mt-0.5">{track.album}</p>
        </div>

        <span className="hidden sm:block text-xs font-mono text-gray-600 shrink-0">
          {formatDuration(track.duration)}
        </span>
      </div>
    </a>
  );
}

function SpotifyStats() {
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term");
  const [limit, setLimit] = useState<10 | 50>(10);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(false);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePreview = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
    } else {
      audioRef.current?.pause();
      const audio = new Audio(url);
      audio.volume = 0.75;
      audio.play();
      audio.onended = () => setPlayingUrl(null);
      audioRef.current = audio;
      setPlayingUrl(url);
    }
  };

  useEffect(
    () => () => {
      audioRef.current?.pause();
    },
    [],
  );

  useEffect(() => {
    audioRef.current?.pause();
    setPlayingUrl(null);
    setLoading(true);
    setError(false);
    fetch(
      `https://api.bbastian.dev/spotify/top-tracks?time_range=${timeRange}&limit=${limit}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setTracks(data.tracks || []);
        setLoading(false);
        setInitialized(true);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
        setInitialized(true);
      });
  }, [timeRange, limit]);

  const showSkeleton = loading && !initialized;
  const podium = tracks.slice(0, 3);
  const rest = tracks.slice(3);
  const totalMs = tracks.reduce((sum, t) => sum + t.duration, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-left">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Top Tracks</h1>
          <p className="text-gray-500 text-sm">My most played songs.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setTimeRange(f.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer border ${
                  timeRange === f.value
                    ? "bg-[#1DB954]/15 text-[#1DB954] border-[#1DB954]/25"
                    : "bg-transparent text-gray-500 border-white/8 hover:border-white/15 hover:text-gray-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-white/4 border border-white/8 rounded-full p-0.5">
            {([10, 50] as const).map((n) => (
              <button
                key={n}
                onClick={() => setLimit(n)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
                  limit === n
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Top {n}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-gray-600 text-sm py-12">
            Could not load tracks. Try again later.
          </p>
        )}

        {!error && (
          <div
            className={`transition-opacity duration-300 ${loading && initialized ? "opacity-40 pointer-events-none" : "opacity-100"}`}
          >
            {/* Podium */}
            <div className="flex flex-col gap-2 mb-2">
              {showSkeleton ? (
                <>
                  <div className="h-[108px] rounded-2xl bg-[#111] border border-white/6 animate-pulse" />
                  <div className="h-[86px] rounded-2xl bg-[#111] border border-white/6 animate-pulse" />
                  <div className="h-[86px] rounded-2xl bg-[#111] border border-white/6 animate-pulse" />
                </>
              ) : (
                podium.map((track, i) => (
                  <FeaturedCard
                    key={track.rank}
                    track={track}
                    medal={medals[i]}
                    large={i === 0}
                    isPlaying={
                      playingUrl === track.previewUrl &&
                      track.previewUrl !== null
                    }
                    onToggle={togglePreview}
                  />
                ))
              )}
            </div>

            {/* Divider */}
            {!showSkeleton && rest.length > 0 && (
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] text-gray-700 tracking-widest uppercase font-medium">
                  4 – {limit}
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
            )}

            {/* Tracks #4+ */}
            <div className="flex flex-col gap-1.5">
              {showSkeleton
                ? Array.from({ length: limit - 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-4 py-3.5 bg-[#111] border border-white/6 rounded-2xl animate-pulse"
                    >
                      <div className="w-5 shrink-0" />
                      <div className="w-10 h-10 rounded-lg bg-white/6 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-white/6 rounded w-1/2" />
                        <div className="h-3 bg-white/4 rounded w-1/3" />
                      </div>
                    </div>
                  ))
                : rest.map((track) => (
                    <a
                      key={track.rank}
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-4 py-3.5 bg-[#111] border border-white/6 rounded-2xl hover:border-white/12 hover:bg-white/3 transition-all duration-150 group"
                    >
                      <span className="text-xs font-mono text-gray-700 w-5 shrink-0 text-right">
                        {track.rank}
                      </span>
                      {/* Album art + play overlay */}
                      <div className="relative shrink-0">
                        <img
                          src={track.albumArt}
                          alt={track.album}
                          className={`w-10 h-10 rounded-lg object-cover transition-all duration-200 ${
                            playingUrl === track.previewUrl &&
                            track.previewUrl !== null
                              ? "brightness-60"
                              : ""
                          }`}
                        />
                        {track.previewUrl && (
                          <button
                            onClick={(e) => togglePreview(track.previewUrl!, e)}
                            className={`absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 transition-opacity duration-200 cursor-pointer ${
                              playingUrl === track.previewUrl
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            {playingUrl === track.previewUrl ? (
                              <Pause
                                className="w-4 h-4 text-white"
                                fill="white"
                              />
                            ) : (
                              <Play
                                className="w-4 h-4 text-white ml-0.5"
                                fill="white"
                              />
                            )}
                          </button>
                        )}
                      </div>
                      {/* Title + artist */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {track.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {track.artist}
                        </p>
                      </div>
                      {/* Duration + popularity bar */}
                      <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-mono text-gray-700">
                          {formatDuration(track.duration)}
                        </span>
                        <div className="w-10 h-0.5 bg-white/6 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1DB954]/40 rounded-full"
                            style={{ width: `${track.popularity}%` }}
                          />
                        </div>
                      </div>
                    </a>
                  ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
          <span className="text-[11px] text-gray-700">
            {!loading && tracks.length > 0
              ? `${tracks.length} tracks · ${formatTotal(totalMs)} total`
              : "Data via Spotify Web API"}
          </span>
          <a
            href="https://open.spotify.com/user/4tpe4kf93p0xdnoqx82ihrkwa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-gray-700 hover:text-[#1DB954] transition-colors"
          >
            Open Profile →
          </a>
        </div>
      </div>
    </div>
  );
}

export default SpotifyStats;
