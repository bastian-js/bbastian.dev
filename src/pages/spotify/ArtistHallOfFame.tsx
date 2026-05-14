import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

type SortOption =
  | "default"
  | "name_asc"
  | "name_desc"
  | "popularity_desc"
  | "popularity_asc"
  | "followers_desc"
  | "followers_asc";

interface Artist {
  index: number;
  name: string;
  image: string;
  genres: string[];
  followers: number;
  popularity: number;
  url: string;
}

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Default", value: "default" },
  { label: "Name A–Z", value: "name_asc" },
  { label: "Name Z–A", value: "name_desc" },
  { label: "Most Popular", value: "popularity_desc" },
  { label: "Least Popular", value: "popularity_asc" },
  { label: "Most Followers", value: "followers_desc" },
  { label: "Least Followers", value: "followers_asc" },
];

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function sortArtists(artists: Artist[], sort: SortOption): Artist[] {
  const copy = [...artists];
  switch (sort) {
    case "name_asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "popularity_desc":
      return copy.sort((a, b) => b.popularity - a.popularity);
    case "popularity_asc":
      return copy.sort((a, b) => a.popularity - b.popularity);
    case "followers_desc":
      return copy.sort((a, b) => b.followers - a.followers);
    case "followers_asc":
      return copy.sort((a, b) => a.followers - b.followers);
    default:
      return copy.sort((a, b) => a.index - b.index);
  }
}

interface ArtistCardProps {
  artist: Artist;
}

function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <a
      href={artist.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/6 bg-[#111] hover:border-white/14 transition-all duration-300"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
    >
      {/* Artist image with gradient overlay */}
      <div className="relative aspect-square overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 scale-110 opacity-50"
          style={{
            backgroundImage: `url(${artist.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px)",
          }}
        />
        <img
          src={artist.image}
          alt={artist.name}
          className="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Bottom gradient for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Follower badge top-right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
          <span className="text-[10px] font-bold text-white font-mono">
            {formatFollowers(artist.followers)}
          </span>
        </div>

        {/* Name overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <p className="text-base font-bold text-white leading-snug truncate drop-shadow-lg">
            {artist.name}
          </p>
        </div>
      </div>

      {/* Genres */}
      <div className="px-3.5 py-3 flex flex-wrap gap-1.5 min-h-[44px]">
        {artist.genres.length > 0 ? (
          artist.genres.map((g) => (
            <span
              key={g}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/6 text-gray-400 border border-white/6 truncate max-w-full"
            >
              {g}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-gray-700">—</span>
        )}
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

function SpotifyArtistHallOfFame() {
  const [sort, setSort] = useState<SortOption>("default");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch("https://api.bbastian.dev/spotify/artist-hall-of-fame")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setArtists(data.artists || []);
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
  const sorted = sortArtists(artists, sort);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Artist Hall of Fame
            </h1>
            <p className="text-gray-500 text-sm text-left">
              My all-time favourite artists.
            </p>
          </div>
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {error && (
          <p className="text-gray-600 text-sm py-12">
            Could not load artists. Try again later.
          </p>
        )}

        {!error && (
          <div
            className={`transition-opacity duration-300 ${loading && initialized ? "opacity-40 pointer-events-none" : "opacity-100"}`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {showSkeleton
                ? Array.from({ length: 14 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-[#111] border border-white/6 overflow-hidden animate-pulse"
                    >
                      <div className="aspect-square bg-white/6" />
                      <div className="p-3.5 space-y-2">
                        <div className="h-3 bg-white/6 rounded w-1/2" />
                        <div className="h-3 bg-white/4 rounded w-1/3" />
                      </div>
                    </div>
                  ))
                : sorted.map((artist) => (
                    <ArtistCard key={artist.index} artist={artist} />
                  ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex items-center justify-between">
          <span className="text-[11px] text-gray-700">
            {!loading && artists.length > 0
              ? `${artists.length} artists`
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

export default SpotifyArtistHallOfFame;
