import { useState, useEffect, useRef } from "react";
import { Play, Pause, ChevronDown } from "lucide-react";

type SortOption =
  | "default"
  | "release_desc"
  | "release_asc"
  | "artist_asc"
  | "artist_desc"
  | "title_asc"
  | "title_desc";

interface Track {
  index: number;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  url: string;
  previewUrl: string | null;
  duration: number;
  popularity: number;
  releaseDate: string;
}

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Default", value: "default" },
  { label: "Release Date (Newest)", value: "release_desc" },
  { label: "Release Date (Oldest)", value: "release_asc" },
  { label: "Artist A–Z", value: "artist_asc" },
  { label: "Artist Z–A", value: "artist_desc" },
  { label: "Title A–Z", value: "title_asc" },
  { label: "Title Z–A", value: "title_desc" },
];

function formatDuration(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${m}:${s}`;
}

function formatReleaseYear(date: string) {
  return date?.slice(0, 4) ?? "—";
}

function sortTracks(tracks: Track[], sort: SortOption): Track[] {
  const copy = [...tracks];
  switch (sort) {
    case "release_desc":
      return copy.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    case "release_asc":
      return copy.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
    case "artist_asc":
      return copy.sort((a, b) => a.artist.localeCompare(b.artist));
    case "artist_desc":
      return copy.sort((a, b) => b.artist.localeCompare(a.artist));
    case "title_asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "title_desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return copy.sort((a, b) => a.index - b.index);
  }
}

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  onToggle: (url: string, e: React.MouseEvent) => void;
}

function TrackCard({ track, isPlaying, onToggle }: TrackCardProps) {
  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/6 bg-[#111] hover:border-white/14 transition-all duration-300"
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Album art */}
      <div className="relative aspect-square overflow-hidden">
        {/* Blurred bg glow */}
        <div
          className="absolute inset-0 scale-110 opacity-60"
          style={{
            backgroundImage: `url(${track.albumArt})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(24px)",
          }}
        />
        <img
          src={track.albumArt}
          alt={track.album}
          className={`relative w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isPlaying ? "brightness-50" : ""}`}
        />

        {/* Play button overlay */}
        {track.previewUrl && (
          <button
            onClick={(e) => onToggle(track.previewUrl!, e)}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
              isPlaying
                ? "opacity-100 bg-black/30"
                : "opacity-0 group-hover:opacity-100 bg-black/20"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center shadow-2xl shadow-black/60 transition-transform duration-200 group-hover:scale-105">
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" fill="black" />
              ) : (
                <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
              )}
            </div>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-1">
        <p className="text-sm font-bold text-white truncate leading-snug">
          {track.title}
        </p>
        <p className="text-xs text-gray-400 truncate">{track.artist}</p>
        <p className="text-[11px] text-gray-600 mt-0.5 font-mono">
          {formatReleaseYear(track.releaseDate)}
          <span className="mx-1.5 text-gray-700">·</span>
          {formatDuration(track.duration)}
        </p>
      </div>
    </a>
  );
}

function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = sortOptions.find((o) => o.value === value)!;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide border border-white/10 bg-white/4 text-gray-300 hover:border-white/18 hover:text-white transition-all duration-150 cursor-pointer"
      >
        {current.label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 bg-[#161616] shadow-2xl shadow-black/60 overflow-hidden z-50">
          {sortOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors duration-100 cursor-pointer ${
                o.value === value
                  ? "text-[#1DB954] bg-[#1DB954]/8"
                  : "text-gray-400 hover:text-white hover:bg-white/4"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SpotifyHallOfFame() {
  const [sort, setSort] = useState<SortOption>("default");
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
    setLoading(true);
    setError(false);
    fetch("https://api.bbastian.dev/spotify/hall-of-fame")
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
  }, []);

  const showSkeleton = loading && !initialized;
  const sorted = sortTracks(tracks, sort);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Hall of Fame
            </h1>
            <p className="text-gray-500 text-sm text-left">
              My all-time favourite tracks.
            </p>
          </div>
          <SortDropdown value={sort} onChange={setSort} />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {showSkeleton
                ? Array.from({ length: 26 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-[#111] border border-white/6 overflow-hidden animate-pulse"
                    >
                      <div className="aspect-square bg-white/6" />
                      <div className="p-3.5 space-y-2">
                        <div className="h-3.5 bg-white/6 rounded w-3/4" />
                        <div className="h-3 bg-white/4 rounded w-1/2" />
                        <div className="h-3 bg-white/4 rounded w-1/3" />
                      </div>
                    </div>
                  ))
                : sorted.map((track) => (
                    <TrackCard
                      key={track.index}
                      track={track}
                      isPlaying={
                        playingUrl === track.previewUrl &&
                        track.previewUrl !== null
                      }
                      onToggle={togglePreview}
                    />
                  ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex items-center justify-between">
          <span className="text-[11px] text-gray-700">
            {!loading && tracks.length > 0
              ? `${tracks.length} tracks`
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

export default SpotifyHallOfFame;
