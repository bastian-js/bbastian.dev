import { useState, useEffect } from "react";
import { Music, ExternalLink } from "lucide-react";

type TimeRange = "short_term" | "medium_term" | "long_term";

interface Track {
  rank: number;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  url: string;
  duration: number;
  popularity: number;
}

const filters: { label: string; value: TimeRange }[] = [
  { label: "Last Month", value: "short_term" },
  { label: "Last 6 Months", value: "medium_term" },
  { label: "Last Year", value: "long_term" },
];

function formatDuration(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${m}:${s}`;
}

function SpotifyStats() {
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`https://api.bbastian.dev/spotify/top-tracks?time_range=${timeRange}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setTracks(data.tracks || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-24 px-4">
      {/* Header */}
      <div className="w-full max-w-2xl mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#1DB954]/15 flex items-center justify-center shrink-0">
            <Music className="w-5 h-5 text-[#1DB954]" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Top Tracks</h1>
        </div>
        <p className="text-gray-500 text-sm">My most played songs on Spotify.</p>
      </div>

      {/* Filters */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTimeRange(f.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer border ${
                timeRange === f.value
                  ? "bg-[#1DB954]/15 text-[#1DB954] border-[#1DB954]/30"
                  : "bg-white/4 text-gray-500 border-white/6 hover:border-white/12 hover:text-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Track list */}
      <div className="w-full max-w-2xl flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 bg-[#111] border border-white/6 rounded-2xl animate-pulse"
            >
              <div className="w-5 shrink-0" />
              <div className="w-12 h-12 rounded-xl bg-white/6 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/6 rounded w-3/5" />
                <div className="h-3 bg-white/4 rounded w-2/5" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-16 text-gray-600 text-sm">
            Could not load tracks. Try again later.
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-16 text-gray-600 text-sm">
            No data available for this time range.
          </div>
        ) : (
          tracks.map((track) => (
            <a
              key={track.rank}
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 bg-[#111] border border-white/6 rounded-2xl hover:border-white/12 hover:bg-white/3 transition-all duration-150 group"
            >
              <span className="text-sm font-mono text-gray-600 w-5 shrink-0 text-center">
                {track.rank}
              </span>
              <img
                src={track.albumArt}
                alt={track.album}
                className="w-12 h-12 rounded-xl shrink-0 shadow-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{track.title}</p>
                <p className="text-sm text-gray-500 truncate mt-0.5">{track.artist}</p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs text-gray-600 font-mono">
                  {formatDuration(track.duration)}
                </span>
                <span className="text-[10px] text-gray-700 truncate max-w-36">
                  {track.album}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors shrink-0" />
            </a>
          ))
        )}
      </div>

      {/* Footer credit */}
      <div className="w-full max-w-2xl mt-8 flex items-center justify-end">
        <span className="text-[11px] text-gray-700 tracking-wide uppercase font-medium">
          Via Spotify API
        </span>
      </div>
    </div>
  );
}

export default SpotifyStats;
